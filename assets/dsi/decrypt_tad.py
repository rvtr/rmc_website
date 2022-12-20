from io import BytesIO
from struct import unpack
from binascii import hexlify, unhexlify
from Crypto.Cipher import AES #pip install pycryptodome
import sys

def generate_key(string):
    key_hex = int(string, 16)
    key_add = int(b"1" * 32, 16)
    combine = key_hex + key_add
    return unhexlify(b"%032X" % combine)

dsi_common_key = generate_key(b"00000000000000000000000000000000") # This does not seem to change the result of the program. Or if it does then I've just witnessed the most impossible event ever, where 10 sets of programs made with and without the common key all had identical SHA-256 hashes, all ran fine, all had everything in romfs working, and all had correct header info, while still having data changed. With a one byte difference able to completely throw off the hash... no way this data isn't the same.
wii_debug_key = generate_key(b"904F39596012A4189D7ADB21B705EB99")

def align(val): #Tads have 64-byte alignment between sections
    return val + (64 - (val % 64))

with open(sys.argv[1], "rb") as f:
    header = unpack(">I2sH6I", f.read(0x20))
    if header[1] != b"Is": #Installable? same-ish as Wii WADs
        raise BaseException("Invalid TAD file")
    if header[0] != 0x20: #header size
        raise BaseException("unknown header size %d" % header[0])
    if header[2] != 0: #WAD version according to wiibrew
        raise BaseException("unknown TAD version %d" % header[2])
    
    print("Input Tad file: %s" % sys.argv[1])
    print("Header: %08X cert %08X ticket %08X tmd %08X content %08X footer" %\
          (header[3], header[5], header[6], header[7], header[8]))
    
    with open("title.cert", "wb") as o:
        o.write(f.read(header[3]))
        f.seek(align(f.tell()))
        
    ticket = BytesIO(f.read(header[5])) #store to parse a bit
    f.seek(align(f.tell()))
    with open("title.tik", "wb") as o:
        o.write(ticket.read())
        ticket.seek(0)

    tmd = BytesIO(f.read(header[6])) #store to parse a bit
    f.seek(align(f.tell()))
    with open("title.tmd", "wb") as o:
        o.write(tmd.read())
        tmd.seek(0)

    tmd.seek(0x18C)
    title_id = tmd.read(8)
    tmd.seek(0x1DE)
    content_count, boot_index = unpack(">2H", tmd.read(4))
    print("Title ID: %016X %s" % (unpack(">Q", title_id)[0], title_id[4:].decode("UTF-8")))
    
    ticket.seek(0x1BF)
    enc_title_key = ticket.read(0x10)
    print("Encrypted Title Key: %032X" % (int(hexlify(enc_title_key), 16)))
    if content_count > 1:
        raise BaseException("Multiple contents not supported, very easy to add")

    #if you encounter multi-content files, handle tmd table here, and then assume
    #content is in a row in the content blob in the TAD

    content = BytesIO(f.read(header[7]))
    f.seek(align(f.tell()))
    with open("%08X" % boot_index, "wb") as o: #store the encrypted content
        o.write(content.read())
        content.seek(0)

    if header[8] != 0: #there is a footer
        with open("footer.bin", "wb") as o:
            o.write(f.read(header[8]))
        f.seek(align(f.tell()))

    title_id += b"\x00" * 8 #pad to 16 bytes for IV

    obj = AES.new(dsi_common_key, AES.MODE_CBC, title_id)
    dsi_dec_title_key = obj.decrypt(enc_title_key)
    obj = AES.new(wii_debug_key, AES.MODE_CBC, title_id)
    wii_dec_title_key = obj.decrypt(enc_title_key)

    #try both keys and check the srl's "reserved" bytes, we decrypt the entire file
    #because otherwise the CBC blocks get off and the start of the srl gets garbled
    obj = AES.new(dsi_dec_title_key, AES.MODE_CBC, b"\x00" * 16)
    decrypted_content = BytesIO(obj.decrypt(content.read()))
    content.seek(0)
    decrypted_content.seek(0x15) #reserved bytes
    if decrypted_content.read(7) == b"\x00" * 7: #this is an srl
        decrypted_content.seek(0xC)
        print("DSi Common Key Used")
        game_code = decrypted_content.read(6).decode("UTF-8") #for export filename
        print("Game Code: %s" % game_code)
        decrypted_content.seek(0)
        print("Output file name: %s.srl" % game_code)
        with open("%s.srl" % game_code, "wb") as o:
            o.write(decrypted_content.read())
        sys.exit(1)

    obj = AES.new(wii_dec_title_key, AES.MODE_CBC, b"\x00" * 16)
    decrypted_content = BytesIO(obj.decrypt(content.read()))
    content.seek(0)
    decrypted_content.seek(0x15) #reserved bytes
    if decrypted_content.read(7) == b"\x00" * 7: #this is an srl
        decrypted_content.seek(0xC)
        print("Wii Debug Key Used")
        game_code = decrypted_content.read(6).decode("UTF-8") #for export filename
        print("Game Code: %s" % game_code)
        decrypted_content.seek(0)
        print("Output file name: %s.srl" % game_code)
        with open("%s.srl" % game_code, "wb") as o:
            o.write(decrypted_content.read())
        sys.exit(1)

    raise BaseException("Was not able to decrypt the content, oops")

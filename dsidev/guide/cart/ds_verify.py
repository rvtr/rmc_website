import os
import sys
import struct
import shutil
import hashlib
import hmac
import argparse

from ctypes import *
from Crypto.Cipher import AES
from Crypto.Util import Counter

def read_chunks(f, size, chunk_size=0x10000):
    for _ in range(size // chunk_size):
        yield f.read(chunk_size)

    yield f.read(size % chunk_size)

def readle(b):
    return int.from_bytes(b, 'little')

def readbe(b):
    return int.from_bytes(b, 'big')

def int32tobytes(x):
    return int.to_bytes(x, 4, sys.byteorder)

def byteswap32(i):
    return struct.unpack("<I", struct.pack(">I", i))[0]

crc16tab = [0x0000, 0xC0C1, 0xC181, 0x0140, 0xC301, 0x03C0, 0x0280, 0xC241,
	0xC601, 0x06C0, 0x0780, 0xC741, 0x0500, 0xC5C1, 0xC481, 0x0440,
	0xCC01, 0x0CC0, 0x0D80, 0xCD41, 0x0F00, 0xCFC1, 0xCE81, 0x0E40,
	0x0A00, 0xCAC1, 0xCB81, 0x0B40, 0xC901, 0x09C0, 0x0880, 0xC841,
	0xD801, 0x18C0, 0x1980, 0xD941, 0x1B00, 0xDBC1, 0xDA81, 0x1A40,
	0x1E00, 0xDEC1, 0xDF81, 0x1F40, 0xDD01, 0x1DC0, 0x1C80, 0xDC41,
	0x1400, 0xD4C1, 0xD581, 0x1540, 0xD701, 0x17C0, 0x1680, 0xD641,
	0xD201, 0x12C0, 0x1380, 0xD341, 0x1100, 0xD1C1, 0xD081, 0x1040,
	0xF001, 0x30C0, 0x3180, 0xF141, 0x3300, 0xF3C1, 0xF281, 0x3240,
	0x3600, 0xF6C1, 0xF781, 0x3740, 0xF501, 0x35C0, 0x3480, 0xF441,
	0x3C00, 0xFCC1, 0xFD81, 0x3D40, 0xFF01, 0x3FC0, 0x3E80, 0xFE41,
	0xFA01, 0x3AC0, 0x3B80, 0xFB41, 0x3900, 0xF9C1, 0xF881, 0x3840,
	0x2800, 0xE8C1, 0xE981, 0x2940, 0xEB01, 0x2BC0, 0x2A80, 0xEA41,
	0xEE01, 0x2EC0, 0x2F80, 0xEF41, 0x2D00, 0xEDC1, 0xEC81, 0x2C40,
	0xE401, 0x24C0, 0x2580, 0xE541, 0x2700, 0xE7C1, 0xE681, 0x2640,
	0x2200, 0xE2C1, 0xE381, 0x2340, 0xE101, 0x21C0, 0x2080, 0xE041,
	0xA001, 0x60C0, 0x6180, 0xA141, 0x6300, 0xA3C1, 0xA281, 0x6240,
	0x6600, 0xA6C1, 0xA781, 0x6740, 0xA501, 0x65C0, 0x6480, 0xA441,
	0x6C00, 0xACC1, 0xAD81, 0x6D40, 0xAF01, 0x6FC0, 0x6E80, 0xAE41,
	0xAA01, 0x6AC0, 0x6B80, 0xAB41, 0x6900, 0xA9C1, 0xA881, 0x6840,
	0x7800, 0xB8C1, 0xB981, 0x7940, 0xBB01, 0x7BC0, 0x7A80, 0xBA41,
	0xBE01, 0x7EC0, 0x7F80, 0xBF41, 0x7D00, 0xBDC1, 0xBC81, 0x7C40,
	0xB401, 0x74C0, 0x7580, 0xB541, 0x7700, 0xB7C1, 0xB681, 0x7640,
	0x7200, 0xB2C1, 0xB381, 0x7340, 0xB101, 0x71C0, 0x7080, 0xB041,
	0x5000, 0x90C1, 0x9181, 0x5140, 0x9301, 0x53C0, 0x5280, 0x9241,
	0x9601, 0x56C0, 0x5780, 0x9741, 0x5500, 0x95C1, 0x9481, 0x5440,
	0x9C01, 0x5CC0, 0x5D80, 0x9D41, 0x5F00, 0x9FC1, 0x9E81, 0x5E40,
	0x5A00, 0x9AC1, 0x9B81, 0x5B40, 0x9901, 0x59C0, 0x5880, 0x9841,
	0x8801, 0x48C0, 0x4980, 0x8941, 0x4B00, 0x8BC1, 0x8A81, 0x4A40,
	0x4E00, 0x8EC1, 0x8F81, 0x4F40, 0x8D01, 0x4DC0, 0x4C80, 0x8C41,
	0x4400, 0x84C1, 0x8581, 0x4540, 0x8701, 0x47C0, 0x4680, 0x8641,
	0x8201, 0x42C0, 0x4380, 0x8341, 0x4100, 0x81C1, 0x8081, 0x4040]

def crc16(data): # polynomial: x**16 + x**15 + x**2 + 1, 0xA001
	crc = 0xFFFF
	for i in range(0, len(data)):
		crc = (crc >> 8) ^ crc16tab[(crc ^ data[i]) & 0xFF]
	return crc

def rol(val, r_bits, max_bits):
    return (val << r_bits % max_bits) & (2 ** max_bits - 1) | ((val & (2 ** max_bits - 1)) >> (max_bits - (r_bits % max_bits)))

def roundup(size, alignment):
	if size % alignment != 0:
		return size + alignment - (size % alignment)
	else:
		return size

class Crypto:
	def sha1(f, size, chunk_size=0x10000):
		h = hashlib.sha1()
		for _ in range(size // chunk_size):
			h.update(f.read(chunk_size))
		h.update(f.read(size % chunk_size))
		return h.digest()

class NTR:
    blowfish_key = [0x99D5205F, 0x5744F5B9, 0x6E19A4D9, 0x9E6A5A94, 0xD8AEF1EB, 0x4175E23A, 0x9382D032, 0x33EE31D5, 0xCC57619A, 0x3706A21B, 0x793972F5, 0x55AEF6BE, 0x5F1B69FB, 0xE59DF1E9, 0xCE2CD9A1, 0x5E3205E6, 0xFED3FECF, 0xD462040D, 0x8BF5ECB7, 0x2B6079BB, 0x1295310D, 0x6E3FDA2B, 0x8884F0F1, 0x3D127E25, 0x4522F1BB, 0x24061A06, 0x11ADDF28, 0x8B648134, 0x2BEB3329, 0x99AAF2BD, 0x9C14959D, 0x9FF7F58C, 0x7297A129, 0x9DD15FCF, 0x664D071A, 0xDED34A4B, 0x85C9A7A3, 0x1795053A, 0x3D490ABF, 0x0A898BA2, 0x4A8249DD, 0x2790F10B, 0xE9EB1C6A, 0x83764505, 0xBA817061, 0x173F4BDE, 0xAECFAB39, 0x57F23A56, 0x4811AD8A, 0x40E1453F, 0xFA9B0254, 0xCAA693FB, 0xEF4DFE6F, 0xA3D8879C, 0x08BAD548, 0x6A8D2DFD, 0x6E15F874, 0xBDBE528B, 0x18228A9E, 0xFB743707, 0x1B366C4A, 0x19BA4262, 0xB9799110, 0x7B676596, 0xFE0223E8, 0xEE998C77, 0x3E5C8664, 0x4D6D7886, 0xA54F65E2, 0x1EB2DF5A, 0x0AD07E08, 0x14B071AC, 0xBDDB831C, 0xB9D7A162, 0xCDC6637C, 0x5269C3E6, 0xBF75CE12, 0x445D2104, 0xFAFBD33C, 0x381163D4, 0x95854149, 0x4609F208, 0x4311DC1F, 0x76C0156D, 0x1F3C6370, 0xEA87806C, 0xC3BD638B, 0xC2372137, 0xDCEE0923, 0x2E376A4D, 0x7390F750, 0x30AC1C92, 0x04102391, 0x4FD207AA, 0x683E4F9A, 0xC964606A, 0xC81421F3, 0xD6224112, 0x4424CFE6, 0x8A56DD0D, 0x534DE185, 0x1E8C525A, 0x9C1984C2, 0x0357F16F, 0xE300BE58, 0xF64CEDD5, 0x21649C1F, 0xBE55033C, 0x4ADCFFAA, 0xC9DAE05D, 0x5EBFE6DE, 0xF5D8B1F8, 0xFF36B3B9, 0x626795DB, 0x315F37ED, 0x4C706799, 0x90B51831, 0x6C3D9999, 0xE442DAD3, 0x254213A0, 0xAED7706C, 0xB155CFC7, 0xD746D543, 0x61173D44, 0x28E93385, 0xD5D0A293, 0xAA25121F, 0xFBC50B46, 0xF5977656, 0x45A6BE87, 0xB1946BE8, 0xB1FE3399, 0xAE1F3E6C, 0x39711D09, 0x009037E4, 0x103E7574, 0xFF8C833B, 0xB0F1B0F9, 0x01054742, 0x95F1D6AC, 0x7E38E69E, 0x9574263F, 0xB4685018, 0xD04330B4, 0x4C4BE368, 0xBFE54DB6, 0x958B0AA0, 0x74253277, 0xCFA1F72C, 0xD871135A, 0xABEAC951, 0xE80DEEEF, 0xE9937E19, 0xA71E4338, 0x81162CA1, 0x48E373CC, 0x29216CD3, 0x5DCEA0D9, 0x617143A0, 0x1513B564, 0x92CF2A19, 0xDCADB7A5, 0x9F8665F8, 0x1A9FE7FB, 0xF7FDB813, 0x6C27DB6F, 0xDF351CF7, 0x8D2C5B9B, 0x12AB3864, 0x06CCDE31, 0xE84E7511, 0x64E3FAEA, 0xEB3454C2, 0xAD3F34EB, 0x932C7D26, 0x369D56F3, 0x5AE1F6B3, 0x98634A9E, 0x3283E49A, 0x84607D90, 0x2E130EEE, 0x934B36A2, 0x85EC1638, 0xE8880602, 0xBFF0A03A, 0xEDD76A9A, 0x73E157CF, 0xF844B8DC, 0x2E2359D1, 0xDF955271, 0x9961A04B, 0xD57F6E78, 0xBAA9C530, 0xD3408632, 0x9D320C9C, 0x37B7022F, 0xBA5498A9, 0xC41304C9, 0x8DBEC8E7, 0x5D97502E, 0x93D62259, 0x0C27BC22, 0x92E0A720, 0x0F936F7F, 0x4C9FD3B5, 0xA62A0B74, 0x67497D10, 0x26CBD1C5, 0x8671E78C, 0xA09CE95B, 0xB21AF601, 0xEE8C9E5E, 0x83F21ADB, 0xE6E5EA84, 0x5976D27C, 0xF68DA549, 0x3648C216, 0x52BB83A3, 0x74B9070C, 0x3BFF6128, 0xE161E9E4, 0xEF6E15AA, 0x4EBAE85D, 0x0596BB32, 0x56B0FB72, 0x520F0EC8, 0x42256576, 0x89AFF2DE, 0x1027F001, 0x4B74A797, 0x07D52654, 0x54091F82, 0x0A867D30, 0x390EB326, 0x9B0B57BB, 0x360631AF, 0xFD79FCD9, 0x30102B0C, 0xB3E19BD7, 0x7BDC5FEF, 0xD2F81345, 0x4D4775BD, 0x46963C7E, 0x75F33EB5, 0x67C59A3B, 0xB05B296B, 0xDE805BC8, 0x1505B131, 0xB6CE49DD, 0xAD84B5AE, 0x60DC6731, 0x3430FE4E, 0xBD802FA6, 0xBF633921, 0x86D9357F, 0x16682205, 0x54E99026, 0x8C076C51, 0xA43155D7, 0x0907A83E, 0x2E5366C1, 0xF8F27BC4, 0xF258CFF1, 0x87C5A2E7, 0x278F3087, 0x58A06462, 0x2318B988, 0x7CFACEC4, 0x98AEAD17, 0xCC4A5BF3, 0xE948D556, 0xD30DF2C8, 0x92738CDB, 0xD72F56AC, 0x81F99269, 0x4DC632F6, 0xE6C08D21, 0xE2768061, 0x11BCDC6C, 0x93AF1969, 0x9BD0BFB9, 0x319F0267, 0xA351EE83, 0x06227B0C, 0xAB494240, 0xB8D5017D, 0xCE5EF755, 0x5339C599, 0x46D8879F, 0xBAF764B4, 0xE39AFAA1, 0x6D906810, 0x30CA8A54, 0xA79F60C3, 0x19F56B0D, 0x7A5198E6, 0x984351B4, 0xD635E94F, 0xC3DF0F7B, 0xD62F5CBD, 0x3A156119, 0xF14BCBAA, 0xDC6D64C9, 0xD3C61E56, 0xEF384C50, 0x718675CC, 0x0D0D4EE9, 0x28F6065D, 0x701BAAD3, 0x45CFA839, 0xAC95A62E, 0xB4E422D4, 0x74A8375F, 0x487A04CC, 0xA54C40D8, 0x28B42808, 0x0D1C7252, 0x41F07D47, 0x193A534E, 0x5884626B, 0x93B58A81, 0x214E0DDC, 0xB43FA2C6, 0xFCC92B40, 0xDA3804E9, 0x5E5A866B, 0x0C222585, 0x68118D7C, 0x921D9555, 0x4DAB8EBB, 0xDAA6E6B7, 0x51B6325A, 0x0541DD05, 0x2A0A5650, 0x911747CC, 0xC9E67EB5, 0x614ADB73, 0x6751C833, 0xF5DA6E74, 0x2E54C337, 0x0D6DAF08, 0xE8158A5F, 0xE25921CD, 0xA8DE0C06, 0x5A776B5F, 0xDB18653E, 0xC850DE78, 0xE0B882B3, 0x5D4E7232, 0x074FC134, 0x23BA96B7, 0x674EA428, 0x1E3462EB, 0x2D6A70E9, 0x2F42C470, 0x4E5A319C, 0xF95B4728, 0xAADA716F, 0x381FB378, 0xC4926B1C, 0x9EF6359A, 0xB74D0EBF, 0xCC182941, 0x0348355D, 0x55D02BC6, 0x29AF5C60, 0x74698E5E, 0x9B7CD4BD, 0x7B44647D, 0x3F925D69, 0xB61F004B, 0xD48335CF, 0x7E644E17, 0xAE8DD52E, 0x9A28124E, 0x2E2B4908, 0x5CAEC646, 0x85AE4161, 0x1E6F82D2, 0x5137161F, 0x0BF659A4, 0x9ACA5AAF, 0x0DD4338B, 0x2063F184, 0x805CCBCF, 0x08B4B9D3, 0x1605BD62, 0x83319B56, 0x51989FBA, 0xB25BAAB2, 0x226B2CB5, 0xD448FA63, 0x2B5F58FA, 0x61FA6409, 0xBB38E0B8, 0x9D9260A8, 0x0D676F0E, 0x37F50D01, 0x9FC277D4, 0xFEECF173, 0x3039E07D, 0xF56198E4, 0x2C285504, 0x5655DB2F, 0x6BECE558, 0x06B66480, 0x6A2A1A4E, 0x5B0FD8C4, 0x0A2E5219, 0xD962F530, 0x48BE8C7B, 0x4F389BA2, 0xC3AFC9D3, 0xC7C16241, 0x86B96121, 0x576F994F, 0xC1BACE7B, 0xB53B4D5E, 0x8A8B4457, 0x5F135F70, 0x6D5B2947, 0xDC38E2EC, 0x04556512, 0x2AE81743, 0xE18EDD2A, 0xB3E294F7, 0x096E5CE6, 0xEB8AF86D, 0x89495448, 0xF52FADBF, 0xEA944BCA, 0xFC398782, 0x5F8A01F2, 0x75F2E671, 0xD6D842DE, 0xF12D1D28, 0xA6887EA3, 0xA0471D30, 0xD9A371DF, 0x491CCB01, 0xF836B1F2, 0xF022585D, 0x456BBDA0, 0xBBB28842, 0xC78C28CE, 0x93E89063, 0x08907C89, 0x3CF57DB7, 0x042D4F55, 0x5116FD7E, 0x79E8BEC1, 0xF212D4F8, 0xB4840523, 0xA0CCD22B, 0xFDE1ABAD, 0x0DD1556C, 0x2341944D, 0x77374F05, 0x280CBF17, 0xB312676C, 0x8CC35AF7, 0x41842A6D, 0xD0941227, 0x2CB4ED9C, 0x4DEC4782, 0x97D567B9, 0x1B9DC055, 0x077EE58E, 0xE2A8E73E, 0x12E40E3A, 0x2A455534, 0xA2F92D5A, 0x1BAB527C, 0x83105F55, 0xD2F15A43, 0x2BC6A7A4, 0x891595E8, 0xB44B9DF8, 0x75E39F60, 0x785BD6E6, 0x0D44E621, 0x06BD4722, 0x53A400AD, 0x8D431385, 0x39F7AAFC, 0x38AF7BED, 0xFCE42B54, 0x50984CFC, 0x8580F7DF, 0x3C8022E1, 0x94DADE24, 0xC6B07A39, 0x38DC0FA1, 0xA7F4F96F, 0x6318578B, 0x84412A2E, 0xD453F2D9, 0x000FD0DD, 0x996E19A6, 0x0AD0EC5B, 0x5824ABC0, 0xCB0665EC, 0x1A133894, 0x0A67032F, 0x3FF7E377, 0x447733C6, 0x1439D0E3, 0xC0A20879, 0xBB409957, 0x410B0190, 0xCDE1CC48, 0x67DBB3AF, 0x8874F34C, 0x828F72B1, 0xB52329C4, 0x126C19FC, 0x8E46A49C, 0xC4256587, 0xD36DBE8A, 0x93110338, 0xED832BF3, 0x46A493EA, 0x3B53851D, 0xCED4F108, 0x8327EDFC, 0x9B1A18BC, 0xF98BAEDC, 0x24AB5038, 0xE9724B10, 0x22177B46, 0x5DAB5964, 0xF340AEF8, 0xBBE5C8F9, 0x26034E55, 0x7DEBEBFE, 0xF739E6E0, 0x0A11BE2E, 0x28FF98ED, 0xC0C94256, 0x42C3FD00, 0xF6AF87A2, 0x5B013F32, 0x9247959A, 0x72A5323D, 0xAE6BD09B, 0x07D24992, 0xE3784AFA, 0xA1067DF2, 0x41CF7774, 0x0414B20C, 0x86846416, 0xD5BB51A1, 0xE56FF1D1, 0xF2E2F75F, 0x58204DB8, 0x57C7CFDD, 0xC5D8BE76, 0x3DF65F7E, 0xE72A8B88, 0x241B383F, 0x0E412377, 0xF5F04BD4, 0x0C1FFAA4, 0x0B805FCF, 0x45F6E0DA, 0x2F345953, 0xFB203C52, 0x625E35B5, 0x62FE8B60, 0x63E3865A, 0x151A6ED1, 0x4745BC32, 0xB4EB6738, 0xABE46E33, 0x3AB5EDA3, 0xAD67E04E, 0x4195EE62, 0x6271261D, 0x31EF6230, 0xAFD782AC, 0xC2DC0504, 0xF59707BF, 0x11592307, 0xC06402E8, 0x97E53EAF, 0x18AC59A6, 0x8B4A3390, 0x1C6E7C9C, 0x207E4C3C, 0x3E6164BB, 0xC56B7C7E, 0x3E9FC54C, 0x9FEA73F5, 0xD789C04C, 0xF4FBF42D, 0xEC141B51, 0xD5C112C8, 0x10DF0B4A, 0x8B9CBC93, 0x456A3E3E, 0x7DC1A9BA, 0xCDC1B407, 0xE4E16886, 0x43B26D38, 0xF3FB0C5C, 0x663771DE, 0x56EF6EA0, 0x104065A7, 0x98F7D0BE, 0x0EC83736, 0xEC10CA7C, 0x9CAB841E, 0x05177602, 0x1C4F52AA, 0x5FC1C6A0, 0x56B9D804, 0x84444DA7, 0x59D8DE60, 0xE6380E05, 0x8F03E13B, 0x6D810433, 0x6F300BCE, 0x69052133, 0xFB26BB89, 0x7DB6AE87, 0x7E5107E0, 0xACF7960A, 0x6BF9C45C, 0x1DE44447, 0xB85EFAE3, 0x78845542, 0x4B485EF7, 0x7D473586, 0x1D2B4305, 0x03EC8AB8, 0x1E063C76, 0x0C481A43, 0xA7B78AED, 0x1E13C643, 0xEE10EFDB, 0xECFB3C83, 0xB29544EF, 0xD854514E, 0x2D11441D, 0xFB36591E, 0x7A34C1C3, 0xCA570061, 0xEA67A516, 0x9B55D055, 0xE17FD936, 0xD24076AE, 0xDC01CEB0, 0x7A83D5CB, 0x2098EC6B, 0xC1729234, 0xF3825737, 0x628A3236, 0x0C9043AE, 0xAE5C9B78, 0x8E136502, 0xFD6871C1, 0xFEB031A0, 0x2482B0C3, 0xB17969A7, 0xF5D2EBD0, 0x82C032DC, 0x9EC7263C, 0x6D8D98C1, 0xBB22D4D0, 0x0F33EC3E, 0xB9CCE1DC, 0x6A4C7736, 0x141CF9BF, 0x819F285F, 0x71853229, 0x907548C4, 0xB34ACED8, 0x448F142F, 0xFD4057EF, 0xAA0875D9, 0x46D1D66E, 0x32551FC3, 0x18FE841F, 0xFC84D5FF, 0x715E1B48, 0xC386950E, 0x280827D3, 0x3883717B, 0x4C806354, 0x9A56B0AC, 0xCF80CA31, 0x09EFFEF3, 0xBEAF247E, 0xA6FE533F, 0xC28D4A33, 0x68D122A6, 0x66AD7BEA, 0xDEB643B0, 0xA1259500, 0xA33F7546, 0x141144EC, 0xD795BC92, 0xF04FA916, 0x53629760, 0x2A0F41F1, 0x7124BEEE, 0x947F08CD, 0x6093B385, 0x5B07003F, 0xD80F2883, 0x9AD1699F, 0xD1DA2EC3, 0x9001A2B9, 0x6B4E2A66, 0x9DDAAEA6, 0xEA2AD368, 0x2F0C0C9C, 0xD28C4AED, 0xE29E5765, 0x9D0987A3, 0xB4C4325D, 0xC9D4322B, 0xB1E0711E, 0x644DE690, 0x71E31E40, 0xED7DF384, 0x0EEDC878, 0x76AEC071, 0x2772BB05, 0xEA0264FB, 0xF3486BB5, 0x42933FED, 0x9F1353D2, 0xF7FE2AEC, 0x1D4725DB, 0x3C9186C6, 0x8EF011FD, 0x237436F7, 0xA4F59E7A, 0x7E535044, 0xD447CAD3, 0xEB386DE6, 0xD971947F, 0x4AC6694B, 0x11F452EA, 0x22FE8AB0, 0x36678B59, 0xE8E6802A, 0xEB650413, 0xEEECDC9E, 0x5FB1EC05, 0x6A59E69F, 0x5E596B89, 0xBFF71ACA, 0x44F95B6A, 0x718503E4, 0x2962E070, 0x6F41C4CF, 0xB2B1CCE3, 0x7EA607A8, 0x87E77F84, 0x93DB524B, 0x6CEC7EDD, 0xD4244810, 0x699F0460, 0x74E64818, 0xF3E42CB9, 0x4F2E507A, 0xDFD45469, 0x2B8BA7F3, 0xCEFF1FF3, 0x3E260139, 0x17958489, 0xB0F04C4B, 0x82919FC4, 0x4BAC9DA5, 0x74AF1725, 0xC9CA32D3, 0xBC898A84, 0x89CC0DAE, 0x7CA2DB9C, 0x6A7891EE, 0xEA765D4E, 0x8760F569, 0x1567D402, 0xCFAF4836, 0x07EABF6F, 0x662D068F, 0xC49AFEF9, 0xF6908775, 0xB8F7AD0F, 0x76105A3D, 0x59B02EB3, 0xC7352CCC, 0x70562BCB, 0xE33796C5, 0x2F461B8A, 0x2246C788, 0xA7263298, 0x61DF8622, 0x8AF41C2F, 0x87A109AA, 0xCCA9AED3, 0xBD00451C, 0x9A548786, 0x5287EFFF, 0x1E8FA18F, 0xC1895C35, 0x1BDA2D3A, 0x2C16B2C2, 0xF156E278, 0xC16B6397, 0xC5568FC9, 0x327F2CAA, 0xAFA6A8AC, 0x20912288, 0xDEE4608B, 0xF94B4225, 0x1AE37F9C, 0x2C19893A, 0x7E05D436, 0xCC6958C2, 0xC1328B2F, 0x9085EB7A, 0x3950A5A1, 0x2792C566, 0xB0204F58, 0x7E558343, 0x2B45E29C, 0xE4D81290, 0x2C168356, 0x167903B3, 0xAD2D6118, 0x1A131F37, 0xE2E19C73, 0x7B80D5FD, 0x2D5187FC, 0x7BAAD71F, 0x2C7A8EAF, 0xF48DBBCD, 0x95117C72, 0x0BEE6FE2, 0xB9AFDE37, 0x83DE8C8D, 0x620567B7, 0x96C68D56, 0xB60DD762, 0xBAD64636, 0xBD8EC8E6, 0xEA2A6C10, 0x14FF6B5B, 0xFA823C46, 0xB1304346, 0x518A7D9B, 0x923E8379, 0x5B555DB2, 0x6C5ECE90, 0x628E5398, 0xC90D6DE5, 0x2D57CDC5, 0x8157BAE1, 0xE8B88F72, 0xE54F13DC, 0xEA9D7115, 0x10B21188, 0xD509D47F, 0x5B657F2C, 0x3B384C11, 0x68508DFB, 0x9EB059BF, 0x9480894A, 0xC51A1812, 0x8953D14A, 0x1029E88C, 0x1CECB6EA, 0x46C7178B, 0x251531A8, 0xA26B43B1, 0x9DE2DB0B, 0x879BB011, 0x040E71D2, 0x29778982, 0x0A66417F, 0x1D0B48FF, 0x72BB24FD, 0xC248A19B, 0xFE7B7FCE, 0x88DB86D9, 0x853B1CB0, 0xDCA83307, 0xBF512EE3, 0x0E9A0097, 0x1E06C097, 0x439DD8B6, 0x45C48667, 0x5F00F888, 0x9AA4529E, 0xC7AA8A83, 0x75ECC518, 0xAECEC32F, 0x1A2BF918, 0xFFAE1AF5, 0x530BB533, 0x51A7FDE8, 0xA8E1A264, 0xB6221743, 0x80CC0AD8, 0xAE3BBA40, 0xD7D9924A, 0x89DF0410, 0xEE9B182B, 0x6A77698A, 0x68F4F9B9, 0xA221156E, 0xE61E3B03, 0x62309B60, 0x417E259B, 0x9E8FC552, 0x1008F8C2, 0x69A12111, 0x88375E79, 0x3566FF10, 0x42186EED, 0x97B66B1C, 0x4E36E56D, 0x7DB4E4BF, 0x20B9E005, 0x3A69D5B8, 0xE3D5DCE0, 0xB9AC533E, 0x07A457AD, 0x77FF4818, 0x762AAC49, 0x2A8E4775, 0x6D9F6763, 0x30358C39, 0x0539D56F, 0x643A5BAD, 0xCA0BBB82, 0x529945B1, 0x93363699, 0xAF132044, 0x36D80244, 0x09399285, 0xFF4A4A97, 0x87A663D7, 0xC7B5B524, 0xED0FB46F, 0x0C585214, 0xD9A67BD3, 0x79BC3858, 0xA1BD3B84, 0x06D81A06, 0xFD6BA8EA, 0x4B692804, 0x37AD8299, 0xFB0E1B85, 0xBDA85D73, 0xCDDC5875, 0x0ABE636C, 0x48E74CE4, 0x302B0460, 0xB915D8DA, 0x8681758F, 0x96D48D1C, 0x5D70857C, 0x1C677BD5, 0x0867A6CE, 0x4B0A6670, 0xB7E563D4, 0x5B8A82EA, 0x1067CAE2, 0xF4EF1785, 0x2F2A5F8A, 0x9782F86A, 0xD63410EA, 0xEBC95C3C, 0xE149F846, 0xEBDEBDF6, 0xA992F1AA, 0xA6A018B0, 0x3AD30F1F, 0xF36FFF31, 0x454344D3, 0x509AF788, 0x0996C1CE, 0x76CCF22C, 0x2CBAAD82, 0x778F1884, 0xC0D2079C, 0x3690834E, 0x0BA54F43, 0x3E04AB78, 0x4FD6FB09, 0x012490DA, 0x6F3C3A61, 0x0D7F694A, 0xEB2B3002, 0xB4DBE084, 0xA9ECD735, 0xBF377D85, 0x58CEA94E, 0xE480C7A8, 0xD3306748, 0xEB29AF2F, 0x746AB4A7, 0x3F0F3F92, 0xAFF3CAAC, 0xAF4BD994, 0xC043CA81, 0x0D2F48A1, 0xB027D5D2, 0xEF4B0585, 0xA3DE4D93, 0x303CF0BB, 0x4A8F3027, 0x4CEBE33E, 0x64ED9A2F, 0x3BF182F0, 0xBAF4CF7F, 0x40CBB0E1, 0x7FBCAA57, 0xD3C974F2, 0xFA430D22, 0xD0F4774E, 0x93D78570, 0x1F99BFB6, 0xDE35F130, 0xA75E71F0, 0x6B012D7B, 0x64F03353, 0x0A3988F3, 0x6B3AA66B, 0x35D22F43, 0xCD02FDB5, 0xE9BC5BAA, 0xD8A4197E, 0x0E5D9481, 0x9E6F77AD, 0xD60E7493, 0x96E7C418, 0x5FADF519]

class TWL: # For tuples: index 0 for retail, index 1 for dev
    # RSA public keys
    rsa_key_mod = [
        (bytes.fromhex('C30293DEC05271302D4D22BADAA27379D4D9DE9EFD301DF50E7188D95F9CEE49B09D19AF0C76381C1C7D489AE02128B8B174074CCE83102B777C915B89CBD3450E799C15158E474E8C389E3786780EFD1E373AE103ED03F9084DE6DB4B005D27392C73E5B9B833054D2E2BFA4747F54A73A3F5B969FDD5F20EFAA3CF1DFE3359'), bytes.fromhex('bcfda1ff1f66dfecb469f8f7430c5d0f00d7204942060329850b99596198706efff6b47066f0dd8fdce9f20dd0211d77b89c5187c0b133ab13960b47b8424a0dc377e187b16b2431108a47f232f4c9782513d480100552c3e7507b2949ce93d98f2ab54dd1c191d807161015ffd6848f543d915b374548e46b62d2119b0d7169')),
        (bytes.fromhex('B618D86128CB5C6F05FCD709183FB2D06B7DEED998DC4FDDC1A85918FBB065BD65809CC768A14EDC18AA7BCBB9A07CFC1FAB865DED9C2C5C6D07D9FCC29B7A9D7C3A7333B7E8048681C85C7DB3957DC9EC66072F8BB26D13C46CF0BA27823318D4316AB2ADBC37066A2EE9735F3A57C7D7F88EC1B93D3FD4E5276FB4008BB719'), bytes.fromhex('e99ea79f594df4a76004bd47f2b364cd1679c14739f6a9f8ee1ad072cf43970c93a1384e13406c105943e2712954142cc5da594db46aef85616f7f1c59342cc624f37bc3b740d146f890b7c29850af955242dbacd67ea9c33d1b51560706d00b01bb5893eaa02cc77d6a317ec9e2dafe1f2e9da75484dc28b918ea16f295556d')),
        (bytes.fromhex('DA940901D5B7D3C511460C4119BC8ABAD1562888440710ABC5B8E306CEA65BE40752E28985566DE4CD5CBDFA4575FE581CE3509E3C67405E0F46396A3C48066ECEDD308341B5804DD9B864A3F048C9ECACC9CFAFF9B6460449617BE2A3A72588D3EDA5F3768492002C96BCB4389C0256564FEDC2A34E4B8861000316A58F5783'), bytes.fromhex('a79f54a0c745aef663a753b70acc0bcb65e111c60515b56ebdac0ccaf47c687af90e5d985bc84d223ba3be8b5b7f26449fc44844b132b7be63bad6c110cef6ed478fe1ff7f5ad55d94382fa1d4ef82b10dc443ecbe77b6829cfa178784822546fbd605c89a7ead44400d359c45446436614bf7e6315c7d9673e8acb4e35ed19d')),
        (bytes.fromhex('956F790DF08BB85A76AAEFA27FE874758BED9EDF9E9A670CD818BEB9B2885203B3FA11AEAA186513B5D6BB85A384D0D0EFB366CBC6051AAA86827AB74311F59C9BFC6C7079D5F17BD0819F522056738C721F40CF2361932590A3C5DC94CFD17A8CBC954A918AA858F4D804BAF7D3C1C4D7B8F077012FA170260B2C049056F3A5'), bytes.fromhex('ac93bb3c155c5f25b04c37a42d85291d7a9d2dd579b55db108209cf04c562797f87e3ecb9406059400929bb05b06f6afaa9ca5f011a78acb0c11d60c3d30ac51795ab57f119274488281bf3bfa93bf6b5b3f86964fcc9012b2398d68167bc687f1f5606239fb107e487fdd82383876b5ce214bc96f318d23573db66ceec20d11'))
    ]

    # HMAC keys
    hmac_key = bytes.fromhex('2106C0DEBA98CE3FA692E39D46F2ED0176E3CC08562363FACAD4ECDF9A6278348F6D633CFE22CA9220889723D2CFAEC232678DFECA836498ACFD3E3787465824')
    hmac_key_whitelist12 = bytes.fromhex('61BDDD727E72BEDEAD3ADF7F3D2DF7A5167EB4C97C6C007C57BB948A64CD4E1C516BBDDB1DEB54E93427F931515E894E7FD97CE992440FEF6BB612216888D8EE')
    hmac_key_whitelist34 = bytes.fromhex('852948F3A1BB1330935DB8C9A59AE830C4D04ADDA49281FD4FA132FA4605DE687BA7D75BC93AC88DCD253A173CC2D6E0D2E5B9FB49F94D05701029517AC58949')

    def key_scrambler(keyX, keyY):
        return rol((keyX ^ keyY) + 0xFFFEFB4E295902582A680F5F1A4F3E79, 42, 128).to_bytes(0x10, 'big')
    
    def aes_ctr(cipher, data):
        def rev_block(data):
            return b''.join([data[i:i + 16].ljust(16, b'\x00')[::-1] for i in range(0, len(data), 16)])
        data_out = cipher.decrypt(rev_block(data))
        return rev_block(data_out)[:len(data)]

magic30 = 0x72636E65 # 'encr'
magic34 = 0x6A624F79 # 'yObj'
decrypted_id = 0xE7FFDEFF
sec_area_id_special = { # Non-standard decryption values
    'YV5P': (0xD0D48B67, 0x39392F23), # Dragon Quest 5 (EU)
    'YV5E': (0x014A191A, 0xA5C470B9), # Dragon Quest 5 (USA)
    'YV5J': (0x7829BC8D, 0x9968EF44), # Dragon Quest 5 (JP)
    'CP5P': (0xC4A15AB8, 0xD2E667C8), # Prince of Persia (EU)
    'CP5E': (0xD5E97D20, 0x21B2A159), # Prince of Persia (USA)
}
block_size = 512

def mod_add(a, b):
    return (a + b) % (2 ** 32)

def blowfish_encrypt(key, xl, xr): # xl and xr are u32
    a = xl
    b = xr
    for i in range(0, 16):
        c = key[i] ^ a
        a = b ^ f(key, c)
        b = c

    xr = a ^ key[16]
    xl = b ^ key[17]
    return xl, xr

def blowfish_decrypt(key, xl, xr):
    a = xl
    b = xr
    for i in range(17, 1, -1):
        c = key[i] ^ a
        a = b ^ f(key, c)
        b = c
    
    xl = b ^ key[0]
    xr = a ^ key[1]
    return xl, xr

def f(key, v):
    a = key[18 + 0 + ((v >> 24) & 0xFF)]
    b = key[18 + 256 + ((v >> 16) & 0xFF)]
    c = key[18 + 512 + ((v >> 8) & 0xFF)]
    d = key[18 + 768 + ((v >> 0) & 0xFF)]

    return mod_add((mod_add(a, b) ^ c), d)
 
def apply_keycode(key, mod, keycode): # keycode is an array of size 3
    mod //= 4

    keycode[2], keycode[1] = blowfish_encrypt(key, keycode[2], keycode[1])
    keycode[1], keycode[0] = blowfish_encrypt(key, keycode[1], keycode[0])

    tmp1 = tmp2 = 0
    for i in range(0, 18):
        key[i] ^= byteswap32(keycode[i % mod])
    for i in range(0, 18 + 1024, 2):
        tmp1, tmp2 = blowfish_encrypt(key, tmp1, tmp2)
        key[i + 0] = tmp1
        key[i + 1] = tmp2
    
    return key

def init_keycode(key, gamecode, level, mod):
    key = [byteswap32(i) for i in key] # Original table is raw bytes which is big endian
    keycode = [gamecode, gamecode // 2, gamecode * 2]

    if level >= 1:
        key = apply_keycode(key, mod, keycode)
    if level >= 2:
        key = apply_keycode(key, mod, keycode)
    keycode[1] *= 2
    keycode[2] //= 2
    if level >= 3:
        key = apply_keycode(key, mod, keycode)
    
    return key

def get_rsa_key_idx(hdr, hdr_ext): # The RSA key to be used depends on which bits in the titleID are set
    if hdr.unit_code == 0 and (hdr_ext.flags >> 6) & 1:
        return 3
    elif hdr.unit_code == 2 or hdr.unit_code == 3:
        if (hdr_ext.titleID_hi >> 1) & 1:
            return 0
        elif (hdr_ext.titleID_hi >> 4) & 1:
            return 2
        elif hdr_ext.titleID_hi & 1:
            return 1
        else:
            return 3

class NTRBaseHdr(Structure): # For all games, 0x0 - 0x17F
    _pack_ = 1

    _fields_ = [
        ('game_title', c_char * 12),
        ('game_code', c_char * 4),
        ('maker_code', c_char * 2),
        ('unit_code', c_uint8),
        ('encryption_seed_select', c_uint8),
        ('device_capacity', c_uint8),
        ('reserved1', c_uint8 * 7),
        ('data1', c_uint8), # DS: reserved, DSi enhanced/exclusive: crypto flags
        ('data2', c_uint8), # DS: region, DSi enhanced/exclusive: permit jump
        ('rom_ver', c_uint8),
        ('autostart', c_uint8),
        ('arm9_rom_offset', c_uint32),
        ('arm9_entry_addr', c_uint32),
        ('arm9_ram_addr', c_uint32),
        ('arm9_size', c_uint32),
        ('arm7_rom_offset', c_uint32),
        ('arm7_entry_addr', c_uint32),
        ('arm7_ram_addr', c_uint32),
        ('arm7_size', c_uint32),
        ('fnt_offset', c_uint32),
        ('fnt_size', c_uint32),
        ('fat_offset', c_uint32),
        ('fat_size', c_uint32),
        ('arm9_overlay_offset', c_uint32),
        ('arm9_overlay_size', c_uint32),
        ('arm7_overlay_offset', c_uint32),
        ('arm7_overlay_size', c_uint32),
        ('rom_control_normal', c_uint32),
        ('rom_control_key1', c_uint32),
        ('banner_offset', c_uint32),
        ('secure_area_crc', c_uint16),
        ('secure_area_delay', c_uint16),
        ('arm9_autoload_ram_addr', c_uint32),
        ('arm7_autoload_ram_addr', c_uint32),
        ('secure_area_disable', c_uint64),
        ('ntr_rom_size', c_uint32),
        ('hdr_size', c_uint32),
        ('data3', c_uint32), # DS: unknown, DS games after DSi / DSi enhanced/exclusive: ARM9 parameters table offset
        ('data4', c_uint32), # DS: reserved, DS games after DSi / DSi enhanced/exclusive: ARM7 parameters table offset
        ('data5', c_uint16), # DS: reserved, DSi enhanced/exclusive: NTR ROM region end
        ('data6', c_uint16), # DS: reserved, DSi enhanced/exclusive: TWL ROM region start
        ('nand_rom_end', c_uint16),
        ('nand_rw_start', c_uint16),
        ('reserved2', c_uint8 * 0x28),
        ('logo', c_uint8 * 0x9C),
        ('logo_crc', c_uint16),
        ('hdr_crc', c_uint16),
        ('debug_rom_offset', c_uint32),
        ('debug_size', c_uint32),
        ('debug_ram_addr', c_uint32),
        ('reserved3', c_uint8 * 0x14)
    ]

    def __new__(cls, buf):
        return cls.from_buffer_copy(buf)
    
    def __init__(self, data):
        pass

class NTRExtendedHdr(Structure): # For DS games released after the DSi, 0x1BF - 0x1000
    _pack_ = 1

    _fields_ = [
        ('flags', c_uint8),
        ('reserved1', c_uint8 * 0x17C),
        ('banner_hmac', c_uint8 * 20),
        ('reserved2', c_uint8 * 0x28),
        ('hdr_arm9_arm7_hmac', c_uint8 * 20),
        ('arm9overlay_fat_hmac', c_uint8 * 20),
        ('reserved3', c_uint8 * 0xBE0),
        ('sig', c_uint8 * 0x80)
    ]

    def __new__(cls, buf):
        return cls.from_buffer_copy(buf)
    
    def __init__(self, data):
        pass

class TWLExtendedHdr(Structure): # For DSi enhanced or exclusive games, 0x180 - 0x1000
    _pack_ = 1

    _fields_ = [
        ('global_mbk1_5_settings', c_uint8 * 20),
        ('local_mbk6_8_settings_wram_arm9', c_uint8 * 12),
        ('local_mbk6_8_settings_wram_arm7', c_uint8 * 12),
        ('global_mbk9_wram_write_protect', c_uint8 * 3),
        ('global_wramcnt', c_uint8),
        ('region', c_uint32),
        ('access_control', c_uint32),
        ('arm7_scfg_ext7', c_uint32),
        ('reserved1', c_uint8 * 3),
        ('flags', c_uint8),
        ('arm9i_rom_offset', c_uint32),
        ('reserved2', c_uint32),
        ('arm9i_ram_addr', c_uint32),
        ('arm9i_size', c_uint32),
        ('arm7i_rom_offset', c_uint32),
        ('arm7i_ram_addr_sd', c_uint32),
        ('arm7i_ram_addr', c_uint32),
        ('arm7i_size', c_uint32),
        ('ntr_digest_region_offset', c_uint32),
        ('ntr_digest_region_size', c_uint32),
        ('twl_digest_region_offset', c_uint32),
        ('twl_digest_region_size', c_uint32),
        ('digest1_table_offset', c_uint32),
        ('digest1_table_size', c_uint32),
        ('digest2_table_offset', c_uint32),
        ('digest2_table_size', c_uint32),
        ('digest1_block_size', c_uint32),
        ('digest2_digest1_count', c_uint32),
        ('banner_size', c_uint32),
        ('shared2_0000_size', c_uint8),
        ('shared2_0001_size', c_uint8),
        ('eula_ver', c_uint8),
        ('use_ratings', c_uint8),
        ('total_rom_size', c_uint32),
        ('shared2_0002_size', c_uint8),
        ('shared2_0003_size', c_uint8),
        ('shared2_0004_size', c_uint8),
        ('shared2_0005_size', c_uint8),
        ('arm9i_params_table_offset', c_uint32),
        ('arm7i_params_table_offset', c_uint32),
        ('modcrypt_area_1_offset', c_uint32),
        ('modcrypt_area_1_size', c_uint32),
        ('modcrypt_area_2_offset', c_uint32),
        ('modcrypt_area_2_size', c_uint32),
        ('titleID_lo', c_uint32),
        ('titleID_hi', c_uint32),
        ('pub_save_data_size', c_uint32),
        ('priv_save_data_size', c_uint32),
        ('reserved3', c_uint8 * 0xB0),
        ('parental_control', c_uint8 * 16),
        ('arm9_hmac', c_uint8 * 20),
        ('arm7_hmac', c_uint8 * 20),
        ('digest2_hmac', c_uint8 * 20),
        ('banner_hmac', c_uint8 * 20),
        ('arm9i_hmac', c_uint8 * 20),
        ('arm7i_hmac', c_uint8 * 20),
        ('reserved4', c_uint8 * 40),
        ('arm9_no_secure_area_hmac', c_uint8 * 20),
        ('reserved5', c_uint8 * 0xA4C),
        ('debug_args', c_uint8 * 0x180),
        ('sig', c_uint8 * 0x80)
    ]

    def __new__(cls, buf):
        return cls.from_buffer_copy(buf)
    
    def __init__(self, data):
        pass

class KeyTable(Structure): # In ROM dumps, the NTR KeyTable is all '00', and the TWL KeyTable contains mirrors of the data in 0x8000 - 0x8FFF
    _pack_ = 1

    _fields_ = [
        ('reserved_1', c_uint8 * 0x600),
        ('p_array', c_uint8 * 0x48),
        ('reserved_2', c_uint8 * 0x5B8),
        ('s_boxes', c_uint8 * 0x1000),
        ('reserved_3', c_uint8 * 0x400),
        ('test_pattern', c_uint8 * 0x1000)
    ]

    def __new__(cls, buf):
        return cls.from_buffer_copy(buf)
    
    def __init__(self, data):
        pass

class SRLReader:
    def __init__(self, file, dev=0):
        self.file = file
        self.dev = dev
        self.media = 'Game card'

        with open(file, 'rb') as f:
            self.hdr = NTRBaseHdr(f.read(0x180))
            if self.hdr.unit_code == 0:
                f.seek(0x1BF)
                self.hdr_ext = NTRExtendedHdr(f.read(0xE41))
            elif self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
                self.hdr_ext = TWLExtendedHdr(f.read(0xE80))
                if (self.hdr_ext.titleID_hi >> 2) & 1:
                    self.media = 'NAND'
            
            if self.media == 'Game card':
                f.seek(0x1000)
                self.keytable = KeyTable(f.read(0x3000))
                if self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
                    f.seek(self.hdr.data6 * 0x80000)
                    self.keytable_2 = KeyTable(f.read(0x3000))
            
            # Check NTR secure area
            if self.hdr.arm9_rom_offset != 0x4000:
                self.secure_area_status = 'not present'
            else:
                f.seek(0x4000)
                tmp1 = readle(f.read(4))
                tmp2 = readle(f.read(4))
                if tmp1 == 0 and tmp2 == 0:
                    self.secure_area_status = 'empty'
                elif (tmp1, tmp2) in [
                    # properly decrypted standard value
                    (decrypted_id, decrypted_id),
                    # properly decrypted non-standard value
                    (0xD0D48B67, 0x39392F23), # Dragon Quest 5 (EU)
                    (0x014A191A, 0xA5C470B9), # Dragon Quest 5 (USA)
                    (0x7829BC8D, 0x9968EF44), # Dragon Quest 5 (JP)
                    (0xC4A15AB8, 0xD2E667C8), # Prince of Persia (EU)
                    (0xD5E97D20, 0x21B2A159), # Prince of Persia (USA)
                    # properly decrypted prototype value
                    (0xBA35F813, 0xB691AAE8),
                    # improperly decrypted empty secure area (decrypt empty with woodsec)
                    (0xE386C397, 0x82775B7E),
                    (0xF98415B8, 0x698068FC),
                    (0xA71329EE, 0x2A1D4C38),
                    (0xC44DCC48, 0x38B6F8CB),
                    (0x3A9323B5, 0xC0387241),
                ]:
                    self.secure_area_status = 'decrypted'
                else:
                    self.secure_area_status = 'encrypted'

        files = {}
        
        files['header.bin'] = {
            'name': 'Header',
            'offset': 0,
            'size': 0x1000
        }

        if self.media == 'Game card' and bytes(self.keytable) != b'\x00' * 0x3000: # Only exists for game card SRLs
            files['keytable.bin'] = {
                'name': 'KeyTable',
                'offset': 0x1000,
                'size': 0x3000
            }

        if self.hdr.arm9_rom_offset:
            size = self.hdr.arm9_size
            with open(file, 'rb') as f:
                f.seek(self.hdr.arm9_rom_offset + self.hdr.arm9_size)
                if readle(f.read(4)) == 0xDEC00621:
                    size += 0xC
            files['arm9.bin'] = {
                'name': 'ARM9',
                'offset': self.hdr.arm9_rom_offset,
                'size': size
            }

        if self.hdr.arm9_overlay_offset:
            files['arm9overlay.bin'] = {
                'name': 'ARM9 overlay',
                'offset': self.hdr.arm9_overlay_offset,
                'size': self.hdr.arm9_overlay_size
            }
        
        if self.hdr.arm7_rom_offset:
            files['arm7.bin'] = {
                'name': 'ARM7',
                'offset': self.hdr.arm7_rom_offset,
                'size': self.hdr.arm7_size
            }
        
        if self.hdr.arm7_overlay_offset:
            files['arm7overlay.bin'] = {
                'name': 'ARM7 overlay',
                'offset': self.hdr.arm7_overlay_offset,
                'size': self.hdr.arm7_overlay_size
            }

        if self.hdr.banner_offset:
            with open(file, 'rb') as f:
                f.seek(self.hdr.banner_offset)
                ver = readle(f.read(2))
            
                calc_banner_size = False
                banner_sizes = { 0x0001: 0x0840,
                                0x0002: 0x0940,
                                0x0003: 0x1240,
                                0x0103: 0x23C0 }
                if self.hdr.unit_code == 0:
                    if ver in banner_sizes.keys():
                        size = banner_sizes[ver]
                        if ver == 0x0003:
                            f.seek(self.hdr.banner_offset + size - 1)
                            if f.read(33) != b'\x00' + b'\xFF' * 32:
                                calc_banner_size = True
                    else:
                        calc_banner_size = True
                elif self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
                    size = self.hdr_ext.banner_size
            
                # Calculate banner size manually (need to do this for some NTR games)
                if calc_banner_size:
                    f.seek(self.hdr.banner_offset)
                    banner = f.read(0x1240)
                    off = banner[0x240:].find(b'\xFF' * 32) # Find the padding after the end of the banner
                    if off == -1: # Can't determine
                        size = 0x1240
                    else:
                        size = off + 0x240
            
            files['banner.bin'] = {
                'name': 'Banner',
                'offset': self.hdr.banner_offset,
                'size': size
            }
        
        if self.media == 'Game card' and (self.hdr.unit_code == 2 or self.hdr.unit_code == 3): # Only exists for game card SRLs
            if bytes(self.keytable_2) != b'\x00' * 0x3000:
                files['keytable2.bin'] = {
                    'name': 'KeyTable2',
                    'offset': self.hdr.data6 * 0x80000,
                    'size': 0x3000
                }

        if self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
            if self.hdr_ext.arm9i_rom_offset:
                files['arm9i.bin'] = {
                    'name': 'ARM9i',
                    'offset': self.hdr_ext.arm9i_rom_offset,
                    'size': self.hdr_ext.arm9i_size
                }
            
            if self.hdr_ext.arm7i_rom_offset:
                files['arm7i.bin'] = {
                    'name': 'ARM7i',
                    'offset': self.hdr_ext.arm7i_rom_offset,
                    'size': self.hdr_ext.arm7i_size
                }
        
        # TODO: parse FNT/FAT
        self.files = files

        # Generate modcrypt keys (if present)
        if self.hdr.unit_code == 0:
            self.modcrypted = False
        elif self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
            self.modcrypted = True
            if self.hdr.data1 >> 1 == 0:
                self.modcrypted = False
        
        modcrypt = []
        if self.modcrypted:
            if (self.hdr.data1 >> 2 & 1) or ((self.hdr_ext.flags >> 7) & 1): # ModcryptKeyDebug or DeveloperApp
                self.normal_key = bytes(self.hdr)[:16]
            else:
                keyX = b'Nintendo' + bytes(self.hdr.game_code) + bytes(self.hdr.game_code)[::-1]
                keyY = bytes(self.hdr_ext.arm9i_hmac)[:16]
                self.normal_key = TWL.key_scrambler(readle(keyX), readle(keyY))[::-1]
            self.normal_key = self.normal_key[::-1] # Key and IV needs to be reversed before use

            if self.hdr_ext.modcrypt_area_1_offset:
                modcrypt.append({
                    'name': 'modcrypt area 1',
                    'offset': self.hdr_ext.modcrypt_area_1_offset,
                    'size': self.hdr_ext.modcrypt_area_1_size,
                    'key': self.normal_key,
                    'counter': bytes(self.hdr_ext.arm9_hmac)[:16][::-1]
                })
            if self.hdr_ext.modcrypt_area_2_offset:
                modcrypt.append({
                    'name': 'modcrypt area 2',
                    'offset': self.hdr_ext.modcrypt_area_2_offset,
                    'size': self.hdr_ext.modcrypt_area_2_size,
                    'key': self.normal_key,
                    'counter': bytes(self.hdr_ext.arm7_hmac)[:16][::-1]
                })
        self.modcrypt = modcrypt

    def decrypt_secure_area(self, secure_area, key):
        # Checks
        if self.secure_area_status != 'encrypted':
            raise Exception(f'Secure area is {self.secure_area_status}, cannot be decrypted')
        
        # Initialize with level 2, modulo 8 and decrypt first 8 bytes of secure area
        key_lvl2 = init_keycode(key, readle(self.hdr.game_code), 2, 8)
        p1, p0 = blowfish_decrypt(key_lvl2, readle(secure_area[4:8]), readle(secure_area[:4]))
        secure_area = int32tobytes(p0) + int32tobytes(p1) + secure_area[8:]

        # Initialize again with level 3, modulo 8 and decrypt first 2KB of secure area
        key_lvl3 = init_keycode(key, readle(self.hdr.game_code), 3, 8)
        for i in range(0, 0x800, 8):
            p1, p0 = blowfish_decrypt(key_lvl3, readle(secure_area[i + 4:i + 8]), readle(secure_area[i:i + 4]))
            secure_area = secure_area[:i] + int32tobytes(p0) + int32tobytes(p1) + secure_area[i + 8:]
        
        game_code = self.hdr.game_code.decode("ascii")
        if game_code not in sec_area_id_special.keys():
            if readle(secure_area[:4]) == magic30 and readle(secure_area[4:8]) == magic34:
                secure_area = int32tobytes(decrypted_id) + int32tobytes(decrypted_id) + secure_area[8:]
            else:
                raise Exception('Secure area ID decryption failed')

            secure_area_crc = readle(secure_area[0xE:0x10])
            crc_calculated = crc16(list(secure_area[0x10:0x800]))
            if secure_area_crc != crc_calculated:
                raise Exception('Secure area CRC invalid')

        return secure_area

    def encrypt_secure_area(self, secure_area, key):
        # Checks
        if self.secure_area_status != 'decrypted':
            raise Exception(f'Secure area is {self.secure_area_status}, cannot be encrypted')
        
        # Set the secure area ID, which was overwritten with decrypted_id
        game_code = self.hdr.game_code.decode("ascii")
        if game_code not in sec_area_id_special.keys():
            secure_area = int32tobytes(magic30) + int32tobytes(magic34) + secure_area[8:]

        # Initialize with level 3, modulo 8 and encrypt first 2KB of secure area
        key_lvl3 = init_keycode(key, readle(self.hdr.game_code), 3, 8)
        for i in range(0, 0x800, 8):
            p1, p0 = blowfish_encrypt(key_lvl3, readle(secure_area[i + 4:i + 8]), readle(secure_area[i:i + 4]))
            secure_area = secure_area[:i] + int32tobytes(p0) + int32tobytes(p1) + secure_area[i + 8:]

        # Initialize with level 2, modulo 8 and encrypt first 8 bytes of secure area
        key_lvl2 = init_keycode(key, readle(self.hdr.game_code), 2, 8)
        p1, p0 = blowfish_encrypt(key_lvl2, readle(secure_area[4:8]), readle(secure_area[:4]))
        secure_area = int32tobytes(p0) + int32tobytes(p1) + secure_area[8:]

        return secure_area

    def decrypt_modcrypt(self):
        if self.modcrypted:
            shutil.copyfile(self.file, 'decrypted.nds')
            f = open(self.file, 'rb')
            for i in self.modcrypt:
                g = open('decrypted.nds', 'r+b')
                f.seek(i['offset'])
                g.seek(i['offset'])

                counter = Counter.new(128, initial_value=readbe(i['counter']))
                cipher = AES.new(i['key'], AES.MODE_CTR, counter=counter)
                for data in read_chunks(f, i['size']):
                    g.write(TWL.aes_ctr(cipher, data))
                
                print(f'Decrypted {i["name"]}')
                g.close()
            f.close()
            print(f'Wrote to decrypted.nds')
        else:
            raise Exception('Not modcrypted')

    def verify(self):
        # NOTE: Some checks (those that involve the ARM9) will report FAIL if (NTR) secure area is decrypted; since the HMACs are calculated over the ARM9 with encrypted secure area

        # Decrypt modcrypt first (if present) since HMACs and digests are calculated with modcrypt decrypted
        file = self.file
        if self.hdr.data1 >> 1 != 0:
            sys.stdout = open(os.devnull, 'w') # Block print statements
            self.decrypt_modcrypt()
            file = 'decrypted.nds'
            sys.stdout = sys.__stdout__

        crc_check = []
        with open(file, 'rb') as f:
            f.seek(self.hdr.arm9_rom_offset)
            data = f.read(0x4000)
            crc_check.append(('Secure area', crc16(list(data)) == self.hdr.secure_area_crc))

            f.seek(0xC0)
            data = f.read(0x9C)
            crc_check.append(('Nintendo logo', crc16(list(data)) == self.hdr.logo_crc))

            f.seek(0)
            data = f.read(0x15E)
            crc_check.append(('Header', crc16(list(data)) == self.hdr.hdr_crc))
        
        hmac_check = []
        if self.hdr.unit_code == 0:
            f = open(file, 'rb')
            
            if (self.hdr_ext.flags >> 5) & 1 and 'banner.bin' in self.files.keys():
                f.seek(self.files['banner.bin']['offset'])
                hmac_digest = hmac.new(key=TWL.hmac_key_whitelist34, digestmod=hashlib.sha1)
                for data in read_chunks(f, self.files['banner.bin']['size']):
                    hmac_digest.update(data)
                hmac_check.append(('Banner', hmac_digest.digest() == bytes(self.hdr_ext.banner_hmac)))
            
            if (self.hdr_ext.flags >> 6) & 1 and 'arm9.bin' in self.files.keys() and 'arm7.bin' in self.files.keys():
                hmac_digest = hmac.new(key=TWL.hmac_key_whitelist12, digestmod=hashlib.sha1)

                # Header
                f.seek(0)
                hmac_digest.update(f.read(0x160))

                # ARM9
                f.seek(self.files['arm9.bin']['offset'])
                for data in read_chunks(f, self.hdr.arm9_size):
                    hmac_digest.update(data)
                
                # ARM7
                f.seek(self.files['arm7.bin']['offset'])
                for data in read_chunks(f, self.files['arm7.bin']['size']):
                    hmac_digest.update(data)

                hmac_check.append(('Hdr,ARM9,ARM7', hmac_digest.digest() == bytes(self.hdr_ext.hdr_arm9_arm7_hmac)))
            
            if (self.hdr_ext.flags >> 6) & 1 and 'arm9overlay.bin' in self.files.keys() and self.hdr.fat_offset:
                hmac_digest = hmac.new(key=TWL.hmac_key_whitelist12, digestmod=hashlib.sha1)

                # ARM9 overlay
                f.seek(self.files['arm9overlay.bin']['offset'])
                for data in read_chunks(f, self.files['arm9overlay.bin']['size']):
                    hmac_digest.update(data)
                
                # FAT entries for ARM9 overlay
                num_overlays = self.files['arm9overlay.bin']['size'] // 0x20
                f.seek(self.hdr.fat_offset)
                for data in read_chunks(f, num_overlays * 8):
                    hmac_digest.update(data)
                
                # Partial content of overlays
                blocks_read = 0
                for i in range(num_overlays):
                    f.seek(self.hdr.fat_offset + (i * 8))
                    overlay_off = readle(f.read(4))
                    overlay_size = roundup(readle(f.read(4)) - overlay_off, block_size)

                    remaining_overlays = num_overlays - i
                    max_size = ((1 << 0xA) - blocks_read) // remaining_overlays * block_size
                    if overlay_size > max_size:
                        hash_size = max_size
                    else:
                        hash_size = overlay_size

                    f.seek(overlay_off)
                    for data in read_chunks(f, hash_size):
                        hmac_digest.update(data)
                    blocks_read += hash_size // block_size

                hmac_check.append(('ARM9overlayFAT', hmac_digest.digest() == bytes(self.hdr_ext.arm9overlay_fat_hmac)))

            f.close()
        elif self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
            hmac_info = [('arm9.bin', bytes(self.hdr_ext.arm9_hmac)),
                         ('arm7.bin', bytes(self.hdr_ext.arm7_hmac)),
                         ('banner.bin', bytes(self.hdr_ext.banner_hmac)),
                         ('arm9i.bin', bytes(self.hdr_ext.arm9i_hmac)),
                         ('arm7i.bin', bytes(self.hdr_ext.arm7i_hmac))]
            f = open(file, 'rb')
            for fname, expected_digest in hmac_info:
                if fname in self.files.keys():
                    info = self.files[fname]
                    f.seek(info['offset'])
                    hmac_digest = hmac.new(key=TWL.hmac_key, digestmod=hashlib.sha1)
                    for data in read_chunks(f, info['size']):
                        hmac_digest.update(data)
                    hmac_check.append((info['name'], hmac_digest.digest() == expected_digest))
            
            expected_digest = bytes(self.hdr_ext.arm9_no_secure_area_hmac)
            if 'arm9.bin' in self.files.keys() and expected_digest != b'\x00' * 20:
                f.seek(self.files['arm9.bin']['offset'] + 0x4000)
                hmac_digest = hmac.new(key=TWL.hmac_key, digestmod=hashlib.sha1)
                for data in read_chunks(f, self.files['arm9.bin']['size'] - 0x4000):
                    hmac_digest.update(data)
                hmac_check.append(('ARM9 wosecarea', hmac_digest.digest() == expected_digest))
            f.close()

            # Digests
            f = open(file, 'rb')
            data = []
            info = [(self.hdr_ext.ntr_digest_region_offset, self.hdr_ext.ntr_digest_region_size),
                    (self.hdr_ext.twl_digest_region_offset, self.hdr_ext.twl_digest_region_size)]
            for off, size in info:
                f.seek(off)
                data += [f.read(self.hdr_ext.digest1_block_size) for _ in range(size // self.hdr_ext.digest1_block_size)]
            digest1 = b''.join([hmac.new(key=TWL.hmac_key, msg=i, digestmod=hashlib.sha1).digest() for i in data])
            f.seek(self.hdr_ext.digest1_table_offset)
            expected_digest = f.read(self.hdr_ext.digest1_table_size)
            hmac_check.append(('Digest1 table', expected_digest[:len(digest1)] == digest1))

            block_len = self.hdr_ext.digest2_digest1_count * 20
            data = [digest1[i * block_len:(i + 1) * block_len].ljust(block_len, b'\x00') for i in range(self.hdr_ext.digest2_table_size // 20)]
            digest2 = b''.join([hmac.new(key=TWL.hmac_key, msg=i, digestmod=hashlib.sha1).digest() for i in data])
            f.seek(self.hdr_ext.digest2_table_offset)
            expected_digest = f.read(self.hdr_ext.digest2_table_size)
            hmac_check.append(('Digest2 table', expected_digest == digest2))
            f.close()

            hmac_digest = hmac.new(key=TWL.hmac_key, msg=digest2, digestmod=hashlib.sha1)
            hmac_check.append(('Digest2', bytes(self.hdr_ext.digest2_hmac) == hmac_digest.digest()))

        sig_check = []
        # Header signature is the raw SHA1 hash (with padding); easier to manually decrypt and remove the padding
        if (self.hdr_ext.flags >> 6) & 1 or self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
            idx = get_rsa_key_idx(self.hdr, self.hdr_ext)
            n = readbe(TWL.rsa_key_mod[idx][self.dev])
            e = 0x10001
            dec = pow(readbe(bytes(self.hdr_ext.sig)), e, n).to_bytes(0x80, 'big')
            
            f = open(self.file, 'rb')
            sha1_calculated = Crypto.sha1(f, 0xE00)
            f.close()
            sig_check.append(('Header', dec[-20:] == sha1_calculated))

        print("CRCs:")
        for i in crc_check:
            print(' > {0:15} {1:4}'.format(i[0] + ':', 'GOOD' if i[1] else 'FAIL'))
        if hmac_check != []:
            print("HMACs:")
            for i in hmac_check:
                print(' > {0:15} {1:4}'.format(i[0] + ':', 'GOOD' if i[1] else 'FAIL'))
        if sig_check != []:
            print("Signatures:")
            for i in sig_check:
                print(' > {0:15} {1:4}'.format(i[0] + ':', 'GOOD' if i[1] else 'FAIL'))

        if os.path.isfile('decrypted.nds'):
            os.remove('decrypted.nds')

    def __str__(self):
        unit_code = {
            0: 'DS',
            2: 'DSi Enhanced',
            3: 'DSi Exclusive',
        }

        ntr = (
            f'Game title:            {self.hdr.game_title.decode("ascii")}\n'
            f'Game code:             {self.hdr.game_code.decode("ascii")}\n'
            f'Maker code:            {self.hdr.maker_code.decode("ascii")}\n'
            f'Unit code:             {unit_code[self.hdr.unit_code]}\n'
            f'Encryption seed:       {hex(self.hdr.encryption_seed_select)[2:].zfill(2)}\n'
            f'Chip size (KB):        {128 << self.hdr.device_capacity}\n'
            f'ROM version:           {self.hdr.rom_ver}\n'
            f'Autostart:             {"Yes" if (self.hdr.autostart >> 2) & 1 else "No"}'
        )

        if self.hdr.unit_code == 2 or self.hdr.unit_code == 3:
            reg = ''
            if self.hdr_ext.region == 0xFFFFFFFF:
                reg = 'Region free'
            else:
                if self.hdr_ext.region & 1: reg += 'Japan, '
                if (self.hdr_ext.region >> 1) & 1: reg += 'USA, '
                if (self.hdr_ext.region >> 2) & 1: reg += 'Europe, '
                if (self.hdr_ext.region >> 3) & 1: reg += 'Australia, '
                if (self.hdr_ext.region >> 4) & 1: reg += 'China, '
                if (self.hdr_ext.region >> 5) & 1: reg += 'Korea, '
                reg = reg[:-2]
            
            def split_parental_control(b):
                parental_ctrl = str(b & 0b00001111) # age
                if (b >> 6) & 1:
                    parental_ctrl += ', prohibited in country'
                elif (b >> 7) & 1:
                    parental_ctrl += ', rating valid'
                return parental_ctrl

            twl = (
                f'\nCrypto flags:\n'
                f' > Has DSi excl region:{"Yes" if self.hdr.data1 & 1 else "No"}\n'
                f' > Modcrypted:         {"Yes" if (self.hdr.data1 >> 1) & 1 else "No"}\n'
                f' > Modcrypt key:       {"Debug" if (self.hdr.data1 >> 2) & 1 else "Retail"}\n'
                f' > Disable debug:      {"Yes" if (self.hdr.data1 >> 3) & 1 else "No"}\n'
                f'Permit jump:\n'
                f'  Normal jump:         {self.hdr.data2 & 1}\n'
                f'  Temporary jump:      {(self.hdr.data2 >> 1) & 1}\n'
                f'Region:                {reg}\n'
                f'Access control:\n'
                f'  Common client key:   {self.hdr_ext.access_control & 1}\n'
                f'  AES slot B:          {(self.hdr_ext.access_control >> 1) & 1}\n'
                f'  AES slot C:          {(self.hdr_ext.access_control >> 2) & 1}\n'
                f'  SD card:             {(self.hdr_ext.access_control >> 3) & 1}\n'
                f'  NAND access:         {(self.hdr_ext.access_control >> 4) & 1}\n'
                f'  Game card power on:  {(self.hdr_ext.access_control >> 5) & 1}\n'
                f'  Shared2 file:        {(self.hdr_ext.access_control >> 6) & 1}\n'
                f'  SignJPEGforlauncher: {(self.hdr_ext.access_control >> 7) & 1}\n'
                f'  Game card NTR mode:  {(self.hdr_ext.access_control >> 8) & 1}\n'
                f'  SSL client cert:     {(self.hdr_ext.access_control >> 9) & 1}\n'
                f'  Commonclientkeydev:  {(self.hdr_ext.access_control >> 31) & 1}\n'
                f'Flags:\n'
                f' > TSC mode:           {"DSi" if self.hdr_ext.flags & 1 else "DS"}\n'
                f' > EULA required:      {"Yes" if (self.hdr_ext.flags >> 1) & 1 else "No"}\n'
                f' > Banner:             {"Use banner.sav" if (self.hdr_ext.flags >> 2) & 1 else "From ROM"}\n'
                f' > ShowWiFiconnicon:   {"Yes" if (self.hdr_ext.flags >> 3) & 1 else "No"}\n'
                f' > ShowDSwirelessicon: {"Yes" if (self.hdr_ext.flags >> 4) & 1 else "No"}\n'
                f' > DScartwithiconSHA1: {"Yes" if (self.hdr_ext.flags >> 5) & 1 else "No"}\n'
                f' > DScartwithheaderRSA:{"Yes" if (self.hdr_ext.flags >> 6) & 1 else "No"}\n'
                f' > Developer app:      {"Yes" if (self.hdr_ext.flags >> 7) & 1 else "No"}\n'
                f'EULA ver:              {self.hdr_ext.eula_ver}\n'
                f'TitleID:               {hex(self.hdr_ext.titleID_hi)[2:].zfill(8) + hex(self.hdr_ext.titleID_lo)[2:].zfill(8)}\n'
                f'  Media:               {"NAND" if (self.hdr_ext.titleID_hi >> 2) & 1 else "Game card"}\n'
                f'Parental control:\n'
                f'  CERO (Japan):        {split_parental_control(self.hdr_ext.parental_control[0])}\n'
                f'  ESRB (USA/Canada):   {split_parental_control(self.hdr_ext.parental_control[1])}\n'
                f'  USK (Germany):       {split_parental_control(self.hdr_ext.parental_control[3])}\n'
                f'  PEGI (Pan-Europe):   {split_parental_control(self.hdr_ext.parental_control[4])}\n'
                f'  PEGI (Portugal):     {split_parental_control(self.hdr_ext.parental_control[6])}\n'
                f'  PEGI and BBFC (UK):  {split_parental_control(self.hdr_ext.parental_control[7])}\n'
                f'  AGCB (Australia):    {split_parental_control(self.hdr_ext.parental_control[8])}\n'
                f'  GRB (South Korea):   {split_parental_control(self.hdr_ext.parental_control[9])}'
            )

            return ntr + twl
        else:
            if self.hdr.data2 == 0:
                reg = 'Normal'
            elif self.hdr.data2 == 0x40:
                reg = 'Korea'
            elif self.hdr.data2 == 0x80:
                reg = 'China'
            ntr += f'\nRegion:                {reg}'

            if self.hdr_ext.flags != 0:
                ntr += (
                    f'\nFlags:\n'
                    f' > TSC mode:           {"DSi" if self.hdr_ext.flags & 1 else "DS"}\n'
                    f' > EULA required:      {"Yes" if (self.hdr_ext.flags >> 1) & 1 else "No"}\n'
                    f' > Banner:             {"Use banner.sav" if (self.hdr_ext.flags >> 2) & 1 else "From cartridge"}\n'
                    f' > ShowWiFiconnicon:   {"Yes" if (self.hdr_ext.flags >> 3) & 1 else "No"}\n'
                    f' > ShowDSwirelessicon: {"Yes" if (self.hdr_ext.flags >> 4) & 1 else "No"}\n'
                    f' > DScartwithiconSHA1: {"Yes" if (self.hdr_ext.flags >> 5) & 1 else "No"}\n'
                    f' > DScartwithheaderRSA:{"Yes" if (self.hdr_ext.flags >> 6) & 1 else "No"}\n'
                    f' > Developer app:      {"Yes" if (self.hdr_ext.flags >> 7) & 1 else "No"}'
                )

            return ntr


parser = argparse.ArgumentParser()
parser.add_argument('path', help='path to rom file')
parser.add_argument('--dev', action='store_true')
parser.add_argument('--encrypt', action='store_true', help='verify using encrypted secure area')
args = parser.parse_args()

rom = args.path
if args.dev:
    dev = 1
else:
    dev = 0

if not os.path.isfile(rom):
    raise Exception(f'Could not find file: {rom}')

srl = SRLReader(rom, dev)

if args.encrypt:
    if srl.secure_area_status != 'decrypted':
        print(f'Secure area is {srl.secure_area_status}, cannot be encrypted')
        srl.verify()
        exit()

    shutil.copyfile(rom, 'tmp.nds')
    with open(rom, 'rb') as file:
        file.seek(0x4000)
        secure_area = file.read(2048)
        secure_area_enc = srl.encrypt_secure_area(secure_area, NTR.blowfish_key)
    with open('tmp.nds', 'r+b') as file:
        file.seek(0x4000)
        file.write(secure_area_enc)
    
    srl_enc = SRLReader('tmp.nds', dev)
    srl_enc.verify()

    if os.path.isfile('tmp.nds'):
        os.remove('tmp.nds')
else:
    srl.verify()
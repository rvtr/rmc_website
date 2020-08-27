<?
$title = "Ian Skinner's About the Commodore";
$tab = "cbm";
$section = "about";
$page = 1;
include("{$_SERVER['DOCUMENT_ROOT']}/commodore/navinfo.php");

$content = <<<ENDCONTENT
<div class="row">
  <div class="col">
    <h1>About the Commodore 64</h1>
    <p>
Hello! I'm <a href="https://www.github.com/IanSkinner1982"target="_blank">Ian Skinner</a>, and welcome to my webpage. Here I will talk about the commodore 64. 
    </p>
  </div>
</div>
<div class="row mb-4">
  <div class="col-md-5">
    <img src="/commodore/images/breadbox.png" class="img-fluid img-screenshot" alt="Commodore 64 'breadbin' model computer.">
  </div>
  <div class="col-md-7">
    <p>Here is a picture of the Commodore 64 computer. This computer, unlike a modern one, <i>is</i> the keyboard. The entire computer is inside the case. You
need a disk drive to actually save, and load programs. You can also use a tape drive. The Commodore 64 can be used as a game system.
You use joysticks or paddles as controllers. People didn't often buy official  monitors for their Commodore because they were too expensive, so they hooked the Commodore up to their ordinary TVs instead. The picture on a standard TV was not as good as on a Commodore monitor so, the colours didn't
come out the same.
    </p>
  </div>
</div>
<div class="row mb-3">
  <div class="col-lg-2 col-md-3">
    <img src="/commodore/images/ad_1983.jpg" class="img-screenshot img-fluid float-left mr-3" alt="Magazine ad for Commodore 64 computer, comparing prices with other home computers of the era.">
  </div>
  <div class="col-lg-6 col-md-9">
    <p>This is an ad for the Commodore from 1983. (You can see a full-sized image
<a href="./images/ad_full.jpg" target="_blank">here</a>.) The Commodore 64 was first released in 1982. Hardly anyone had computers at home back then.
Not many people really wanted a computer. They didn't know what they would do with it, and they didn't think they would ever need one.
As you can see, this ad shows the prices of an early Apple and an early IBM PC. IBM PCs have become Windows computers. Back then, they cost around $1395. That's about $3500 in today's dollars. As you can see, it was quite expensive.
The Commodore 64 was sold for  $595 back then but the price dropped to $199 in a couple of years so that it was cheaper and more families
could buy them. In 1987 the case was changed and the computer was re-released as the new Commodore 64C. The main
thing that was changed internally was the SID chip that made the sound. If you were wondering what the "C" in the name stood for, it meant "Cost reduced".
</p>
  </div>
  <div class="col-lg-4">
    <div class="embed-responsive embed-responsive-4by3 float-right">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/HvCeQhfv7dM?rel=0" allowfullscreen></iframe>
    </div>
  </div>
</div>
<p>Next is an old Commodore 64 TV ad that you will no longer see. Commodore, Atari and some other computer companies ran a lot of ads to
try to convince people that these new home computers were something that they really had to have.</p>
<p>On the next page, I will teach you about <code>PRINT</code> and <code>GOTO</code>, the first two BASIC commands that you should learn.</p>
ENDCONTENT;

$content .= buildPager($page);

include("{$_SERVER['DOCUMENT_ROOT']}/includes/layout.php");
?>


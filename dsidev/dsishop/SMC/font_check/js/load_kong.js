/*****************************
  Load Kong Script
 *****************************/
/*
  Load kong.js
*/

if ( !window.Kong )
{
    //-- for PC Browser only
    document.write("<script type='text/javascript' src='../js/kong.js'></script>");
    document.write("<link rel='stylesheet' type='text/css' href='../css/pc.css'>");

} else {

    /* #### 20080628 #### for PC Opera 9.5 */
    var gkong = new Kong;

}





/*
  Set window name
*/

  //-- switch the window to window.open

  //--  html filename format rule : 
  //--    for UpWindow   : u*.html or *u.html
  //--    for DownWindow : d*.html or *d.html

var url  = window.location.href;
var head = url.substring( url.lastIndexOf("/")+1, url.lastIndexOf("/")+2 ).toLowerCase();
var foot = url.substring( url.lastIndexOf(".")-1, url.lastIndexOf(".")   ).toLowerCase();

if (foot == "u" || head == "u")
{
    window.name = "UpWindow";
}
else if (foot =="d" || head == "d")
{
    window.name = "DownWindow";
}



var upWindowObject   = window.open('', 'UpWindow');
var downWindowObject = window.open('', 'DownWindow');



/* #### 20080628 #### Added $(). */
var $ = function(arg){ return document.getElementById(arg) };


/*****************************
  Kong Script for Windows
 *****************************/
/*
  Kong Class
*/

var gShowClickEffect = true;


function kong_sleep(msec) {
	var d1 = new Date().getTime();
	var d2 = new Date().getTime();
	while( d2 < d1 + msec ){
		d2 = new Date().getTime();
	}
}



/* dummy functions for PC Browser */

function Kong()
{

	this.SetTransition = function() {}
	this.PlaySE        = function() {}

	this.KbdActive     = function(k,m,f) {
		/* #### 20080628 #### Changed from alert to opera.postError. */
		opera.postError("[[KbdActive]] kind:" + k + " / " + "message: " + m + " / " + "field:" + f );
	}


	this.GetUpDocumentHeight = function() {
		var h = 0
		if (upWindowObject.pageBottom) {
			var b = upWindowObject.pageBottom;
			h = parseInt(b.offsetParent.offsetTop) + parseInt(b.offsetTop) + parseInt(getComputedStyle(b, '').getPropertyValue('height'));
		}
		if (h >= 192) { return h; } else { return 192; }
	}

	this.GetDownDocumentHeight = function() {
		var h = 0
		if (downWindowObject.pageBottom) {
			var b = downWindowObject.pageBottom;
			h = parseInt(b.offsetParent.offsetTop) + parseInt(b.offsetTop) + parseInt(getComputedStyle(b, '').getPropertyValue('height'));
		}
		if (h >= 192) { return h; } else { return 192; }
	}


	this.ScrollUpWindow = function(x, y ,t) {
		upWindowObject.scrollBy(x, y);
	}

	this.ScrollDownWindow = function(x, y ,t) {
		downWindowObject.scrollBy(x, y);
	}


	/* #### 20080711 #### Deleted arguments. */
	this.ShowUpWindowScrollButton = function() {
		if (downWindowObject.upWinU) { 	/* #### 20080628 #### Added. */

			/* #### 20080711 #### Added default positions for PC Opera. */
			var ux = 204;
			var uy = 1;
			var dx = 229;
			var dy = 1;

 			/* #### 20080712 #### Added scroll_tab. */
			downWindowObject.scroll_tab.style.visibility = "visible";
			downWindowObject.upWinU.style.visibility     = "visible";
			downWindowObject.upWinD.style.visibility     = "visible";
			downWindowObject.upWinU.style.left = ux;
			downWindowObject.upWinU.style.top  = uy;
			downWindowObject.upWinD.style.left = dx;
			downWindowObject.upWinD.style.top  = dy;


		}
	}

	this.ShowDownWindowScrollButton = function(ux, uy, dx, dy) {
		if (downWindowObject.dnWinU) {	/* #### 20080628 #### Added. */
			downWindowObject.dnWinU.style.visibility = "visible";
			downWindowObject.dnWinD.style.visibility = "visible";
			downWindowObject.dnWinU.style.left = ux;
			downWindowObject.dnWinU.style.top  = uy;
			downWindowObject.dnWinD.style.left = dx;
			downWindowObject.dnWinD.style.top  = dy;
		}
	}

	this.HideUpWindowScrollButton   = function() {
		if (downWindowObject.upWinU) {	/* #### 20080628 #### Added. */
 			/* #### 20080712 #### Added scroll_tab. */
			downWindowObject.scroll_tab.style.visibility = "hidden";
			downWindowObject.upWinU.style.visibility     = "hidden";
			downWindowObject.upWinD.style.visibility     = "hidden";
		}
	}

	this.HideDownWindowScrollButton = function() {
		if (downWindowObject.dnWinU) {	/* #### 20080628 #### Added. */
			downWindowObject.dnWinU.style.visibility = "hidden";
			downWindowObject.dnWinD.style.visibility = "hidden";
		}
	}


	/* #### 20080628 #### Added functions for loading icon. */
	this.ShowLoadingIcon = function() {

		/* #### 20080714 #### Added to disable all. */
		if (downWindowObject.disable_all) {
			downWindowObject.disable_all.style.zIndex = 30;
		}

		if (downWindowObject.loadingIcon) {	/* #### 20080628 #### Added. */
			downWindowObject.loadingIcon.style.visibility = "visible";
		}

		kong_sleep(200);

	}

	this.HideLoadingIcon = function() {

		if (downWindowObject.loadingIcon) {	/* #### 20080628 #### Added. */
			downWindowObject.loadingIcon.style.visibility = "hidden";
		}

		/* #### 20080714 #### Added to eable all. */
		if (downWindowObject.disable_all) {
			downWindowObject.disable_all.style.zIndex = -1;
		}

	}


	this.ShowProgressBar           = function() {}
	this.UpdateProgressBar         = function(d, t) { opera.postError("download:" + d + "/" + t) }
	this.IsProgressBarAnimFinished = function() { return true; }
	this.HideProgressBar           = function() {}


	/* #### 20080628 #### Added new functions. */
	this.SetTransitionRangeOnce = function() {}
	this.SetManualTransition    = function() {}
	this.StartManualTransition  = function() {}
	this.IsBatterySufficient    = function() { return true; }


	/* #### 20080715 #### Added to display particle on click. */
	this.ShowClickEffect = function( x, y ) {
		if (gShowClickEffect) {
			if (downWindowObject.particle) {
				downWindowObject.particle.style.left = x - 18;
				downWindowObject.particle.style.top  = y - 18;
				downWindowObject.particle.style.visibility = "visible";
				kong_sleep(600);
				downWindowObject.particle.style.visibility = "hidden";
			}
		}
	}


	this.print = function(t) { opera.postError(t); }

}






//----------------------------------------
//-- scroll for PC Browser
//----------------------------------------

//#### 20080628 #### Added icons.

if (window.name == "UpWindow")   {
	document.write("<div id='wifiIcon'></div>");
}
if (window.name == "DownWindow") {
	document.write("<div id='disable_all'></div>"); // #### 20080714 #### Added to disable all.
	document.write("<div id='particle'></div>");    // #### 20080715 #### Added to display particle on click.
	document.write("<div id='scroll_tab'></div>");
	document.write("<div id='upWinU'></div>");
	document.write("<div id='upWinD'></div>");
	document.write("<div id='dnWinU'></div>");
	document.write("<div id='dnWinD'></div>");
	document.write("<div id='loadingIcon'></div>");
}



var upMouseState     = 0;
var downMouseState   = 0;


function setMouseState(window_u_d, state_u_d) {
	if(window_u_d == "UpWindow")   { upMouseState   = state_u_d; }
	if(window_u_d == "DownWindow") { downMouseState = state_u_d; }
}

function onkeyCodeCheck(c) {
	var code = event.keyCode;
	if (code == c) { return true; } else { return false; }
}


var a_stateScroll = new Array();
a_stateScroll["upWinU"] = -1;
a_stateScroll["upWinD"] = -1;
a_stateScroll["dnWinU"] = -1;
a_stateScroll["dnWinD"] = -1;





function setScrollButtonImages( o ) {

	var id     = o.getAttribute("id");
	var spacer = o;
	var h      = -1 * parseInt(getComputedStyle(o,'').getPropertyValue('height'));
	var oStyle = o.style;

	var window_u_d   = 0;
	if (id.indexOf("upWin") != -1) {window_u_d = "UpWindow";}
	if (id.indexOf("dnWin") != -1) {window_u_d = "DownWindow";}

	var state_u_d    = 0;
	if (id.indexOf("WinU") != -1) {state_u_d = 1;}
	if (id.indexOf("WinD") != -1) {state_u_d = 2;}



	spacer.addEventListener('click', function() {
			//-- need for Spacial Navigation.
		}, false);


	spacer.addEventListener('focus', function() {
			if (a_stateScroll[id] != 0) {
				oStyle.backgroundPosition = "0px " + h * 3 + "px";
			} else {
				oStyle.backgroundPosition = "0px " + h * 1 + "px";
			}
			// gkong.PlaySE(0);
		}, false);

	spacer.addEventListener('blur', function() {
			if (a_stateScroll[id] != 0) {
				oStyle.backgroundPosition = "0px " + h * 2 + "px";
			} else {
				oStyle.backgroundPosition = "0px 0px";
			}
		}, false);


	spacer.addEventListener('mousedown', function() {
			if (a_stateScroll[id] != 0) {
				setMouseState(window_u_d, state_u_d);
				oStyle.backgroundPosition = "0px " + h * 3 + "px";
			} else {
				// gkong.PlaySE(6);
			}
		}, false);


	spacer.addEventListener('mouseup', function() {
			setMouseState(window_u_d, 0);
			if (a_stateScroll[id] != 0) {
				oStyle.backgroundPosition = "0px " + h * 2 + "px";
			} else {
				oStyle.backgroundPosition = "0px 0px";
			}
		}, false);

	spacer.addEventListener('mouseout', function() {
			setMouseState(window_u_d, 0);
			if (a_stateScroll[id] != 0) {
				oStyle.backgroundPosition = "0px " + h * 2 + "px";
			} else {
				oStyle.backgroundPosition = "0px 0px";
			}
		}, false);

	spacer.addEventListener('keydown', function() {
			if ( onkeyCodeCheck(172) || onkeyCodeCheck("C".charCodeAt(0)) ) { //-- 179 = twl A key's code.
				if (a_stateScroll[id] != 0) {
					setMouseState(window_u_d, state_u_d);
				} else {
					// gkong.PlaySE(6);
				}
			}
		}, false);

	spacer.addEventListener('keyup', function() {
			if ( onkeyCodeCheck(172) || onkeyCodeCheck("C".charCodeAt(0)) ) {  //-- 179 = twl A key's code.
				if (a_stateScroll[id] != 0) {
					setMouseState(window_u_d, 0);
				} else {
					oStyle.backgroundPosition = "0px " + h * 1 + "px";
				}
			}
		}, false);

}



function lockScroll( o ) {

	var id     = o.getAttribute("id");
	var oStyle = o.style;

	if (a_stateScroll[id] == 1) {
		a_stateScroll[id] = 0;
		oStyle.backgroundPosition = "0px 0px";
		return true;
	}

	if (a_stateScroll[id] == -1) {
		a_stateScroll[id] = 0;
		oStyle.backgroundPosition = "0px 0px";
		return false;
	}

	return false;

}


function unlockScroll( o ) {

	var id     = o.getAttribute("id");
	var h      = -1 * parseInt(getComputedStyle(o,'').getPropertyValue('height'));
	var oStyle = o.style;

	if (a_stateScroll[id] == 0) {
		a_stateScroll[id] = 1;
		oStyle.backgroundPosition = "0px "+ h * 2 + "px";
		return true;
	}

	if (a_stateScroll[id] == -1) {
		a_stateScroll[id] = 1;
		oStyle.backgroundPosition = "0px "+ h * 2 + "px";
		return false;
	}

	return false;

}



//----------------------------------------
//-- main loop for scrolling
//----------------------------------------


var intervalMSec        = 32;
var buttonIntervalFrame = 10;

var scrollPx       = 192 / 8;


//----------------------------------------
var upBottom      = 0;
var upPageYOffset = 0;

var upPressTime   = 0;

//----------------------------------------
var downBottom      = 0;
var downPageYOffset = 0;

var downPressTime   = 0;


//----------------------------------------


function scrollLoop() {


	/* -- UpWin ----------------------------------------------------- */
	if(downWindowObject.document.getElementById('upWinU')) {

		upBottom = parseInt(gkong.GetUpDocumentHeight());
		upPageYOffset = parseInt(upWindowObject.pageYOffset);

		if (upPageYOffset == 0) {
			if (lockScroll(upWinU)) {
				// gkong.PlaySE(6);
			}
		} else {
			unlockScroll(upWinU);
			if (upMouseState == 1) { //-- scroll up
				if (upPressTime > buttonIntervalFrame) {
					// gkong.PlaySE(0);
					upWindowObject.scrollBy(0, -scrollPx);
				} else {
					if (upPressTime == 0) {
						// gkong.PlaySE(0);
						upWindowObject.scrollBy(0, -scrollPx);
					}
					upPressTime += 1;
				}
			} else {
				;
			}
		}


		if (upPageYOffset + 192 >= upBottom) {
			if (lockScroll(upWinD)) {
				// gkong.PlaySE(6);
			}
		} else {
			unlockScroll(upWinD);
			if (upMouseState == 2) { //-- scroll down
				if (upPressTime > buttonIntervalFrame) {
					// gkong.PlaySE(0);
					upWindowObject.scrollBy(0, scrollPx);
				} else {
					if (upPressTime == 0) {
						// gkong.PlaySE(0);
						upWindowObject.scrollBy(0, scrollPx);
					}
					upPressTime += 1;
				}
			} else {
				;
			}
		}


		if (upMouseState == 0) {
			upPressTime  = 0;
		}


	}



	/* -- dnWin ----------------------------------------------------- */
	if(downWindowObject.document.getElementById('dnWinU')) {

		DownBottom = parseInt(gkong.GetDownDocumentHeight());
		downPageYOffset = parseInt(downWindowObject.pageYOffset);

		if (downPageYOffset == 0) {
			if (lockScroll(dnWinU)) {
				// gkong.PlaySE(6);
			}
		} else {
			unlockScroll(dnWinU);
			if (downMouseState == 1) { //-- scroll up
				if (downPressTime > buttonIntervalFrame) {
					// gkong.PlaySE(0);
					downWindowObject.scrollBy(0, -scrollPx);
				} else {
					if (downPressTime == 0) {
						// gkong.PlaySE(0);
						downWindowObject.scrollBy(0, -scrollPx);
					}
					downPressTime += 1;
				}
			} else {
				;
			}
		}


		if (downPageYOffset + 192 >= DownBottom) {
			if (lockScroll(dnWinD)) {
				// gkong.PlaySE(6);
			}
		} else {
			unlockScroll(dnWinD);
			if (downMouseState == 2) { //-- scroll down
				if (downPressTime > buttonIntervalFrame) {
					// gkong.PlaySE(0);
					downWindowObject.scrollBy(0, scrollPx);
				} else {
					if (downPressTime == 0) {
						// gkong.PlaySE(0);
						downWindowObject.scrollBy(0, scrollPx);
					}
					downPressTime += 1;
				}
			} else {
				;
			}
		}


		if (downMouseState == 0) {
			downPressTime  = 0;
		}


	}


	setTimeout("scrollLoop()", intervalMSec); //into an infinite loop.

}



function scrollStart() {
	setScrollButtonImages(upWinU);
	setScrollButtonImages(upWinD);
	setScrollButtonImages(dnWinU);
	setScrollButtonImages(dnWinD);
	scrollLoop();
}



/* #### 20080628 #### for PC Opera 9.5 */
var gkong = new Kong();


/* #### 20080628 #### for PC Opera 9.5 */
/* #### 20080628 #### Added for loading icon. */
//window.onload = scrollStart;
window.addEventListener('load',   function(){ gkong.HideLoadingIcon(); if (window.name == "DownWindow") { scrollStart(); } }, false);
window.addEventListener('unload', function(){ gkong.ShowLoadingIcon(); }, false);





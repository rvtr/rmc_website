//========================================
// base.js
//========================================


/* #### 20080602 #### Commented out functions for debug grid. */
/*

//----------------------------------------------------------------
//-- for debug only -- grid
//-- (TWL: X button toggle / PC: "G" key toggle(only when DownWindow focused))


var _u_grid = null;
var _d_grid = null;

function appendGridUD() {

	_u_grid = upWindowObject.document.createElement("img");
	_u_grid.src = "../image/256x192.gif";
	_u_grid.style.visibility = "hidden";
	_u_grid.style.position   = "fixed";
	_u_grid.style.zIndex  = 30;
	_u_grid.style.top     = 0;
	_u_grid.style.left    = 0;
	//_u_grid.style.opacity = 0.3;
	upWindowObject.document.body.appendChild(_u_grid);

	_d_grid = downWindowObject.document.createElement("img");
	_d_grid.src = "../image/256x192.gif";
	_d_grid.style.visibility = "hidden";
	_d_grid.style.position   = "fixed";
	_d_grid.style.zIndex  = 30;
	_d_grid.style.top     = 0;
	_d_grid.style.left    = 0;
	//_d_grid.style.opacity = 0.3;
	downWindowObject.document.body.appendChild(_d_grid);

}


function setGridVisibility() {
	if (_u_grid.style.visibility == "hidden") {
		_u_grid.style.visibility = "visible";
		_d_grid.style.visibility = "visible";
	} else {
		_u_grid.style.visibility = "hidden";
		_d_grid.style.visibility = "hidden";
	}
}

function dispGrid() {

	var code = event.keyCode;
	//-- "event.keyCode" returns a code of capital letter if use "onkyedown".
	if ( code == OP_KEY_PAD_X || code == "G".charCodeAt(0) ) {

		if (_u_grid == null) {
			appendGridUD();
		}
		setGridVisibility();

	}

}

// #### 20080628 #### Changed for PC Opera 9.5
//window.onkeydown   = dispGrid;  //-- "event.keyCode" returns a code of capital letter if use "onkyedown".
window.addEventListener('keydown', dispGrid, false);



*/




//----------------------------------------------------------------
//-- for debug only -- histroy back

function historyBack() {
	//hideScrollButton();
	gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS); /* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
	setTimeout( function() {
			upWindowObject.history.back();
			downWindowObject.history.back();
		} , WAIT_FOR_SETURL);
}



//----------------------------------------------------------------
//-- for debug only -- debug counter
/*
var gDebugCounter = 0; // #### 20080628 #### Renamed.
function incDebugCounter() {
	gDebugCounter += 1;
	if (gDebugCounter > (1000 * 60)) { gDebugCounter = 0;}
	setTimeout("incDebugCounter()", 100);
}

incDebugCounter();
*/

//----------------------------------------------------------------
//-- for debug only -- debug print

function dPrint(t) {
	// gkong.print("[[ dPrint ]] " + t + " ---- " + gDebugCounter)
	gkong.print("[[ dPrint ]] " + t );
}





//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------



//----------------------------------------
//-- define : keyboard kinds & types of field (see Kong::KbdActive)

var KBD_KIND_TEN          = 0;
var KBD_KIND_QWERTY       = 1;
var KBD_KIND_NO_JAPANESE  = 2;
var KBD_KIND_JAPANESE     = 3;

var KBD_FIELD_NORMAL      = 0;
var KBD_FIELD_4444        = 1;


//----------------------------------------
//-- define : wipe animation types of transition (see Kong::SetTransition)

var WIPE_ANIM_NONE        = 0;
var WIPE_ANIM_TRANS       = 1;
var WIPE_ANIM_TRANS_LEFT  = 2;
var WIPE_ANIM_TRANS_RIGHT = 3;
var WIPE_ANIM_LEFT        = 4;
var WIPE_ANIM_RIGHT       = 5;

/* #### 20080628 #### Added new types. */
var WIPE_ANIM_DOWN        = 6;
var WIPE_ANIM_UP          = 7;
var WIPE_ANIM_OVER_LEFT   = 8;
var WIPE_ANIM_OVER_RIGHT  = 9;


//----------------------------------------
//-- define : TWL key code

var OP_KEY_PAD_A      = 172;
var OP_KEY_PAD_B      = 173;
var OP_KEY_PAD_X      = 179;
var OP_KEY_PAD_Y      = 180;
var OP_KEY_PAD_L      = 181;
var OP_KEY_PAD_R      = 182;
var OP_KEY_PAD_UP     = 175;
var OP_KEY_PAD_DOWN   = 176;
var OP_KEY_PAD_RIGHT  = 177;
var OP_KEY_PAD_LEFT   = 178;
var OP_KEY_PAD_START  = 174;
var OP_KEY_PAD_SELECT = 170;




/* #### 20080702 #### Changed. */
//----------------------------------------
//-- define : options of setButtonImages()

//var SBIMG_NO_LOADING_ICON = 0;
var SBIMG_NO_LOADINGICON_NO_PARTICLE = 0;
var SBIMG_NO_CURSOR                  = 1;



/* #### 20080709 #### Added not to init button image. */
//----------------------------------------
//-- define : options of clearClickedStates()

/* #### 20081004 #### NOTE: CCS_NOT_INIT_BUTTON_IMG is used not to init button image of DownWindow if only UpWindow is transited or manual transited. */
var CCS_NOT_INIT_BUTTON_IMG = 0;


/* #### 20080927 #### Defined options of afterChangeDOMforManualTransition() not to play SE. */
//----------------------------------------
//-- define : options of afterChangeDOMforManualTransition()

var ACD_NO_SE   = 0;
var ACD_PLAY_SE = 1;



//----------------------------------------------------------------
//-- set urls and types of animation

//-- wait maybe required... if no wait, button images will not change before the wipe animation.

/* #### 20080628 #### Changed wait time from   0ms to 200ms */
var WAIT_FOR_SETURL           = 200;

/* #### 20080715 #### Moved from "multi_page_DOM.js". */
var WAIT_FOR_MANUALTRANSITION = 300;

/* #### 20081004 #### Added the wait time for clearClickedStates(). */
var WAIT_FOR_CCS              = 300;

/* #### 20081004 #### Added the wait time for waitRestart() & waitReturnToMenu(). */
var WAIT_FOR_RESTART          = 300;



function setUrlUD() {
	var a = setUrlUD.arguments;
	if (a.length == 2) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		/* #### 20080926 #### Changede default of WIPE_ANIM from WIPE_ANIM_NONE to WIPE_ANIM_TRANS. */
		gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS);
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
				if (a[1] != "") window.open( a[1], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 4) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		gkong.SetTransition(a[1], a[3]);
		setTimeout(function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
				if (a[2] != "") window.open( a[2], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else {
		return false;
	}
}

function setUrlU() {
	var a = setUrlU.arguments;
	if (a.length == 1) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		/* #### 20080926 #### Changede default of WIPE_ANIM from WIPE_ANIM_NONE to WIPE_ANIM_TRANS. */
		gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS);
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 2) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		/* #### 20080926 #### Changede default of WIPE_ANIM from WIPE_ANIM_NONE to WIPE_ANIM_TRANS. */
		gkong.SetTransition(a[1], WIPE_ANIM_TRANS);
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
			} ,  WAIT_FOR_SETURL);
	} else {
		return false;
	}
}

function setUrlD() {
	var a = setUrlD.arguments;
	if (a.length == 1) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		/* #### 20080926 #### Changede default of WIPE_ANIM from WIPE_ANIM_NONE to WIPE_ANIM_TRANS. */
		gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS);
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 2) {
		//hideScrollButton();

		/* #### 20080702 #### NOTE: SetTransition* MUST BE CALLED. */
		/* #### 20080926 #### Changede default of WIPE_ANIM from WIPE_ANIM_NONE to WIPE_ANIM_TRANS. */
		gkong.SetTransition(WIPE_ANIM_TRANS, a[1]);
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else {
		return false;
	}
}







//----------------------------------------------------------------
//-- cursor

var CURSOR_SIZE = 8; // 8px x 8px




function clearCursor() {

/* #### 20080702 #### Commented out. */
/*
	var hp = -2 * CURSOR_SIZE;
	cursor_tl.style.top  = hp;
	cursor_tr.style.top  = hp;
	cursor_bl.style.top  = hp;
	cursor_br.style.top  = hp;
*/

}


//--- setCurser (z-index version)

/*

function setCursor(obj) {

	var oP = obj.offsetParent;
	var cS = getComputedStyle(obj,'');

	if(oP) { //-- obj's style may be "position : absolute"
		var p = "absolute";
		var t = parseInt(oP.offsetTop)  + parseInt(obj.offsetTop);
		var l = parseInt(oP.offsetLeft) + parseInt(obj.offsetLeft);
		var w = parseInt(cS.getPropertyValue('width'));
		var h = parseInt(cS.getPropertyValue('height'));
		var z = parseInt(obj.style.zIndex);
	} else { //-- obj's style may be "position : fixed"
		var p = "fixed";
		var t = parseInt(cS.getPropertyValue('top'));
		var l = parseInt(cS.getPropertyValue('left'));
		var w = parseInt(cS.getPropertyValue('width'));
		var h = parseInt(cS.getPropertyValue('height'));
		var z = parseInt(cS.getPropertyValue('z-index'));
	}


	if( h == 0 || isNaN(h) ){
		//-- obj dose not have height value (maybe 'a' tag) ----
		h = parseInt( cS.getPropertyValue('font-size') );
		if      (h == 16) { h = 21; } // font cell size 17x21
		else if (h == 12) { h = 16; } // font cell size 13x16
		else if (h == 10) { h = 13; } // font cell size 11x12 (+1)
	}


	if(isNaN(z)){ z = 1; } else { z += 1; }


	cursor_tl.style.position = p;
	cursor_tl.style.zIndex   = z;
	cursor_tl.style.top      = t;
	cursor_tl.style.left     = l;

	cursor_tr.style.position = p;
	cursor_tr.style.zIndex   = z;
	cursor_tr.style.top      = t;
	cursor_tr.style.left     = l + w - CURSOR_SIZE;

	cursor_bl.style.position = p;
	cursor_bl.style.zIndex   = z;
	cursor_bl.style.top      = t + h - CURSOR_SIZE;
	cursor_bl.style.left     = l;

	cursor_br.style.position = p;
	cursor_br.style.zIndex   = z;
	cursor_br.style.top      = t + h - CURSOR_SIZE;
	cursor_br.style.left     = l + w - CURSOR_SIZE;


}

*/


function setCursor(obj) {

/* #### 20080702 #### Commented out. */
/*

	var oP = obj.offsetParent;
	var cS = getComputedStyle(obj,'');

	var t = parseInt(oP.offsetTop)  + parseInt(obj.offsetTop);
	var l = parseInt(oP.offsetLeft) + parseInt(obj.offsetLeft);
	var w = parseInt(cS.getPropertyValue('width'));
	var h = parseInt(cS.getPropertyValue('height'));

	if( h == 0 || isNaN(h) ){
		//-- obj dose not have height value (maybe 'a' tag) ----
		h = parseInt( cS.getPropertyValue('font-size') );
		if      (h == 16) { h = 21; } // 16pt font cell size = 17x21
		else if (h == 12) { h = 16; } // 12pt font cell size = 13x16
		else if (h == 10) { h = 13; } // 10pt font cell size = 11x12 (+1)
	}

	cursor_tl.style.top      = t;
	cursor_tl.style.left     = l;

	cursor_tr.style.top      = t;
	cursor_tr.style.left     = l + w - CURSOR_SIZE;

	cursor_bl.style.top      = t + h - CURSOR_SIZE;
	cursor_bl.style.left     = l;

	cursor_br.style.top      = t + h - CURSOR_SIZE;
	cursor_br.style.left     = l + w - CURSOR_SIZE;
*/

}




//----------------------------------------------------------------
//-- side blue lines

/* #### 20080628 #### Deleted. */
//function extendSideBlueLine() {}


//----------------------------------------------------------------
//-- scroll buttons


function hideScrollButton() {
	gkong.HideUpWindowScrollButton();
	//gkong.HideDownWindowScrollButton();
}


function showScrollButton() {
	/* #### 20080711 #### Deleted arguments of ShowUpWindowScrollButton(). */
	gkong.ShowUpWindowScrollButton();
	//gkong.ShowUpWindowScrollButton( 204, 1, 229, 1 );

	//gkong.ShowDownWindowScrollButton( 225,110, 225,138 );
}



function hideScrollButton_debugIndex() {
	//gkong.HideUpWindowScrollButton();
	gkong.HideDownWindowScrollButton();
}

function showScrollButton_debugIndex() {
	/* #### 20080711 #### Deleted arguments of ShowUpWindowScrollButton(). */
	//gkong.ShowUpWindowScrollButton();

	gkong.ShowDownWindowScrollButton( 210,130, 210,158 );
}






//----------------------------------------------------------------
//----------------------------------------------------------------
//----------------------------------------------------------------







/*

//----------------------------------------------------------------
//-- functions for the reaction of button images


== note ====

	1. a clickable image element in HTML files must have a child or more.
	   (the last child will be treated as the spacer that defined hit-area)

	2. and requires descriptions of image src in CSS files.

	3. and requires additional JavaScript descriptions that set reactions and urls.

	4. and an image file must contain 2 patterns.




== ex ====



	---- .html --------
	// #### 20080807 #### Changed to reduce size of css file.

	<!-- parent (base image) -->
	<div class="btn_base XXXX_[width]x[height]" id="NNNN" style="........">

		<!-- inner texts & images -->
		<div class="inner_base">
			<span class="........">????????</span>
		</div>

		<!-- last child = hit-area -->
		<div class="spacer_base"></div>

	</div>


	<!-- additional JavaScript descriptions -->
	<script>;

		//-- set the reaction on events 
		setButtonImages( $('NNNN') );

		//-- set the urls and wipe animation types on the click event.
		setOnclickUrlUD( $('NNNN'), "url_For_UpWindow.html",   typeOfWipeAnimation_For_UpWindow,
							  "url_For_DownWindow.html", typeOfWipeAnimation_For_DownWindow);

	</script>




	---- .css --------
	// #### 20080807 #### Changed to reduce size of css file.

	#XXXX_[width]x[height] {
		width  : [width]px;
		height : [height]px;
		background-image: url(ClickableImage.gif);
	}



	#NNNN { position : absolute; left : 52px; top : 60px; }



	---- ClickableImage.gif --------

	+--------[width]px-------+
	|                        |
	|    normal pattern     [height]px
	|                        |
	+------------------------+
	|                        |
	|    selected pattern   [height]px
	|                        |
	+------------------------+


*/


/*

//----------------------------------------------------------------
//-- functions for the reaction of button images

== note ====

 Following functions MUST BE CALLED when click & transit.

  - Kong::PlaySE                  ( Not necessary if use setButtonImage(). )
  - Kong::ShowLoadingIcon         ( Not necessary if use setButtonImage(). )
  - Kong::ShowClickEffect         ( Not necessary if use setButtonImage(). )
  - Kong::SetTransition           ( Not necessary if use setOnclickUrlUD() or if call setUrl*() at once. )



 Following functions MUST BE CALLED when click & input.

  - Kong::PlaySE                  ( Not necessary if use setButtonImage() and set SBIMG_NO_LOADINGICON_NO_PARTICLE for argument. )



 Following functions MUST BE CALLED when onchange of input tag.

  - Kong::ShowLoadingIcon         ( Not necessary if call setUrl*(). )



 Following functions MUST BE CALLED when click & manual transit.

  -- Before Change by DOM.

    - Kong::PlaySE                  ( Not necessary if use setButtonImage(). )
    - Kong::ShowLoadingIcon         ( Not necessary if use setButtonImage(). )
    - Kong::ShowClickEffect         ( Not necessary if use setButtonImage(). )
    - Kong::SetTransitionRangeOnce  ( Not necessary if call beforeChangeDOMforManualTransition() or if not use wipe animation with range specification. )
    - Kong::SetManualTransition     ( Not necessary if call beforeChangeDOMforManualTransition(). )

  -- After Change by DOM.

    - waitAllImagesComplete         ( Not necessary if call afterChangeDOMforManualTransition(). ) # This funciton is Now Testing.
    - gkong.StartManualTransition   ( Not necessary if call afterChangeDOMforManualTransition(). )
    - gkong.HideLoadingIcon         ( Not necessary if call afterChangeDOMforManualTransition(). )
    - gkong.PlaySE                  ( Not necessary if call afterChangeDOMforManualTransition(). )




*/


//----------------------------------------------------------------
//-- functions for the reaction of button images


var BUTTON_NORMAL   = 0;
var BUTTON_SELECTED = 1;

/* #### 20080827 #### Changed arguments of bgPos() and not to use getPropertyValue(). */
function bgPos(h, n) { dPrint("$$$$$$$$$$ Called bgPos : " + n); return "0px " + h * (-1) * n + "px"; }


/* #### 20080628 #### Renamed. */
var gObjOnmousedown = null;  //-- the object that the "onMouseDown" event occured.
function setObjOnmousedown(id)   { gObjOnmousedown = id; }
function clearObjOnmousedown()   { gObjOnmousedown = null; /* clearCursor(); */ }
function checkObjOnmousedown(id) { if(gObjOnmousedown == id) { return true;} else {return false;} }



/* #### 20080628 #### Changed for PC Opera 9.5 */
//window.onunload = clearStates;
window.addEventListener('mouseup', function(){ clearObjOnmousedown(); }, false);





function getLastChild( o ) { return o.children[o.children.length-1] }




/* #### 20080602 #### Added functions to prevent clicking twice. */
/* #### 20080628 #### Renamed. */
/*
var setButtonImagesState = 0;
function getSetButtonImagesState()   { return setButtonImagesState; }
function setSetButtonImagesState()   { setButtonImagesState = 1; }
function clearSetButtonImagesState() { setButtonImagesState = 0; }

var setButtonImagesObject = null;
function getSetButtonImagesObject()   { return setButtonImagesObject; }
function setSetButtonImagesObject(o)  { setButtonImagesObject = o; }
function clearSetButtonImagesObject() { setButtonImagesObject = null; }
*/

var gClickedObjectId = null;
function getClickedObjectId()   { return gClickedObjectId; }
function setClickedObjectId(n)  { gClickedObjectId = n;    dPrint("[[[[[[[[ setClickedObjectId   : " + n); }
function clearClickedObjectId() { gClickedObjectId = null; dPrint("[[[[[[[[ clearClickedObjectId : null"); }



/* #### 20080714 #### Added to init button image. */

var gMouseEvent = document.createEvent('MouseEvents');
gMouseEvent.initEvent('mouseout', true, true);

var gObjectIdToInitImage = null;

function getObjectIdToInitButtonImage()    { return gObjectIdToInitImage; }
function setObjectIdToInitButtonImage( n ) { gObjectIdToInitImage = n; }
function clearObjectIdToInitButtonImage()  { gObjectIdToInitImage = null; }

function initObjectIdToInitButtonImage( n ) {

	if ( gObjectIdToInitImage != null && gObjectIdToInitImage != n ) {
		var o = $(gObjectIdToInitImage);
		if (o) {
			// dPrint("@@@@@@@@@@@@@@@@@ : before dispatch mouseout : " + gObjectIdToInitImage + " :: gcoi:" + getClickedObjectId());
			getLastChild(o).dispatchEvent(gMouseEvent);
			// dPrint("@@@@@@@@@@@@@@@@@ : after  dispatch mouseout : " + gObjectIdToInitImage + " :: gcoi:" + getClickedObjectId());
		}
	}

	if ( n ) {
		setObjectIdToInitButtonImage(n);
	} else {
		clearObjectIdToInitButtonImage();
	}

}



/* #### 20080714 #### Added to init button image. */
window.addEventListener('blur', function(){ initObjectIdToInitButtonImage(); }, false);







var gSBI_dPrint = true;  /* #### 20080714 #### for debug. */

/* #### 20080702 #### Commented out clearCusor(). */
/* #### 20080702 #### Changed 2nd argument. */
//function setButtonImages( o, cursor ) {
function setButtonImages( o, opt ) {

	var id     = o.getAttribute("id");
	var spacer = getLastChild(o);

	/* #### 20080827 #### Changed not to use getComputedStyle(). */
	// var h      = o.offsetHeight;  /* #### 20080927 #### Commented out and changed the first argument of bgPos() from "h" to "o.offsetHeight". */

	var oStyle = o.style;
	var a      = setButtonImages.arguments;

	var bg     = BUTTON_NORMAL;


	spacer.addEventListener('click', function( e ) {
			if (gSBI_dPrint) dPrint(id+ ' click'); /* #### 20080714 #### for debug. */
			/* #### 20080628 #### Renamed functions to prevent clicking twice. */
			if (getClickedObjectId() == null) { //
				if (gSBI_dPrint) dPrint(id+ ' click ---- execute'); /* #### 20080714 #### for debug. */

				setClickedObjectId(id);
				/* #### 20080714 #### Added to init button image. */
				initObjectIdToInitButtonImage(id);
				/* #### 200806028 #### SE No. to macro name. */
				gkong.PlaySE(TWL_SHOP_SE_ONCLICK);
				/* #### 20080702 #### Changed 2nd argument. */

				if (a.length == 2 ) {

					/* #### 20080715 #### Changed macro name. */
					if (opt == SBIMG_NO_LOADINGICON_NO_PARTICLE ) {

						/* #### 20080702 #### Added for input tag. */
						/* #### 20080827 #### Changed arguments of bgPos(). */
						/* #### 20080927 #### Changed the first argument of bgPos() from "h" to "o.offsetHeight". */

						if (bg != BUTTON_NORMAL) { oStyle.backgroundPosition = bgPos(o.offsetHeight, BUTTON_NORMAL); bg = BUTTON_NORMAL; }
						clearClickedObjectId(); // #### 20080714 #### Currected */

					} else if (opt == SBIMG_NO_CURSOR ){

						/* #### 20080715 #### Added to display particle on click. */

						/* #### 20080909 #### Now Testing to change pages by TWL Key Pad, but not fixed. */
						/* #### 20080920 #### Commented out. */
						//if ( gKeyNoParticle ) {
						//	gKeyNoParticle = false;
						//} else {
						//	gkong.ShowClickEffect(e.pageX, e.pageY);
						//}

						gkong.ShowClickEffect(e.pageX, e.pageY);

						/* #### 20080702 #### Added to force to show loading icon. */
						gkong.ShowLoadingIcon();
						//clearCursor(o);

					}

				} else {
					/* #### 20080715 #### Added to display particle on click. */

					/* #### 20080909 #### Now Testing to change pages by TWL Key Pad, but not fixed. */
					/* #### 20081005 #### Commented out for bug fix. */
					//if ( gKeyNoParticle ) {
					//	gKeyNoParticle = false;
					//} else {
					//	gkong.ShowClickEffect(e.pageX, e.pageY);
					//}

					/* #### 20081005 #### Commented out for bug fix. */
					gkong.ShowClickEffect(e.pageX, e.pageY);

					/* #### 20080702 #### Added to force to show loading icon. */
					gkong.ShowLoadingIcon();
					//setCursor(o);
				}
			}

		}, false);


	spacer.addEventListener('mousedown', function() {
			if (gSBI_dPrint) dPrint(id + ' mousedown'); /* #### 20080714 #### for debug. */
			/* #### 20080628 #### Renamed functions to prevent clicking twice. */

			if (getClickedObjectId() == null) {
				if (gSBI_dPrint) dPrint(id + ' mousedown ---- exceute'); /* #### 20080714 #### for debug. */
				/* #### 200806028 #### SE No. to macro name. */
				gkong.PlaySE(TWL_SHOP_SE_ONMOUSEDOWN);
				/* #### 20080827 #### Changed arguments of bgPos(). */
				/* #### 20080927 #### Changed the first argument of bgPos() from "h" to "o.offsetHeight". */
				if (bg != BUTTON_SELECTED) { oStyle.backgroundPosition = bgPos(o.offsetHeight, BUTTON_SELECTED); bg = BUTTON_SELECTED; }
				initObjectIdToInitButtonImage(id);
				setObjOnmousedown(id);
			}

		}, false);

	spacer.addEventListener('mouseover', function() {
			if (gSBI_dPrint) dPrint(id + ' mouseover'); /* #### 20080714 #### for debug. */
			/* #### 20080628 #### Renamed functions to prevent clicking twice. */

			if (getClickedObjectId() == null) {
				if (gSBI_dPrint) dPrint(id + ' mouseover ---- exceute'); /* #### 20080714 #### for debug. */
				if (checkObjOnmousedown(id)) {
					/* #### 200806028 #### SE No. to macro name. */
					gkong.PlaySE(TWL_SHOP_SE_ONMOUSEDOWN);
					/* #### 20080827 #### Changed arguments of bgPos(). */
					/* #### 20080927 #### Changed the first argument of bgPos() from "h" to "o.offsetHeight". */
					if (bg != BUTTON_SELECTED) { oStyle.backgroundPosition = bgPos(o.offsetHeight, BUTTON_SELECTED); bg = BUTTON_SELECTED; }
					initObjectIdToInitButtonImage(id);
				}
			}

		}, false);

	spacer.addEventListener('mouseout', function() {
			if (gSBI_dPrint) dPrint(id + ' mouseout'); /* #### 20080714 #### for debug. */
			/* #### 20080628 #### Renamed functions to prevent clicking twice. */

			if (getClickedObjectId() == null) {
				if (gSBI_dPrint) dPrint(id + ' mouseout ---- exceute'); /* #### 20080714 #### for debug. */
				//clearCursor(); /* #### 20080602 #### Commented out clearCusor(). */
				/* #### 20080827 #### Changed arguments of bgPos(). */
				/* #### 20080927 #### Changed the first argument of bgPos() from "h" to "o.offsetHeight". */
				if (bg != BUTTON_NORMAL) { oStyle.backgroundPosition = bgPos(o.offsetHeight, BUTTON_NORMAL); bg = BUTTON_NORMAL; }
			}

		}, false);


	/* #### 20080717 #### Deleted functions onFocus & onBlur. (Necessary if use spatial navigation.) */
	// spacer.addEventListener('focus', function() { if (gSBI_dPrint) dPrint(id + ' focus'); }, false);
	// spacer.addEventListener('blur',  function() { if (gSBI_dPrint) dPrint(id + ' blur' ); }, false);


}



//----------------------------------------------------------------
//-- add event listener to a clickable object (set urls and types of animation)


/* #### 20081005 #### Added setOnclick() from BroadOn's base.js and replaced from ".onclick=" to "setOnclick" in html files. */
function setOnclick(o, action, setTransition) {
	var spacer = getLastChild(o);
	spacer.onclick = function() {

		/* #### 20081006 #### CHANGED for TEST. The function to prevent clicking twice will not be called when the 3rd arg is "true". */
		// if (setTransition == false) {
		if (setTransition == "FORCE_TO_EVAL_ACTION") {

			eval(action);

		} else if (getClickedTransition() == null) {
			setClickedTransition();
			eval(action);
			// gkong.HideLoadingIcon(); /* #### 20080717 #### Deleted HideLoadingIcon. (Wabe) */
			dPrint("---- exe ----");
		} else {
			/* #### 20081005 #### Commented out. */
			// trace("not set action in setOnclick(). gClickedTransition is "+getClickedTransition());
			dPrint("---- not ---- not set action in setOnclick(). gClickedTransition is "+getClickedTransition());
		}
	};
}



/* #### 20080602 #### Added functions to prevent clicking twice. */
/* #### 20080628 #### Renamed. */

/*
var setOnclickUrlState = 0;
function getSetOnclickUrlState()   { return setOnclickUrlState; }
function setSetOnclickUrlState()   { setOnclickUrlState = 1; }
function clearSetOnclickUrlState() { setOnclickUrlState = 0; }
*/

var gClickedTransition = null;
function getClickedTransition()   { return gClickedTransition; }
function setClickedTransition()   { gClickedTransition = true; }
function clearClickedTransition() { gClickedTransition = null; }



/* #### 20080712 #### Deleted functions to prevent clicking twice. */
/* #### 20080712 #### Deleted "var spacer". */
function setOnclickUrlUD( o, urlU, animU, urlD, animD ) {
	getLastChild(o).addEventListener('click', function() { setUrlUD(urlU, animU, urlD, animD); }, false);
}

/* #### 20080712 #### Deleted functions to prevent clicking twice. */
/* #### 20080712 #### Deleted "var spacer". */
function setOnclickUrlU( o, urlU, animU ) {
	getLastChild(o).addEventListener('click', function() { setUrlU(urlU, animU); }, false);
}

/* #### 20080712 #### Deleted functions to prevent clicking twice. */
/* #### 20080712 #### Deleted "var spacer". */
function setOnclickUrlD( o, urlD, animD ) {
	getLastChild(o).addEventListener('click', function() { setUrlD(urlD, animD); }, false);
}


/* #### 20080712 #### Deleted "var spacer". */
function setOnclickHideProgressBar( o ) {
	getLastChild(o).addEventListener('click', function() { gkong.HideProgressBar(); }, false);
}



/* #### 20080602 #### functions to prevent clicking twice. */
/* #### 20080628 #### Renamed. */
function clearClickedStates() {

	var a = clearClickedStates.arguments;

	/* #### 20080709 #### Added not to init button image. */
	/* #### 20080712 #### Corrected. */

	if ( a.length == 1 ) {
		if ( a[0] == CCS_NOT_INIT_BUTTON_IMG ) {

			/* #### 20081004 #### NOTE: CCS_NOT_INIT_BUTTON_IMG is used not to init button image of DownWindow if only UpWindow is transited or manual transited. */

			/* #### 20081005 #### Added setTimeout() for wait. */

			/* #### 20081008 #### Changed to wait only with CCS_NOT_INIT_BUTTON_IMG. */

			setTimeout( function() {
					//-- not init button image.
					clearClickedObjectId();
					clearClickedTransition();
				}, WAIT_FOR_CCS );

		} else {
			clearClickedObjectId();
			clearClickedTransition();
			initObjectIdToInitButtonImage();
		}

	} else {
		clearClickedObjectId();
		clearClickedTransition();
		initObjectIdToInitButtonImage();
	}


}






/* #### 20080628 #### Added sleep function. */
function sleep(msec) {
	var d1 = new Date().getTime();
	var d2 = new Date().getTime();
	while( d2 < d1 + msec ){
		d2 = new Date().getTime();
	}
}



/* #### 20080628 #### Renamed functions to prevent clicking twice. */
// #### 20080628 #### Changed for PC Opera 9.5
//window.onunload = clearClickedStates;
window.addEventListener('unload', clearClickedStates, false);




/* #### 20080628 #### Added functions to call from HTML files onload. */

function onload_scroll() {
	showScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

function onload_no_scroll() {
	hideScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

/* #### 20080814 #### Added to show loading icon in the Waiting Page(F-01 & P-13). */
function onload_please_wait() {
	hideScrollButton();
	/* #### 20080814 #### Added setTimeout() to force to show loading icon. */
	setTimeout( function() { gkong.ShowLoadingIcon(); }, 500);
	/* #### 20080921 #### Added to force to show loading icon.. */
	setTimeout( function() { gkong.ShowLoadingIcon(); }, 1000);
	/* #### 20080921 #### Added to force to show loading icon.. */
	setTimeout( function() { gkong.ShowLoadingIcon(); }, 1500);
	/* #### 20080921 #### Added to force to show loading icon.. */
	setTimeout( function() { gkong.ShowLoadingIcon(); }, 2000);
}

function onload_upWindow() {
	/* #### 20080709 #### Added not to init button image. */
	/* #### 20081004 #### NOTE: CCS_NOT_INIT_BUTTON_IMG is used not to init button images if only UpWindow is transited or manual transited. */
	clearClickedStates(CCS_NOT_INIT_BUTTON_IMG);

	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
}

/* #### 20080727 #### Added. */
function onload_error_page() {
	gkong.HideProgressBar();
	gkong.HideLoadingIcon();
	showScrollButton();
	gkong.PlaySE(TWL_SHOP_SE_WARNING);
}








/* #### 20080702 #### Added for debug. */
function dPrintEventInfo() {
	var a = dPrintEventInfo.arguments;
	var o = a[0];
	var n = "";
	if (a[1]) { n = a[1] + " " }
	o.addEventListener('click',     function(){ dPrint(n + 'click'    ); }, false);
	o.addEventListener('focus',     function(){ dPrint(n + 'focus'    ); }, false);
	o.addEventListener('blur',      function(){ dPrint(n + 'blur'     ); }, false);
	o.addEventListener('mouseup',   function(){ dPrint(n + 'mouseup'  ); }, false);
	o.addEventListener('mousedown', function(){ dPrint(n + 'mousedown'); }, false);
	o.addEventListener('mouseover', function(){ dPrint(n + 'mouseover'); }, false);
	o.addEventListener('mouseout',  function(){ dPrint(n + 'mouseout' ); }, false);
}










/* #### 20080712 #### Moved from "multi_page_DOM.js". */
function waitImageComplete( o ) {

	/* #### 20080717 #### TEST for NO WAIT. */
	return;

	while( o.complete != true ) {
		sleep(100);
	}
}

/* #### 20080712 #### Moved from "multi_page_DOM.js". */
/* #### 20080712 #### Changed to wait for all images of both windows. */
function waitAllImagesComplete() {

	/* #### 20080717 #### TEST for NO WAIT. */
	return;

	var imgs = new Array();
	imgs = upWindowObject.document.getElementsByTagName('img');
	for (i=0; i < imgs.length; i++) { waitImageComplete( imgs[i] ); }
	imgs = downWindowObject.document.getElementsByTagName('img');
	for (i=0; i < imgs.length; i++) { waitImageComplete( imgs[i] ); }
}



/* #### 20080712 #### Added for ManualTransition simply.*/
function beforeChangeDOMforManualTransition() {

	/* #### 20081005 #### For NCL: If the return value of getClickedTransition is true, SetManualTransition will not be called in this function. */
	/* #### 20081005 #### For NCL: BroadOn's setOnclick() will call setClickedTransition() on the click event. */
	/* #### 20081005 #### For NCL: But if the 3rd arg of setOnclick() is "false", will not call setClickedTransition(), so SetManualTransition will be called. */
	/* #### 20081005 #### For NCL: In the page of DOM change with beforeChage... and afterChange... or with multi_page_DOM.js, set functions to the onclick by setOnclick() with the 3rd arg "false". */


	/* #### 20081006 #### Commented out the following "if" statement and setClickedTransition(). */
	/* #### 20081006 #### Changed for TEST. The function to prevent clicking twice will added to the click event in the setOnclick(). Not cared here. */
	// if (getClickedTransition() == true ) return;
	// setClickedTransition();

	/* #### 20080715 #### Added. */
	sleep(WAIT_FOR_MANUALTRANSITION);

	var a = beforeChangeDOMforManualTransition.arguments;
	if (a.length == 0) {
		gkong.SetManualTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS);
	} else if (a.length == 2) {
		gkong.SetManualTransition(a[0], a[1]);
	} else if (a.length == 6) {
		gkong.SetTransitionRangeOnce(a[2], a[3], a[4], a[5]);
		gkong.SetManualTransition(a[0], a[1]);
	}


}

/* #### 20080712 #### Added for ManualTransition simply.*/
/* #### 20080927 #### Changed arguments of afterChangeDOMforManualTransition() to select to play SE or not. */
/* #### 20081004 #### Changed the order of arguments for bug fix. */
/* #### 20081004 #### NOTE: 1st argument of afterChangeDOMforManualTransition(): null or CCS_NOT_INIT_BUTTON_IMG not to init button image. */
/* #### 20081004 #### NOTE: 2nd argument of afterChangeDOMforManualTransition(): null or ACD_NO_SE not to play SE. */
function afterChangeDOMforManualTransition() {

	var a = afterChangeDOMforManualTransition.arguments;

	waitAllImagesComplete();
	gkong.StartManualTransition();
	gkong.HideLoadingIcon();

	if (a.length == 0) {
		gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
		clearClickedStates();
	} else if (a.length == 1) {
		/* #### 20081004 #### Changed the order of arguments for bug fix. */
		gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
		clearClickedStates( a[0] );
	} else if (a.length == 2) {
		/* #### 20081004 #### Changed the order of arguments for bug fix. Please see arguments of this function in B_10_d.html also. */
		if ( a[1] != ACD_NO_SE ) { gkong.PlaySE(TWL_SHOP_SE_TRANSIT); }
		clearClickedStates( a[0] );
	}

}


/* #### 20080718 #### Added.*/
function addClickEffectAndSE( o ) {
	o.addEventListener('click', function(e) {
			gkong.PlaySE(TWL_SHOP_SE_ONCLICK);
			gkong.ShowClickEffect(e.pageX, e.pageY);
		}, false);
}




/* #### 20080930 #### Added to display "Points not available" message in the 1st Period and the 2nd Period.*/
/* #### 20080930 #### TODO: I think it is not appropriate to describe this processing in javascript file. */
/* #### 20080930 #### TODO: Please comment out the block of "Add Points" button in ConstElements_d.jspf in the 1st Period and the 2nd Period. */
window.addEventListener('DOMContentLoaded', function(){ if ( $('points') ) { $('points').style.display = "none"; }}, false )




/* #### 20080909 #### Now Testing to change pages by TWL Key Pad, but not fixed. */

var gKeyNoParticle = false;


/* #### 20080920 #### Commented out. */
/*
var gME = document.createEvent('MouseEvents');

function changePagesByKey() {
	var code = event.keyCode;
	if ( code == OP_KEY_PAD_LEFT || code == 37 ) {
		var b = $('prev_button');
		if (b) {
			gKeyNoParticle = true;
			gME.initEvent('mousedown', true, true);
			getLastChild(b).dispatchEvent(gME);
			setTimeout(function(){
					gME.initEvent('click', true, true);
					getLastChild(b).dispatchEvent(gME);
				}, WAIT_FOR_SETURL);
		}

	} else if ( code == OP_KEY_PAD_RIGHT || code == 39 ) {
		var b = $('next_button');
		if (b) {
			gKeyNoParticle = true;
			gME.initEvent('mousedown', true, true);
			getLastChild(b).dispatchEvent(gME);
			setTimeout(function(){
					gME.initEvent('click', true, true);
					getLastChild(b).dispatchEvent(gME);
				}, WAIT_FOR_SETURL);
		}
	}
}
*/

/* #### 20080909 #### Now Testing to change pages by TWL Key Pad, but not fixed. */
/* #### 20080920 #### Commented out. */
// window.addEventListener('keydown', changePagesByKey, false);



/* #### 20081004 #### Added wait for Kong::Restart() & Kong::ReturnToMenu(). */
function waitRestart()      { setTimeout( function() { gkong.Restart();      }, WAIT_FOR_RESTART ); }
function waitReturnToMenu() { setTimeout( function() { gkong.ReturnToMenu(); }, WAIT_FOR_RESTART ); }

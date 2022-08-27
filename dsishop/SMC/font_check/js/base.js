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
	gkong.SetTransition(WIPE_ANIM_TRANS, WIPE_ANIM_TRANS); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
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

var CCS_NOT_INIT_BUTTON_IMG = 0;


//----------------------------------------------------------------
//-- set urls and types of animation

//-- wait maybe required... if no wait, button images will not change before the wipe animation.

/* #### 20080628 #### Changed wait time from 0ms to 200ms */
var WAIT_FOR_SETURL           = 200;

/* #### 20080715 #### Moved from "multi_page_DOM.js". */
var WAIT_FOR_MANUALTRANSITION = 300;



function setUrlUD() {
	var a = setUrlUD.arguments;
	if (a.length == 2) {
		//hideScrollButton();
		gkong.SetTransition(WIPE_ANIM_NONE, WIPE_ANIM_NONE); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
				if (a[1] != "") window.open( a[1], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 4) {
		//hideScrollButton();
		gkong.SetTransition(a[1], a[3]); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
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
		gkong.SetTransition(WIPE_ANIM_NONE, WIPE_ANIM_NONE); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'UpWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 2) {
		//hideScrollButton();
		gkong.SetTransition(a[1], WIPE_ANIM_NONE); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
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
		gkong.SetTransition(WIPE_ANIM_NONE, WIPE_ANIM_NONE); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
		setTimeout( function() {
				if (a[0] != "") window.open( a[0], 'DownWindow');
			} ,  WAIT_FOR_SETURL);
	} else if (a.length == 2) {
		//hideScrollButton();
		gkong.SetTransition(WIPE_ANIM_NONE, a[1]); /* #### 20080702 #### SetTransition* MUST BE CALLED. */
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

	<!-- parent (base image) -->
	<div class="XXXX" id="NNNN" style="........">

		<!-- inner texts & images -->
		<div class="XXXX_inner">
			<span class="........">????????</span>
		</div>

		<!-- last child = hit-area -->
		<div class="XXXX_spacer"></div>

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

	.YYYY_XXXX {
		position : relative;
		width  : [width]px;
		height : [height]px;
		background-image: url(ClickableImage.gif);
		background-repeat: no-repeat;
		background-position: 0px 0px;
		overflow: hidden;
	}

	._XXXX_inner {
		position : relative;
		padding : 2 3 3 3;
		width  : [width]px;
		height : [height]px;
		display        : table-cell;
		vertical-align : middle;
		text-align     : center;
	}

	._XXXX_spacer {
		position : absolute;
		left   : 0px;
		top    : 0px;
		width  : [width]px;
		height : [height]px;
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

  - Kong::ShowLoadingIcon         ( Not necessary if call setUrl*() at once. )



 Following functions MUST BE CALLED when click & manual transit.

  -- Before Change by DOM.

    - Kong::PlaySE                  ( Not necessary if use setButtonImage(). )
    - Kong::ShowLoadingIcon         ( Not necessary if use setButtonImage(). )
    - Kong::ShowClickEffect         ( Not necessary if use setButtonImage(). )
    - Kong::SetTransitionRangeOnce  ( Not necessary if call beforeChangeDOMforManualTransition() or if not use wipe animation with range specification. )
    - Kong::SetManualTransition     ( Not necessary if call beforeChangeDOMforManualTransition(). )

  -- After Change by DOM.

    - ? waitAllImagesComplete       ( Not necessary if call afterChangeDOMforManualTransition(). )
    - gkong.StartManualTransition   ( Not necessary if call afterChangeDOMforManualTransition(). )
    - gkong.HideLoadingIcon         ( Not necessary if call afterChangeDOMforManualTransition(). )
    - gkong.PlaySE                  ( Not necessary if call afterChangeDOMforManualTransition(). )




*/


//----------------------------------------------------------------
//-- functions for the reaction of button images


var BUTTON_NORMAL   = 0;
var BUTTON_SELECTED = 1;

function bgPos(oCS, n) { dPrint("$$$$$$$$$$ Called bgPos : " + n); return "0px " + ( parseInt(oCS.getPropertyValue('height')) * (-1) * n) + "px" }


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
	var oCS    = getComputedStyle(o, '');
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
						if (bg != BUTTON_NORMAL) { oStyle.backgroundPosition = bgPos(oCS, BUTTON_NORMAL); bg = BUTTON_NORMAL; }
						clearClickedObjectId(); // #### 20080714 #### Currected */
					} else if (opt == SBIMG_NO_CURSOR ){
						/* #### 20080715 #### Added to display particle on click. */
						gkong.ShowClickEffect(e.pageX, e.pageY);
						/* #### 20080702 #### Added to force to show loading icon. */
						gkong.ShowLoadingIcon();
						//clearCursor(o);
					}
				} else {
					/* #### 20080715 #### Added to display particle on click. */
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
				if (bg != BUTTON_SELECTED) { oStyle.backgroundPosition = bgPos(oCS, BUTTON_SELECTED); bg = BUTTON_SELECTED; }
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
					if (bg != BUTTON_SELECTED) { oStyle.backgroundPosition = bgPos(oCS, BUTTON_SELECTED); bg = BUTTON_SELECTED; }
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
				if (bg != BUTTON_NORMAL) { oStyle.backgroundPosition = bgPos(oCS, BUTTON_NORMAL); bg = BUTTON_NORMAL; }
			}

		}, false);


	/* #### 20080717 #### Deleted functions onFocus & onBlur. (Necessary if use spatial navigation.) */
	// spacer.addEventListener('focus', function() { if (gSBI_dPrint) dPrint(id + ' focus'); }, false);
	// spacer.addEventListener('blur',  function() { if (gSBI_dPrint) dPrint(id + ' blur' ); }, false);


}



//----------------------------------------------------------------
//-- add event listener to a clickable object (set urls and types of animation)



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

	clearClickedObjectId();
	clearClickedTransition();

	/* #### 20080709 #### Added not to init button image. */
	/* #### 20080712 #### Corrected. */
	if ( a.length == 1 ) {
		if ( a[0] == CCS_NOT_INIT_BUTTON_IMG ) {
			//-- not init button image.
		} else {
			initObjectIdToInitButtonImage()
		}
	} else {
		initObjectIdToInitButtonImage()
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

function onload_upWindow() {
	/* #### 20080709 #### Added not to init button image. */
	clearClickedStates(CCS_NOT_INIT_BUTTON_IMG);

	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
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
	if (getClickedTransition() == true ) return;
	setClickedTransition();

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
function afterChangeDOMforManualTransition( ccs_opt ) {
	waitAllImagesComplete();
	gkong.StartManualTransition();
	gkong.HideLoadingIcon();
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT);
	clearClickedStates(ccs_opt);
}


/* #### 20080718 #### Added.*/
function addClickEffectAndSE( o ) {
	o.addEventListener('click', function(e) {
			gkong.PlaySE(TWL_SHOP_SE_ONCLICK);
			gkong.ShowClickEffect(e.pageX, e.pageY);
		}, false);
}


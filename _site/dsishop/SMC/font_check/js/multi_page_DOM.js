//========================================
// multi_page_DOM.js
//========================================


/* #### 20080702 #### Added note. */

/*
// how to redraw by DOM (ManualTransition).


== ex ====


	---- .html --------

	<div class="XXXX" id="NNNN" style="........">
		<div class="XXXX_inner"><span class="........">????????</span></div>
		<div class="XXXX_spacer"></div>
	</div>

	<script>;
		setButtonImages( $('NNNN') );              //<-- Kong::PlaySE & Kong::ShowLoadingIcon & Kong::ShowClickEffect
		$('NNNN').onclick = "REDRAW_BY_DOM();";
	</script>


	---- .js --------

	function REDRAW_BY_DOM() {

		//-- to prevent clicking twice.
		if (getClickedTransition() == true ) return;
		setClickedTransition();

		//====================================================
		//-- lock the old screen.
		//====================================================
		gkong.SetTransitionRangeOnce(......); // #### 20080702 #### SetTransition* MUST BE CALLED.
		gkong.SetManualTransition(......);


		// redraw by DOM.
		    :
		    :
		    :

		waitAllImagesComplete();


		//====================================================
		//-- start to exchange the old screen to the new screen.
		//====================================================
		gkong.StartManualTransition();

		gkong.HideLoadingIcon();
		gkong.PlaySE(TWL_SHOP_SE_TRANSIT);

		//-- to be clickable.
		clearClickedStates();

	}

*/



/* #### 20080715 #### Moved to "base.js". */
// var WAIT_FOR_MANUALTRANSITION = 300;


var gTotalPages      = 0;

var gMaxContentNum   = 0;
var gContentsPerPage = 0;
var gMaxPageNum      = 0;

var gPageNum         = 0;
var gContentStart    = 0;
var gCurrentContent  = 0;



var gIsInit = true;


function getPageNum()    { return gPageNum; }
function getMaxPageNum() { return gMaxPageNum; }

/* will be defined in HTML files */
var gfnSetBtnContent   = function() {}
var gfnChangePageTitle = function() {}

/* ---- */
var gTRangeUpY0 =   0;
var gTRangeUpY1 = 192; /* #### 20080711 #### Changed from 191 to 192. */
var gTRangeDnY0 =  26;
var gTRangeDnY1 = 164;

function setTRangeOnce() { gkong.SetTransitionRangeOnce(gTRangeUpY0, gTRangeUpY1, gTRangeDnY0, gTRangeDnY1); }



function initDOM() {
	var a = initDOM.arguments;
	gTotalPages       = a[0];
	gTopPageInThis    = a[1];
	gMaxContentNum    = a[2];
	gContentsPerPage  = a[3];
	gMaxPageNum       = a[4];
	gPageNum          = a[5];
	gBtnIdBasename    = a[6];
	gSpanIdPageNum    = a[7];
	if (a[8]) { gfnSetBtnContent   = a[8]; }
	if (a[9]) { gfnChangePageTitle = a[9]; }
	changeDOM();
}


function changeDOM() {

	if (getClickedTransition() == true ) return; /*@@@@*/

	//------------------------------------------
	setClickedTransition(); /*@@@@*/
	//------------------------------------------

	var a = changeDOM.arguments;

	if (a.length == 0) {

		var isInit = true;

	} else {

		sleep(WAIT_FOR_MANUALTRANSITION);

		var isInit = false;

		var pm    = a[0];
		var animU = a[1];
		var animD = a[2];
		if (!animU) { animU = WIPE_ANIM_NONE; }
		if (!animD) { animD = WIPE_ANIM_NONE; }

		setTRangeOnce(); /*@@@@*/
		gkong.SetManualTransition(animU, animD); /*@@@@*/


		gPageNum += pm;
		if ( gPageNum < 1 )            { gPageNum = gMaxPageNum; }
		if ( gPageNum > gMaxPageNum )  { gPageNum = 1; }

	}


	gContentStart = 1 + ( gPageNum - 1 ) * gContentsPerPage;


	clearCursor();

	for (i = 1; i <= gContentsPerPage; i++) {

		var o = $(gBtnIdBasename + i);
		var gContentNum = ( gContentStart - 1 ) + i;

		if (isInit) {
			setButtonImages(o);
		} else {
		}


		if (gContentNum <= gMaxContentNum) {
			gfnSetBtnContent(o, i, gContentNum, true); /* will be defined in HTML files */
			// if (gContentNum == gCurrentContent) { setCursor(o); }
		} else {
			gfnSetBtnContent(o, i, gContentNum, false); /* will be defined in HTML files */
		}

	}


	$(gSpanIdPageNum).innerHTML = "" + (gTopPageInThis  - 1 + gPageNum) + " / " + gTotalPages;

	gfnChangePageTitle(); /* will be defined in HTML files */

	waitAllImagesComplete(); /*@@@@*/


	if (isInit) {
		isInit = false;
	} else {
		gkong.StartManualTransition(); /*@@@@*/
	}

	gkong.HideLoadingIcon(); /*@@@@*/
	gkong.PlaySE(TWL_SHOP_SE_TRANSIT); /*@@@@*/


	//------------------------------------------
	clearClickedStates(); /*@@@@*/
	//------------------------------------------


}


/* #### 20080712 #### Deleted functions to prevent clicking twice. */
function setUrlTRangeOnceUD( urlU, animU, urlD, animD ) {
	setTRangeOnce();
	setUrlUD(urlU, animU, urlD, animD);
}

/* #### 20080712 #### Deleted functions to prevent clicking twice. */
function setUrlTRangeOnceU( urlU, animU ) {
	setTRangeOnce();
	setUrlU(urlU, animU);
}

/* #### 20080712 #### Deleted functions to prevent clicking twice. */
function setUrlTRangeOnceD( urlD, animD ) {
	setTRangeOnce();
	setUrlD(urlD, animD);
}


/* #### 20080712 #### Moved to "base.js". */
// function waitImageComplete( o ) {}

/* #### 20080712 #### Moved to "base.js". */
// function waitAllImagesComplete() {}



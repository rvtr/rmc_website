function MovePage( up_url, down_url, up_anim, down_anim )
{
	if ( up_url != "" || down_url != "" )
	{
        if ( up_anim == undefined ) up_anim = 0;
    	if ( down_anim == undefined ) down_anim = 0;
    	
    	var kong_ = new Kong();
    	kong_.SetTransition( up_anim, down_anim );
    	if ( up_url != "" )
		{
		    window.open( up_url, "UpWindow" );
		}
		if ( down_url != "" )
		{
		    window.open( down_url, "DownWindow" );
		}
	}
}

function ActiveKeyboard( type, title, field )
{
    var kong_ = new Kong;
	kong_.KbdActive( type, title, field);
}

function GoWeb()
{
    var up = up_url.value;
	var down = down_url.value;
	MovePage( up, down, 1, 1 );
}
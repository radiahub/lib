// ============================================================================
// Module      : theme.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Theme support
//               Events onthemechanged
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

var theme = {

    currentThemeID   : "",   // Set by theme.apply() method
    colorSchemeQuery : null, // Set by theme.init () method


	// **************************************************************************
	// **************************************************************************
	//
	// RUNTIME
	//
	// **************************************************************************
	// **************************************************************************

	getPreferredColorScheme : function()
	{
		//console.info("IN theme.getPreferredColorScheme()");
		if (window.matchMedia) {
    		var themeID = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light";
			return themeID;
		}
		else {
			var classname = document.documentElement.className;
			var themeID = str_replace("theme-", "", classname);
			return themeID;
		}
	},

    get : function() {
        //console.info("IN theme.get()");
        return theme.getPreferredColorScheme();
    },

    apply : function (themeID = "")
    {
        return new Promise((resolve)=>{
            if (themeID.length === 0) {
                themeID = theme.getPreferredColorScheme();
            }
            //console.info(`IN theme.apply() themeID='${themeID}'`);
            document.documentElement.className = "theme-" + themeID;
            theme.currentThemeID = themeID;
            
            const meta_color = css.val("--body");
            const themeColorMeta = document.querySelector('meta[name="theme-color"]');
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', meta_color);
            } 
            else {
                const meta = document.createElement('meta');
                meta.name = "theme-color";
                meta.content = meta_color;
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
            
            delay(0).then(()=>{
                		events.on("themechanged");
                		resolve();
            });
            
        }); 
    },


	// **************************************************************************
	// **************************************************************************
	//
	// RUNTIME EVENTS
	//
	// **************************************************************************
	// **************************************************************************

	onColorSchemeChanged : function()
	{
		var theme_id = theme.getPreferredColorScheme();
		//console.info("IN onColorSchemeChanged() new theme_id='" + theme_id + "'");
		theme.apply(theme_id).then(()=>{
		    //console.log("Resolved by theme.apply()");  
		});
	},


	// **************************************************************************
	// **************************************************************************
	//
	// INITIALIZATION
	//
	// **************************************************************************
	// **************************************************************************

	init : function()
	{
	    return new Promise((resolve)=>{
	        //console.info("IN theme.init()");
		    if (window.matchMedia) {
			    //console.log("Initializing window.matchMedia API");
			    theme.colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
			    theme.colorSchemeQuery.addEventListener('change', theme.onColorSchemeChanged);
		    }
		    theme.apply().then(()=>{
    		    //console.log("Resolved by theme.apply()");
    		    resolve();
		    });
	    });
	}

};


// ****************************************************************************
// ****************************************************************************
//
// Utilities around theme
//
// ****************************************************************************
// ****************************************************************************

function strParseTheme (str, theme_id)
{
	var result = str;
	if (typeof theme_id === "undefined") { theme_id = theme.currentThemeID; }
	if (theme_id === "light") {
		if (result.indexOf("bg_dark") > 0) {
			result = str_replace("bg_dark", "bg_light", result);
		}
	}
	else if (theme_id === "dark") {
		if (result.indexOf("bg_light") > 0) {
			result = str_replace("bg_light", "bg_dark", result);
		}
	}
	return result;
}



// End of file: theme.js
// ============================================================================

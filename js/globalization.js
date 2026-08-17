// ============================================================================
// Module      : globalization.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Globalization support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

var globalizedSupport = ["EN","ID", "FR", "DE"];
var globalizedDefault = "EN";

const globalizedLang = () => {
	var lang = globalizedDefault;
	if (window.Intl && typeof window.Intl === 'object') {
		lang = navigator.language;
		lang = lang.toUpperCase(); lang = lang.slice(0,2);
		if (globalizedSupport.indexOf(lang) < 0) { lang = globalizedDefault; }
	}
	//console.log(lang);
	return lang;
};

const globalizedFileUri = (fileURI) => {
	let result = fileURI;
	if (strlen(fileURI) > 0) {
		var lang_ = globalizedLang();
		//console.log(lang_);
		let p = fileURI.lastIndexOf("/");
		if (p > 0) {
			result = fileURI.slice(0, p) + "/" + lang_ + fileURI.slice(p);
		}
		else if (p === 0) {
			result = lang_ + fileURI;
		}
		else {
			result = lang_ + "/" + fileURI;
		}
	}
	//console.log(result);
	return result;
};


var R = {

	collection : [],

	indexOf : function(id) {
		//console.info("IN R.get() id='" + id + "'");
		for (var i = 0; i < R.collection.length; i++) {
			if (R.collection[i]["id"] === id) {
				return i;
			}
		}
		return -1;
	},

	reg : function(fileURL)
	{
		if (strlen(fileURL) > 0) {
			fileURL = globalizedFileUri(fileURL);
		}
		
		//console.info("IN R.reg() fileURL='" + fileURL + "'");
		
		var content = freadSync(fileURL, true);
		if (content !== null) {
			for (var i = 0; i < content.length; i++) {
				//if (i < 5) { console.log(JSON.stringify(content[i])); }
				var idx = R.indexOf(content[i]["id"]);
				if (idx >= 0) {
					R.collection[idx] = content[i];
				}
				else {
					R.collection.push(content[i]);
				}
			}
		}
	},

	reset : function()
	{
		//console.info("IN R.reset()");
		R.collection = [];
	},

	get : function(id) 
	{
		//console.info("IN R.get() id='" + id + "'");

		var result = null;

		var fromHTML = function() {
			var result = null;
			try {
				result = jQuery("#" + id).html();
				if (strlen(result) > 0) {
					result = str_replace("<br>",  "\n", result);
					result = str_replace("<br/>", "\n", result);
				}
				else {
					result = null;
				}
			}
			catch(e) {
				result = null;			
			}
			return result;
		};

		var result = fromHTML(id);
		if ((result === null) || (strlen(result) === 0)) {
			var idx = R.indexOf(id);
			if (idx >= 0) { result = R.collection[idx]["value"]; }
		}

        if (strlen(result) === 0) { result = null; }
		return result;
	},

    rn : function (id) { // rn = "Resolve Null"
        let result = R.get(id);
        if (result === null) {
            result = id;
        }
        return result;
    }
};




// End of file: globalization.js
// ============================================================================

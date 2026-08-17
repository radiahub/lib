// ============================================================================
// Module      : strings.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Strings library
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

const COUNTRY_ISO_2LTR = "ID";
const COUNTRY_NAME = "Indonesia";

const CURRENCY_FORMAT   = "RP[amount]";
const CURRENCY_ST_SHORT = "RP";
const CURRENCY_ISO_3LTR = "IDR";
const CURRENCY_DECIMALS = 0;

const ST_PHONE_CTRY_CODE = "+62";

const thousandsSeparator = () => {
  try {
    let num = 1000;
    let numStr = num.toLocaleString();
    return numStr.slice(1,2);
  }
  catch(e) {
    return ",";
  }
};

const decimalsSeparator = () => {
  try {
    let num = 1.1;
    let numStr = num.toLocaleString();
    return numStr.slice(1, 2);
  }
  catch(e) {
    return ".";
  }
};

const ST_ALPHA_UPPER  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ST_ALPHA_LOWER  = "abcdefghijklmnopqrstuvwxyz";
const ST_ALPHA        = ST_ALPHA_UPPER + ST_ALPHA_LOWER;
const ST_PUNCTUATION  = ".!:;,?-|\\/";
const ST_NUM          = "0123456789";
const ST_NUM_NON_NULL = "123456789";
const ST_HEX          = ST_NUM + "abcdefABCDEF";
const ST_ALPHANUM     = ST_ALPHA + ST_NUM + "_";
const ST_NUMBER       = ST_NUM + ".,+-";
const CURSOR_KEYCODES = new Array (
	8,   // Backspace
	16,  // Shift
	17,  // Ctrl
	18,  // Alt
	19,  // Pause
	27,  // Esc
	33,  // PgUp
	34,  // PgDn,
	35,  // End
	36,  // Home
	37,  // Left
	38,  // Up
	39,  // Right
	40,  // Down
	45,  // Insert
	46,  // Del
	91,  // Windows
	112, // F1
	113, // F2
	114, // F3
	115, // F4
	116, // F5
	117, // F6
	118, // F7
	119, // F8
	120, // F9
	121, // F10
	122, // F11
	123, // F12
	145  // Scroll
);

const strlen = function(obj) {
  if (typeof obj === "string") {
    return obj.length;
  }
  else if (typeof obj === "undefined") {
    return 0;
  }
  else if (obj === null) {
    return 0;
  }
  else {
    return String(obj).length;
  }
};

const strcmp = (str1, str2) => {
	str1 = String(str1); str2 = String(str2);
	//console.log("IN strcmp() str1='" + str1 + "' str2='" + str2 + "'");
	var result = ( ( str1 === str2 ) ? 0 : ( ( str1 > str2 ) ? 1 : -1 ) );
	//console.log(result);
  return result;  
}

const strcasecmp = (str1, str2) => {
  return strcmp(str1.toUpperCase(), str2.toUpperCase());
};

const stricmp = (str1, str2) => { return strcasecmp(str1, str2); }

const strmatch = (st1,st2) => {

	st1=String(st1).trim();
	st2=String(st2).trim();

	if ((st1.length > 0) && (st2.length > 0)) {
		var len = Math.min(st1.length,st2.length);
		var s1  = st1.slice(0,len); s1 = s1.toUpperCase();
		var s2  = st2.slice(0,len); s2 = s2.toUpperCase();
		//console.log("'" + s1 + "','" + s2 + "'");
		return (s1 === s2);
	}
	else {
		return (st1 === st2);
	}
}

const strparse = (st, obj) => {
  var result = st;
  for (var i in obj) {
		var key = "[" + i + "]";
		result = str_replace (key, obj[i], result);
	}
  return result;
};

//Sections to eval in context delimited by ('${', '}')
//Example:
//const st = '...${}...${}...';
//
const streval = (st)=>{
  let result = st;
  let p = result.indexOf("${");
  while (p >= 0) {
    let q = result.indexOf('}', p + 2);
    if (q >= 0) {
      let dum = result.slice(p + 2, q);
      try {
        result = result.slice(0, p) + eval(dum) + result.slice(q + 1);
      }
      catch(e) {
        result = result.slice(0, p) + result.slice(q + 1);
      }
    }
    else {
      let dum = result.slice(p + 2);
      try {
        result = result.slice(0, p) + eval(dum);
      }
      catch(e) {
        result = result.slice(0, p);
      }
    }
    p = result.indexOf('eval(');
  }
  return result;
};

const strchar = (char, len) => {
  var st = "";
  for (var i = 0; i < len; i++) {
    st += char;
  }
  return st;
};

const strpad = (str, char, len, side) => {
    str = String(str);
    if (str.length > len) {
        switch(side.toUpperCase()) {
            case "LEFT": {
                return str.slice(str.length - len);
            }
            case "RIGHT": {
                return str.slice(0, len);
            }
        }    
    }
    else if (str.length < len) {
        var missing = len - str.length;
        var pad = strchar(char, missing);
        switch(side.toUpperCase()) {
            case "LEFT": {
                return "" + pad + str;
            }
            case "RIGHT": {
                return "" + str + pad;
            }
        }    
    }
    else {
        return str;
    }
};


const str_replace = (find, replace, subject) => {
  if (strlen(subject) > 0) {
		subject = String(subject);
		replace = String(replace);
		find    = String(find);
		var escapeRegExp = function(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		}
		return subject.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}
	return "";
};


const str_section = (st, stStart, stEnd) => {
	var p = st.indexOf(stStart) + strlen(stStart);
	var q = st.indexOf(stEnd, p);
	var result = st.slice(p, q);
	return result;
}

const str_section_replace = (st, stStart, stEnd, stReplaceWith) => {
	var result = st;
	var p = st.indexOf(stStart);
	if (p >= 0) {
		var q = st.indexOf(stEnd, p + stStart.length + 1);
		result = st.slice(0, p, q) + stReplaceWith + st.slice(q + stEnd.length);
	}
	return result;
};

const str_section_erase = (st, stStart, stEnd) => {
	var result = str_section_replace(st, stStart, stEnd, "");
	return result;
};


function strip_empty_lines(st)
{
  var stripped = "";
  var arr = breakApart(st,"\n");
  for (var i = 0; i < arr.length; i++) {
    var line = String(arr[i]).trim();
    if (line.length > 0) {
      if (stripped.length > 0) { stripped += "\n"; }
      stripped += line;
    }
  }
  return stripped;
}


function strip_tabs(st, tab_size=4) {
    let tab = "";
    for (let i = 0; i < tab_size; i++) { tab += " "; }
    const dumdum = str_replace("\t", tab, st);
}


function htmlText(st)
{
    //console.info("IN htmlText() st='" + st + "'");
    let tmp = document.createElement("DIV");
    tmp.innerHTML = st;
    return tmp.textContent || tmp.innerText || "";
}

function unescapeQuotes(str) 
{
    return str.replace(/\\"/g, '"').replace(/\\'/g, "'");
}


function decimal(num, dec)
{
	if (typeof dec === "undefined") { dec = 2; }
	if (isNaN(num)) {
		return num;
	}
	var coef = 10 ** dec;
	return Math.round((num + Number.EPSILON) * coef) / coef;
}


function comprehensive_seconds (secs, short)
{
  if (typeof short === "undefined") {
    short = true;
  }

  var result = "";

	var days = Math.floor (secs / (24 * 3600));
	secs = secs - (days * 24 * 3600);
	var hours = Math.floor (secs / 3600);
	secs = secs - (hours * 3600);
	var minutes = Math.floor (secs / 60);
	secs = secs - (minutes * 60);

    var labelDays = "Days", labelHours = "Hours", labelMinutes = "Minutes", labelSeconds = "Seconds";
    if (typeof R !== "undefined") {  
        labelDays    = (days    > 1) ? R.get("days")    : R.get("day")   ;
        labelHours   = (hours   > 1) ? R.get("hours")   : R.get("hour")  ;
        labelMinutes = (minutes > 1) ? R.get("minutes") : R.get("minute");
        labelSeconds = (secs    > 1) ? R.get("seconds") : R.get("second");
    }
    
    if (short) {
        labelDays    = labelDays.slice(0,1).toLowerCase();
        labelHours   = labelHours.slice(0,1).toLowerCase();
        labelMinutes = labelMinutes.slice(0,1).toLowerCase();
        labelSeconds = labelSeconds.slice(0,1).toLowerCase();
    }
    else {
        labelDays    = " " + labelDays;
        labelHours   = " " + labelHours;
        labelMinutes = " " + labelMinutes;
        labelSeconds = " " + labelSeconds;
    }

    if (days > 0) {
        result = "" + days + labelDays + " " + hours + labelHours + " " + minutes + labelMinutes + " " + secs + labelSeconds;
    }
    else if (hours > 0) {
        result = "" + hours + labelHours + " " + minutes + labelMinutes + " " + secs + labelSeconds;
    }
    else if (minutes > 0) {
        result = "" + minutes + labelMinutes + " " + secs + labelSeconds;
    }
    else {
        result = "" + secs + labelSeconds;
    }

    return result;
}

function comprehensive_filesize (bytes)
{
    var result = "";

    bytes = parseInt (String(bytes));

    if (bytes > 1073741824) {   // GB
        var q = Math.floor (bytes / 1073741824);
        var r = bytes - q;
        r = "" + r;
        r = r.slice (0, 1);
        result = q + "." + r + " GB";
    }
    else if (bytes > 1048576) {      // MB
        var q = Math.floor (bytes / 1048576);
        var r = bytes - q;
        r = "" + r;
        r = r.slice (0, 1);
        result = q + "." + r + " MB";
    }
    else if (bytes > 1024) {         // KB
        var q = Math.floor (bytes / 1024);
        var r = bytes - q;
        r = "" + r;
        r = r.slice (0, 1);
        result = q + "." + r + " KB";
    }
    else {
        result = bytes + " B";
    }

    return result;
}


// ****************************************************************************
// ****************************************************************************
//
// XML AND HTML PARSER
//
// ****************************************************************************
// ****************************************************************************

// Parse the variable part of XML/HTML tags formatted as on following example:
//
// let st = 'attr1="..." attr2="..." ...';
//
// The function accepts single and double quotes as variable delimiters.
// The string may use the backslash character "\" as escape char within 
// delimiters.
//
// Return associative array/plain object
//
function parseVariables(st)
{
	st = str_replace("  ", " ", st);
	//console.info("IN parseVariables() st='" + st + "'");

    let del = "'\"", arr = {}, variable = "", value = "", delimiter = "", escaped = false;

    if (strlen(st) > 0) {
	    for (let i = 0; i < st.length; i++) {
	    
		    let c = st.slice (i, i + 1);
		    //console.log(c);

		    if (strlen(delimiter) > 0) {
			    if (c === delimiter) {
				    //console.log("Next delimiter escaped=" + String(escaped));
				    if (escaped) {
					    value += c;
					    escaped = false;
				    }
				    else {
					    variable = String(variable).trim();
					    if (strlen(variable) > 0) {
						    arr[variable] = value;
					    }
					    escaped = false;
					    delimiter = "";
					    variable = "";
					    value = "";
				    }
			    }
			    else if (c === "\\") {
				    //console.log("Escape char identified escaped=true");
				    escaped = true;
			    }
			    else {
                    value += c;
			    }
		    }
		    else {
			    if (c === "=") {
				    // Just ignore this when building variable name
			    }
			    else if (del.indexOf(c) >= 0) {
				    delimiter = c;
			    }
			    else {
				    variable += c;
			    }
		    }

	    }
	}

	//console.log(arr);
	return arr;
}

//Return associative array/plain object
//
function setVariable (st, variable="", value="")
{
	var result = parseVariables(st);
	if (strlen(variable) > 0) {
		result[variable] = value;
	}
	return result;
}

//Return associative array/plain object
//
function deleteVariable (st, variable="")
{
	var result = parseVariables(st);
	if (strlen(variable) > 0) {
		delete result[variable];
	}
	return result;
}

function variablesArrayToString(obj, delimiter="\"", escape=false)
{
    var result = "";
    for (var i in obj) {
        if (strlen(result) > 0) { result += " "; }
        var st = obj[i];
        if (escape) {
            st = str_replace(delimiter, "\\" + "!%", st);
            st = str_replace("!%", delimiter, st);
        }
        result += i + "=" + delimiter + st + delimiter;
    }
    return result;
}

//Should work on XML,HTML
//
//Returns associative array/javascript plain object listing the components of the XML tag:
//
/*
Return value format:

var x = {
	tag : "",        //Full-qualified open tag string
	position : {     //Tag character positions in the xml string (0-indexed)
		p1 : 0,      //Beginning of the opening tag (i.e. of "<tagname " string)
		p2 : 0,      //End of the opening tag (i.e. end of '<tagname attr1="" attr2="" ...>' string)
		p3 : 0,      //Beginning of the closing tag (i.e. of "</tagname>" string)
		p4 : 0       //End of the closing tag (i.e. pos of the end of "</tagname>" string)
	},
	stAttr     : "", //String representing the attributes of tag string (i.e. the 'attr1="" attr2="" ...' extracted string)
	attributes : {}, //Associative array/plain object listing the attributes of the tag
	inline     : "", //Inline content of the tag
	asString   : ""  //Reformated tag from its components
}
*/

function xmlTag(xml, tagname="")
{
    // Default tagname to the 1st tag of the XML buffer
    //
	if (strlen(tagname) === 0) {
		var p = xml.indexOf("<");
		if (p >= 0) {
            var qgt = xml.indexOf(">", p);
			var q = qgt;
		    var qspace = xml.indexOf(" ", p);
		    if (qspace < qgt) { q = qspace; }
            if (q > p) {
				tagname = xml.slice(p + 1, q);
			}
			else {
				return "";
			}
		}
		else {
			return "";
		}
	}

	//console.log("tagname='" + tagname + "'");

	if (strlen(tagname) > 0) {

		var tag = "";

		var p1 = -1;
		var p2 = -1;
		var p3 = -1;
		var p4 = -1;

		var stAttr     = "";
		var attributes = {};
		var inline     = "";
		var asString   = "";

		p1 = xml.indexOf("<" + tagname);
		if (p1 >= 0) {

			p2 = xml.indexOf(">", p1);
			if (p2 >= 0) {

				stAttr = xml.slice(p1 + strlen("<" + tagname), p2);
				stAttr = String(stAttr).trim();
				if (stAttr.length > 0) {
					if (stAttr.slice(stAttr.length - 1) === "/") {
						stAttr = String(stAttr.slice(0, stAttr.length - 1)).trim();
					}
					if (stAttr.length > 0) {
						attributes = parseVariables(stAttr);
					}
				}

				p3 = xml.indexOf("</" + tagname, p1);
				if (p3 > 0) {
					p4 = xml.indexOf(">", p3);
					inline = xml.slice(p2 + 1, p3);
				}
				else {
				    p3 = xml.indexOf("/>", p1);
				    if (p3 > 0) {
    					p4 = xml.indexOf(">", p3);
				    }
				    else {
    				    p3 = xml.indexOf(">", p1);
				        p4 = p3;
                    }
				}

				var dumAttr = variablesArrayToString(attributes, "'");
				tag = "<" + tagname + " " + dumAttr + ">";
				asString = tag + inline + "</" + tagname + ">";

				var result = {
					tag        : tag,
					position   : { p1: p1, p2: p2, p3: p3, p4: p4 },
					stAttr     : stAttr,
					attributes : attributes,
					inline     : inline,
					asString   : asString
				};

				return result;

			}
			else {
				return null;
			}
		}
		else {
			return null;
		}
	}
}




// End of file: strings.js
// ============================================================================

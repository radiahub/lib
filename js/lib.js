// ============================================================================
// Module      : lib.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Library
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================
//alert("lib");
// ****************************************************************************
// ****************************************************************************
//
// FUNCTIONS
//
// ****************************************************************************
// ****************************************************************************

/*
THREAD YIELDING
---------------
delay(milliseconds).then(function(){
...
});
...
await delay(milliseconds);
...
*/
const delay = function(milliseconds = 0)
{
    return new Promise((resolve)=>{
        setTimeout(()=>{ resolve(true); }, milliseconds);
    });
};

//await defer(milliseconds);
//const result = await defer(milliseconds, async ()=>{...});
//
const defer = function(milliseconds = 0, F = null)
{
    return new Promise((resolve)=>{
        setTimeout(
            async ()=>{
                if (typeof F === "function") {
                    try {
                        var result = await F();
                        if (typeof result === "undefined") { result = true; }
                        resolve(result);
                    }
                    catch(err) {
                        //console.error(err);
                        resolve(false);
                    }
                }
                else {
                    resolve(true);
                }
            }, 
            milliseconds
        );
    });
}


var delayEventTimers = {};

const debounce = function(callback, ms, eventID)
{
	if (typeof eventID === "undefined") { eventID = callback.name; }
	if (delayEventTimers[eventID]) {
        clearTimeout (delayEventTimers[eventID]);
	}
	delayEventTimers[eventID] = setTimeout (
	    function() { 
	        if (is_promise(callback)) {
	            (async ()=>{await callback();})();
	        }
	        else {
    	         callback();
	        }
	    }, 
	    ms
	);
}

const is_function = function(F)
{
	return (typeof F === "function");
};

const is_async_function = function(F)
{
	//console.info("IN is_async_function()");
	return (F.constructor.name === "AsyncFunction");
};

const is_promise = function(F)
{
	//console.info("IN is_promise()");
	if (is_async_function(F)) {
		 return true;
	}
	else {
        var str = F.toString();
        str = str_replace("\t", " ", str);
        str = str_replace("  ", " ", str);
        //console.log(str);
        var dum = str.toUpperCase();
        if ((dum.indexOf("OBJECT") >= 0) && (dum.indexOf("PROMISE") >= 0)) {
            return true;
        }
        else {
            var needle = "return new Promise";
            return (str.indexOf(needle) >= 0);
        }
	}
};

const noop = ()=>{
    return new Promise((resolve)=>{
        resolve();
    });
};


// ****************************************************************************
// ****************************************************************************
//
// CONTEXT
//
// ****************************************************************************
// ****************************************************************************

// Resolve an object from its name
//
const object = function(objname)
{
    //console.log(typeof objname);
    if ((typeof objname === "string") && (strlen(objname) > 0)) {
        try {
            return eval(objname);
        }
        catch(e) {
            return null;
        }
    }
    return null;
};

const install_path = function(script_filename)
{
	//console.info("IN install_path() script_filename='" + script_filename + "'");
	let allScripts = document.scripts;
	for (var i = 0; i < allScripts.length; i++) {
		let scriptElement = allScripts[i];
		if (scriptElement.src) {
			var src = scriptElement.src;
			if (src.indexOf(script_filename) > 0) {
				var result = str_replace(script_filename, "", src);
				return result;
			}
		} 
		else {
			return "";
		}
	}
};

const online = function()
{
    return navigator.onLine;
}

const connected = function()
{
    return new Promise((resolve)=>{
        console.info("IN connected()");
        if (navigator.onLine) {
            fetch('/favicon.ico?d='+Date.now())
            .then(response => {
                if (response.ok) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            })
            .catch(error => {
                resolve(false);
            });
        }
        else {
            resolve(false);
        }
    });
};


// ****************************************************************************
// ****************************************************************************
//
// RANDOMIZATION
//
// ****************************************************************************
// ****************************************************************************

const rand = (min, max)=>{
    min = Math.ceil (min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rand_hex_str = (len)=>{
    var text = "";
    var possible = "ABCDEF0123456789";
    for(var i=0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const rand_num_str = (len)=>{
    var firstPossible = "123456789";
    var text = firstPossible.charAt(Math.floor(Math.random() * firstPossible.length));
    var possible = "0123456789";
    for(var i=0; i < len - 1; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const rand_chr_str = (len)=>{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i=0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const unique_id = ()=>{
    // is (in theory) not really unique
    // should return a 16-digits string
    //
    return String(Math.round(new Date().getTime())) + rand_num_str(3);
};


// ****************************************************************************
// ****************************************************************************
//
// ENCODING
//
// ****************************************************************************
// ****************************************************************************

// Only implement if no native implementation is available
if (typeof Array.isArray === 'undefined') {
  Array.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }
};

const is_json = function(jsonTest) {
if ((typeof jsonTest === "string") && (jsonTest.length > 0)) {
    try {
        var o = JSON.parse(jsonTest);
        if (o && typeof o === "object") {
            return true;
        }
    }
    catch (e) {}
    }
    return false;
};

const payload_encode = function (data) {
	return window.btoa(JSON.stringify(data));
};

const payload_decode = function (encoded) {
    var result;
    try {
        result = JSON.parse(window.atob(encoded));
    }
    catch(e){
        result = null;
    }
    return result;
};
				
const is_payload_encoded = function (something) {
	if ((typeof something === "string") && (something.length > 0)) {
		try {
			var o = E.payload_decode(something);
			return E.payload_encode(o) === something;
		}
		catch (e) {}
	}
	return false;
};


// ****************************************************************************
// ****************************************************************************
//
// CONVERSION
//
// ****************************************************************************
// ****************************************************************************

const radians = (degrees) => {
	return degrees * Math.PI / 180;
};

const degrees = (radians) => {
    return radians * (180 / Math.PI);
};

const degreesMinutesSeconds = (decDegrees) => {
    const negative = (decDegrees < 0);
    if (negative) { decDegrees = (-1) * decDegrees; }   // ex: 123.456
    const degrees  = Math.abs(decDegrees);              // ex: 123
    let   dumdum   = decDegrees - degrees;              // 0.456
    const minutes  = Math.abs(dumdum * 60);             // 27 (0.456 * 60 = 27.36)
    dumdum = dumdum - minutes;                          // 0.36
    const seconds  = Math.round((dumdum * 60) * 10)/10; // 21.6 (0.36 * 60 = 21.6)
    var result = { d:degrees, m:minutes, s:seconds };
    if (negative) { result.d = (-1)*result.d; } 
    return result;
};

// degreesMinutesSeconds: { d:.., m:.., s:.. }
//
const decDegrees = (degreesMinutesSeconds) => {
    return degreesMinutesSeconds.d + (degreesMinutesSeconds.m / 60) + (degreesMinutesSeconds.s / 3600);
};


// End of file: lib.js
// ============================================================================

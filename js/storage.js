// ============================================================================
// Module      : storage.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Browser local storage support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Feb-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

var storage = {
		    
		    set : function(variable, value)
		    {
		    		    try {
		    		    		    localStorage.setItem(variable, JSON.stringify(value));
		    		    		    return true;
		    		    }
		    		    catch(exception) {
		    		    		    return false;
		    		    }
		    },
		    
		    get : function(variable)
		    {
		    		    try {
		    		    		    // Should return null if the key does not exist
		    		    		    let dum = localStorage.getItem(variable);
		    		    		    if (dum !== null) {
		    		    		    		    try {
		    		    		    		    		    let dumdum = JSON.parse(dum);
		    		    		    		    		    return dumdum;
		    		    		    		    }
		    		    		    		    catch(e) {
		    		    		    		    		    return dum;
		    		    		    		    }
		    		    		    }
		    		    		    return null;
		    		    }
		    		    catch (e) {
		    		    		    return null;
		    		    }
		    },
		    
		    del : function(variable)
    	{
    			    try {
    			    		    localStorage.removeItem(variable);
    			    		    return true;
    			    }
    			    catch (exception) {
    			    		    return false;
    			    }
    	},
		    
		    dump : function()
		    {
		    		    try  {
		    		    		    var txt = "";
		    		    		    jQuery.each(localStorage, function(key,value){
		    		    		    		    if ((key !=="length") && (! strmatch("function",value))) {
		    		    		    		    		    if (strlen(txt) > 0) { txt += "\n"; }
		    		    		    		    		    txt += key + "\"=>\"" + value + "\"";
		    		    		    		    }
		    		    		    });
		    		    		    return txt;
		    		    }
		    		    catch(exception) {
		    		    		    //console.error("Runtime exception in storage.dump()");
		    		    		    return false;
		    		    }
		    },
    
    clear : function()
    {
    		    try  {
    		    		    var arr = [];
    		    		    jQuery.each(localStorage, function(variable, value){
    		    		    		    arr.push(variable);
    		    		    });
    		    		    if (arr.length > 0) {
    		    		    		    for (var i = 0; i < arr.length; i++) {
    		    		    		    		    storage.del(variable);
    		    		    		    }
    		    		    }
    		    		    return true;
    		    }
    		    catch(exception) {
    		    		    //console.error("Runtime exception in storage.clear()");
    		    		    return false;
    		    }
    }
    
};


// End of file: storage.js
// ============================================================================

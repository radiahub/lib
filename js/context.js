// ============================================================================
// Module      : run24.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Application context resolution
//
// Date+Time of change    By     Description
// ---------------------- ------ ----------------------------------------------
// 01-Feb-24 00:00:00 WIT Denis  Creation of the file for fw24 framework
//
// ============================================================================

var context = {

	is_cordova : function() 
	{
		if ((typeof cordova == "object") || (window.hasOwnProperty("cordova"))) {
			return true;
		}
		return false;
	},

	// function is_radiahub is useful to avoid collision name when binding 
	// radiahub tools into 3rd-party websites
	//
	is_radiahub : function()
	{
		return true;
	},

	apipath : function()
	{
		var result = (context.is_cordova()) ? "./" : "../";
		return result;
	},

	libpath : function()
	{
		var result = (context.is_cordova()) ? "lib/" : "../lib/";
		return result;
	},

	apppath : function() 
	{
		var result = "app/";
		return result;
	},

	appid : function(package_id)
	{
		if (context.is_cordova()) {
			if (typeof package_id === "undefined") {
				package_id = application.package_id;
			}
			var result = package_id.slice(package_id.lastIndexOf(".") + 1);
			return result;
		}
		return null;
	},

	appname : function()
	{
		var result = version.record.appname;
		return result;
	},

	parse : function(st)
	{
		//console.info("IN context.parse() st='" + st + "'");
		st = str_replace("[apipath]", context.apipath(), st);
		st = str_replace("[libpath]", context.libpath(), st);
		st = str_replace("[apppath]", context.apppath(), st);
		st = str_replace("[appid]",   context.appid(),   st);
		st = str_replace("[appname]", context.appname(), st);
		//console.log(st);
		return st;
	}

};


// End of file: context.js
// ============================================================================
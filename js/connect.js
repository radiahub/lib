// ============================================================================
// Module      : connect.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : AJAX connector
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

function connect()
{
	this.headers = null;

	this.header = (key,value) => {

		if (this.headers === null) { this.headers = {}; }
		this.headers[key] = value;
	};

	this.basic_auth = (clientID, secret) => {

		var token = clientID + ":" + secret;
		this.header("Authorization","Basic " + window.btoa(token));
	};


	// **************************************************************************
	// **************************************************************************
	//
	// Synchronous API
	// 
	// **************************************************************************
	// **************************************************************************

	this.rawget = (url) => {

    var result = (function() {

	    var result = null;

			var args = {
		    url      : url,
			  async    : false,
				method   : "GET",
				global   : false,
				datatype : false,
				success  : (data) => { result = data; }
			};

		  jQuery.ajax(args);
			return result;
		})();

		return result;
	};


	// **************************************************************************
	// **************************************************************************
	//
	// Asynchronous API
	// 
	// **************************************************************************
	// **************************************************************************

	this.get = function(url)
	{
		return new Promise(
			(resolve, reject) => {
				application.connect()
				.then (()=>{
					var args = {
						url      : url,
						async    : true,
						method   : "GET",
						global   : false,
						dataType : false
					};
					jQuery.ajax(args)
					.done ((result) => {
						if (is_json(result)) { 
							result = JSON.parse(result); 
						}
						resolve(result);
					})
					.fail (() => { 
						reject(); 
					});
				})
				.catch(()=>{
					reject();
				});
			}
		);
	};

  this.post = function(row, url) 
	{
		return new Promise(
			(resolve, reject) => {
				application.connect()
				.then (()=>{
					var args = {
						url         : url,
						async       : true,
						method      : "POST",
						data        : row,
						dataType    : "text",
						crossDomain : true
					};
					if (this.headers !== null) { 
						args.headers = this.headers; 
					}
					jQuery.ajax(args)
					.done ((result) => {
						if (is_json(result)) { 
							result = JSON.parse(result); 
						}
						resolve(result);
					})
					.fail (() => { 
						reject(); 
					});
				})
				.catch(()=>{
					reject();
				});
			}
		);
	};

	this.submit = function(formID, url)
	{
		return new Promise(
			(resolve, reject) => {
				application.connect()
				.then (()=>{

						var formdata = new FormData();
						var selector = "#" + formID + " input"
												+ "#" + formID + " select"
												+ "#" + formID + " textarea";

						jQuery(selector).each(
							function() {
								switch(jQuery(this).attr("type")) {
									case "file" : {
										var id = jQuery(this).attr("id");
										var input = document.getElementById(id);
										for (var i = 0; i < input.files.length; i++) {
											formdata.append(id+"[]", input.files[i]);
										}
										break;
									}
									default : {
										formdata.append(jQuery(this).attr("id"),jQuery(this).val());
										break;
									}
								}
							}
						);

						var args = {
							url         : url,
							async       : true,
							method      : "POST",
							data        : formdata,
							contentType : false,
							crossDomain : true,
							processData : false
						};

						if (this.headers !== null) { 
							args.headers = this.headers; 
						}

					jQuery.ajax(args)
					.done ((result) => {
						if (is_json(result)) { 
							result = JSON.parse(result); 
						}
						resolve(result);
					})
					.fail (() => { 
						reject(); 
					});
					
				})
				.catch(()=>{
					reject();
				});

			}
		);
	};

};


// ****************************************************************************
// ****************************************************************************
//
// Utils around connect
//
// ****************************************************************************
// ****************************************************************************

function file2bin (filename)
{
	//console.log("IN file2bin() filename='" + filename + "'");
	var C = new connect();
	var buffer = C.rawget(filename);
	return buffer;
}

function fgets (uri, host)
{
	if (strlen(host) === 0) {
		var local_ip = storage.get("mlog_local_ip");
		if (strlen(local_ip) > 0) {
			host = "http://" + local_ip + "/api/";
		}
	}

	if (strlen(host) > 0) {
		host = pathHandle(host);
		//console.log(host);
		//console.log(host.slice(host.length - 5, 5));
		if (host.slice(host.length - 5, 5) !== "/api/") {
			host += "api/";
		}
	}

	//console.info("IN fgets() host='" + host + "' uri='" + uri + "'");
	
	var url = "fgets.php?uri=" + payload_encode(uri);
	if (strlen(host) > 0) {
		url = host + url;
	}

	//console.log(url);
	
	var buffer = new connect().rawget(url);
	return buffer;
}


// End of file: connect.js
// ============================================================================
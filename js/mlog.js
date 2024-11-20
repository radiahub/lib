// ============================================================================
// Module      : mlog.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Application monitoring messages support
// Information : Exposes variable M (mlog) - CORDOVA ONLY
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 10-Feb-23 12:00 WIT   Denis  Deployment V. 2023 "RAYMOND CHANDLER"
// 2-Feb-24 00:00:00 WIT Denis  rename global variable "mlog" to "M"
//
// ============================================================================

var M = {

	// **************************************************************************
	// **************************************************************************
	//
	// Redirection to mlog server
	//
	// **************************************************************************
	// **************************************************************************

	forward : {

		debugServer: "", queue: [], timeout: 2000, timer: null, running: false, 
		
		sendToServer : function(rows)
		{
			return new Promise(
				(resolve, reject)=>{

					if ((strlen(M.forward.debugServer) > 0) && (rows.length > 0)) {

						for (var i = 0; i < rows.length; i++) {
							rows[i]["device_id" ] = device.uuid;
							rows[i]["package_id"] = application.package_id;
						}

						var f = "mlog", a = { rows: payload_encode(rows) }, l = [];

						var url = M.forward.debugServer + "runl.php";
						//console.log(url);
						var row = { 
							function  : f, 
							arguments : window.btoa(JSON.stringify(a)),
							libraries : window.btoa(JSON.stringify(l))
						};

						new connect().post(row, url, true)
						.then ((data) => {
							try {
								if (is_json(data)) { data = JSON.parse(data); }
								//console.log(JSON.stringify(data));
								if ((data !== null) && (parseInt(""+data.errno) === 1000)) {
									resolve();
								}
								else {
									//var msg = (data === null) ? "runl request returned null" : "error "+String(data.errno) + ": " + String(data.errstr);
									//console.error(msg);
									reject();
								}
							}
							catch(e) {
								//console.error("Runtime exception");
								reject();
							}
						})
						.catch(() => { 
							//console.error("Rejected by new connect().get(url)");
							reject(); 
						});

					}
					else {
						resolve();
					}

				}
			);
		},

		push : function(scope, st, file_info)
		{
			if (context.is_cordova()) {
				//console.log("IN M.forward.push()");
				if (typeof file_info === "undefined") { file_info = ""; }
				file_info = String(file_info);
				var queuedMessage = { scope: scope, message: st, fileinfo: file_info };
				//console.log(JSON.stringify(queuedMessage));
				M.forward.queue.push(queuedMessage);
			}
		},

		run : function()
		{
			if (context.is_cordova()) {

				//console.info("IN M.forward.run()");
				//console.log (JSON.stringify(M.forward.queue));

				var go_on = function() {
					if (M.forward.running) {
						M.forward.timer = setTimeout(M.forward.run, M.forward.timeout);
					}
				};

				if (M.forward.queue.length > 0) {
					M.forward.sendToServer(M.forward.queue)
					.then (()=>{ 
						M.forward.queue = [];
						delay (100).then(()=>{ go_on(); });
					})
					.catch(()=>{ 
						//console.error("Rejected by M.forward.sendToServer()");
						M.forward.queue = [];
						delay (100).then(()=>{ go_on(); });
					});
				}
				else {
					go_on();
				}

			}
		},

		start : function()
		{
			if (context.is_cordova() && (! M.forward.running)) {
				//console.log("IN M.forward.start()");
				M.forward.running = true;
				M.forward.run();
			}
		},

		stop  : function()
		{
			if ((context.is_cordova()) && (M.forward.running)) {
				//console.log("IN M.forward.stop()");
				clearTimeout(M.forward.timer);
				M.forward.timer = null;
				M.forward.running = false;
			}
		},

		flush : function()
		{
			return new Promise(
				(resolve, reject)=>{
					if (context.is_cordova()) {
						//echo("IN M.forward.flush()");
						clearTimeout(M.forward.timer);
						M.forward.timer = null;
						M.forward.run();
						resolve();
					}
				}
			);
		}

	},


	// **************************************************************************
	// **************************************************************************
	//
	// runtime API
	//
	// **************************************************************************
	// **************************************************************************

	write : function(scope, st, fileinfo)
	{
		//console.info("IN M.write() scope='"+scope+"' st='"+st+"'");
		//console.log(fileinfo);
		//
		if (M.forward.running) {

			if (typeof fileinfo === "undefined") {

				var stk = StackTrace.getSync();
				/*
				alert(stk);
				alert("0:" + String(stk[0]));
				alert("1:" + String(stk[1]));
				alert("2:" + String(stk[2]));
				alert("3:" + String(stk[3]));
				alert("4:" + String(stk[4]));
				alert("5:" + String(stk[5]));
				*/
				//console.log(JSON.stringify(stk));
				fileinfo = String(stk[5]);

				var p = fileinfo.indexOf("file:///");
				if (p >= 0) { fileinfo = fileinfo.slice(p+8); }
				fileinfo = str_replace("android_asset/www/", "", fileinfo);
				fileinfo = str_replace("(", "", fileinfo);
				fileinfo = str_replace(")", "", fileinfo);
				//console.log(fileinfo);

			}

			M.forward.push(scope, st, fileinfo);

		}
	},


	// **************************************************************************
	// **************************************************************************
	//
	// command API
	//
	// **************************************************************************
	// **************************************************************************

	log : function(st)
	{
		M.write("log", st);
	},

	info : function(st)
	{
		M.write("info", st);
	},

	warn : function(st)
	{
		M.write("warn", st);
	},

	warning : function(st)
	{
		M.write("warn", st);
	},

	err : function(st)
	{
		M.write("error", st);
	},

	error : function(st)
	{
		M.write("error", st);
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Initialization
	//
	// **************************************************************************
	// **************************************************************************

	disableConsole : function()
	{
		//console.info("IN M.disableConsole()");
		if (typeof emulator === "undefined") {
			window.console.log   = function() {};
			window.console.info  = function() {};
			window.console.warn  = function() {};
			window.console.error = function() {};
		}
	},

	redirectConsole : function()
	{
		//console.info("IN M.redirectConsole()");
		var _console = console || {}; 
		_console.log   = function(st) { M.log(st);   };
		_console.info  = function(st) { M.info(st);  };
		_console.warn  = function(st) { M.warn(st);  };
		_console.error = function(st) { M.error(st); };
		console = _console;
		window.console = _console;
	},


	//ssdk should ALWAYS point to https://radiahub.eu5.org/api/
	//
	regToMlogServer : function()
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN M.regToMlogServer");
				var local_ip = storage.get("mlog_local_ip");
				if (strlen(local_ip) > 0) {
					var url = "http://" + local_ip + "/api/";
					M.forward.debugServer = url;
					console.log();
					resolve();
				}
				else {
					console.error("Resolve mlog local IP returned null or empty");
					reject();
				}
			}
		);
	},

	init : function()
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN M.init()");
				M.regToMlogServer()
				.then (() => {
					//console.log("Resolved by M.regToMlogServer()");
					M.redirectConsole();
					M.forward.start();
					resolve();
				})
				.catch(()=>{
					console.error("Rejected by M.regToMlogServer()");
					//M.disableConsole();
					reject(); //This one is blocking
				});
			}
		);
	}

};




// End of file: mlog.js
// ============================================================================
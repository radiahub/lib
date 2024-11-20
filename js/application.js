// ============================================================================
// Module      : application.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Application support (lite version)
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

if (typeof device === "undefined") {
	device = null;
}

var application = {

	// **************************************************************************
	// **************************************************************************
	//
	// Read config.xml
	//
	// **************************************************************************
	// **************************************************************************

	// One preference key
	//
	preference : function(name)
	{
		return new Promise(
			(resolve, reject)=>{
				//console.log("IN application.preference() name='" + name + "'");
				if (context.is_cordova() && (typeof CustomConfigParameters !== "undefined")) {
					var paramkeyArray = [];
					paramkeyArray.push(name);
					try {
						CustomConfigParameters.get(
							(configData)=>{
								resolve(configData[name]);
							},
							()=>{
								reject();
							},
							paramkeyArray
						);
					}
					catch(e) {
						reject();
					}
				}
				else {
					reject();
				}
			}
		);
	},

	// A list of preference keys
	//
	preferences : function(namelist)
	{
		return new Promise(
			(resolve, reject)=>{
				if (context.is_cordova()) {
					var paramkeyArray = arrayOf(namelist);
					try {
						CustomConfigParameters.get(
							(configData)=>{
								resolve(configData);
							},
							()=>{
								reject();
							},
							paramkeyArray
						);
					}
					catch(e) {
						reject();
					}
				}
				else {
					reject();
				}
			}
		);
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Application files
	//
	// **************************************************************************
	// **************************************************************************

	load : function(filepath)
	{
		return new Promise(
			(resolve, reject)=>{
				filepath = context.parse(filepath);
				//console.info("IN application.load() filepath='" + filepath + "'");
				if (Array.isArray(filepath)) {
					try {
						var arr = filepath;
						if (arr.length > 0) {
							var current = 0;
							var iterate = function() {
								var go_on = function() {
									current++;
									if (current >= arr.length) {
										resolve();
									}
									else {
										iterate();
									}
								};
								var somefile = arr[current];
								application.load(somefile)
								.then (()=>{
									//console.log("Resolved by application.load() somefile='" + somefile + "'");
									go_on();
								})
								.catch(()=>{
									//console.warn("Rejected by application.load() somefile='" + somefile + "'");
									go_on();
								});
							};
							iterate();
						}
						else {
							resolve();
						}
					}
					catch(e) {
						//console.error("Runtime exception");
						//console.error(String(e));
					}
				}
				else if (filepath.indexOf(",") >= 0) {
					var arr = breakApart(filepath, ",");
					application.load(arr)
					.then (()=>{
						resolve();
					})
					.catch(()=>{
						//console.error("Rejected by application.load()");
						reject();
					});
				}
				else if (filepath.slice(filepath.length - 5) === ".html") {
					var buffer = file2bin(filepath);
					//console.log(strlen(buffer));
					buffer = context.parse(buffer);
					//console.log(buffer);
					resolve(buffer);
				}
				else if (filepath.slice(filepath.length - 12) === "strings.json") {
					//console.log("Globalization: " + filepath);
					R.reg(filepath);
					resolve();
				}
				else if (filepath.slice(filepath.length - 5) === ".json") {
					try {
						//console.info("IN parsing file *.json");

						var json = file2bin(filepath);
						if (is_json(json)) { json = JSON.parse(json); }
						//console.log(JSON.stringify(json));
						if (json.hasOwnProperty("files")) {
							//console.log("Reading [files]");
							var current = 0;
							var iterate = function() {
								var go_on = function() {
									current++;
									if (current > json["files"].length - 1) {
										//console.log("Ready to resolve()");
										resolve();
									}
									else {
										//console.log("Loop once more");
										iterate();
									}
								};
								var filepath = json["files"][current];
								//console.log(filepath);
								var filepath = context.parse(json["files"][current]);
								//console.log(filepath);
								application.load(filepath)
								.then (()=>{
									//console.log("Resolved by application.load() filepath='" + filepath + "'");
									go_on();
								})
								.catch(()=>{
									//console.warn("Rejected by application.load() filepath='" + filepath + "'");
									go_on();
								});
							};
							iterate();
						}

					}
					catch(e) {
						//console.error("Runtime exception");
						//console.error(String(e));
						reject();
					}
				}
				else if (filepath.slice(filepath.length - 4) === ".css") {
					var html = '<link rel="stylesheet" type="text/css" href="' + filepath + '">';
					jQuery("head").append(html);
					setTimeout(
						function() {
							resolve();
						},
						400
					);
				}
				else if (filepath.slice(filepath.length - 4) === ".sql") {
					if (context.is_cordova() && (typeof dbase !== "undefined")) {
						let queries = file2queries(filepath);
						//console.log(JSON.stringify(queries));
						dbase.batch(queries, false)
						.then((logtxt)=>{
							//console.log(logtxt);
							resolve();
						})
						.catch(()=>{ 
							//console.error("Rejected by dbase.batch()");
							reject(); 
						});
					}
					else {
						resolve();
					}
				}
				else if (filepath.slice(filepath.length - 3) === ".js") {
					jQuery.getScript(filepath)
					.done(function(){
						resolve();
					})
					.fail(function(){
						//console.error("Rejected by jQuery.getScript() filepath='" + filepath + "'");
						reject();
					});
				}
				else {
					var buffer = file2bin(filepath);
					resolve(buffer);
				}
			}
		);
	},


	// windowObjectNames: if filepath describes a .js file,  array containing
	//                    the list of objects to delete at unload()
	//                    windowObjectNames has no effect on other file types
	//
	unload : function(filepath, windowObjectNames)
	{
		return new Promise(
			(resolve, reject)=>{
				if (typeof windowObjectNames === "undefined") { windowObjectNames = []; }
				if ((filepath.slice(filepath.length - 12) === "strings.json") && (typeof R !== "undefined")) {
					try {

						if (typeof globalizedAssets !== "undefined") {
							for (var i = 0; i < globalizedAssets.length; i++) {
								if (strcmp(globalizedAssets[i], filepath) === 0) {
									globalizedAssets.splice(i, 1);
									break;
								}
							}
						}

						var content = file2bin(fileURL);
						if (is_json(content)) { content = JSON.parse(content); }
						if (content !== null) {
							for (var i = 0; i < content.length; i++) {
								var idx = R.indexOf(content[i]["id"]);
								if (idx >= 0) {
									R.collection.splice(idx, 1);
								}
							}
						}

					}
					catch(e) {}
				}
				else if (filepath.slice(filepath.length - 4) === ".css") {
					jQuery("link[href='"+filepath+"']").prop("disabled", true);
					jQuery("link[href='"+filepath+"']").remove();
					delay(400, resolve);
				}
				else if (filepath.slice(filepath.length - 3) === ".js") {
					try {
						if (windowObjectNames.length > 0) {
							for (var i = 0; i < windowObjectNames.length; i++) {
								var name = windowObjectNames[i];
								if (typeof window[name] !== "undefined") {
									delete(window[name]);
								}
							}
						}
						jQuery('script[src$="' + filepath + '"]').remove();
						delay(100,resolve);
					}
					catch(e) {
						//console.error("Runtime exception");
						//console.error(String(e));
						reject();
					}
				}
				else {
					resolve();
				}
			}
		);
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Temporary files
	//
	// **************************************************************************
	// **************************************************************************

	tmpfiles : {

		initialized: false,

		init: function(execDrop)
		{
			return new Promise(
				(resolve, reject)=>{
					if (context.is_cordova()) {
						if (typeof execDrop === "undefined") { execDrop = false; }
						//console.info("IN application.tmpfiles.init() execDrop=" + String(execDrop));
						if ((application.tmpfiles.initialized) && (!execDrop)) {
							//console.warn("application.tmpfiles already initialized");
							resolve();
						}
						else {
							//console.log("Building tmpfiles database table");
							var filename = context.libpath() + "sqlite/tmpfiles.sql";
							//console.log(filename);
							var queries = file2queries(filename, "ssdk");
							//console.log(queries);
							dbase.batch(queries, execDrop)
							.then((logtxt)=>{
								//console.log(logtxt);
								application.tmpfiles.initialized = true;
								resolve();
							})
							.catch(()=>{ 
								//console.error("Rejected by dbase.batch()");
								reject();
							});
						}
					}
					else {
						resolve();
					}
				}
			);
		},

		reg: function(localFileURI)
		{
			return new Promise(
				(resolve, reject)=>{

					if (context.is_cordova()) {

					//console.info("IN application.tmpfiles.reg() localFileURI='" + localFileURI + "'");
					
						var do_the_job = function() {

							//console.info("IN application.tmpfiles.reg()->do_the_job()");
							var fileKEY = window.btoa(localFileURI);
							var fname = localFileURI.slice(localFileURI.lastIndexOf("/") + 1);

							var do_the_insert = function() {
								//console.info("IN application.tmpfiles.reg()->do_the_job()->do_the_insert()");
								var dummy = { 
									updated : datetime.sql(), 
									fileURI : fileKEY,
									fname   : fname
								};
								//console.log(JSON.stringify(dummy));
								dbase.insert("tmpfiles", dummy)
								.then (()=>{
									resolve();
								})
								.catch(()=>{
									//console.error("Rejected by dbase.insert(tmpfiles)");
									reject();
								});
							};

							dbase.locate("tmpfiles", { fileURI: fileKEY })
							.then ((row)=>{
								if (row !== null) {
									resolve();
								}
								else {
									do_the_insert();
								}
							})
							.catch(()=>{
								do_the_insert();
							});
						};

						application.tmpfiles.init(false)
						.then (()=>{
							//console.log("Resolved by application.tmpfiles.init()");
							do_the_job();
						})
						.catch(()=>{
							//console.error("Rejected by application.tmpfiles.init()");
							reject();
						});

					}
					else {
						resolve();
					}

				}
			);
		},

		clean: function()
		{
			return new Promise(
				(resolve, reject)=>{

					if (context.is_cordova()) {

						//console.info("IN application.tmpfiles.clean()");

						var do_the_job = function() {

							//console.info("IN application.tmpfiles.clean()->do_the_job()");

							var F = new filesystem();

							var clean_tmpfiles_table = function() {
								//console.info("IN application.tmpfiles.clean()->do_the_job()->clean_tmpfiles_table()");
								var q = "DELETE FROM tmpfiles";
								//console.log(q);
								dbase.query(q)
								.then (()=>{
									//console.log("Resolved by dbase.query()");
									resolve();
								})
								.catch(()=>{
									//console.error("Rejected by dbase.query(), force tmpfiles database reset");
									application.tmpfiles.init(true)
									.then (()=>{
										resolve();
									})
									.catch(()=>{
										//console.error("Rejected by application.tmpfiles.init(true)");
										reject();
									});
								});
							};

							var q = "SELECT * FROM tmpfiles";
							//console.log(q);
							dbase.rows(q)
							.then ((rows)=>{
								if (rows.length > 0) {

									var current = 0;

									var iterate = function() {
										var go_on = function() {
											current++;
											if (current >= rows.length) {
												clean_tmpfiles_table();
											}
											else {
												iterate();
											}
										};

										try {
											var filepath = window.atob(rows[current]["fileURI"]);
											//console.log(filepath);
											F.fileRemove(filepath)
											.then (()=>{
												//console.log("Resolved by F.fileRemove() filepath='" + filepath + "'");
												go_on();
											})
											.catch(()=>{
												//console.warn("Rejected by F.fileRemove() filepath='" + filepath + "'");
												go_on();
											});
										}
										catch(e) {
											//console.warn("Runtime exception in application.tmpfiles.clean()->do_the_job()");
											//console.warn(String(e));
											go_on();
										}

									};

									iterate();
								}
								else {
									//console.log("Nothing to do");
									resolve();
								}
							})
							.catch(()=>{
								//console.error("Rejected by dbase.rows()");
								reject();
							});
						};

						application.tmpfiles.init(false)
						.then (()=>{
							//console.log("Resolved by application.tmpfiles.init()");
							do_the_job();
						})
						.catch(()=>{
							//console.error("Rejected by application.tmpfiles.init()");
							reject();
						});

					}
					else {
						resolve();
					}

				}
			);
		},

		dump : function()
		{
			return new Promise(
				(resolve, reject)=>{

					if (context.is_cordova()) {

						var do_the_job = function() {
							//console.info("IN application.tmpfiles.dump()->do_the_job()");
							var result = [];
							var q = "SELECT * FROM tmpfiles";
							dbase.rows(q)
							.then ((rows)=>{
								for(var i = 0; i < rows.length; i++) {
									var row = clone(rows[i]);
									row["fileURI"] = window.atob(row["fileURI"]);
									result.push(row);
								}
								resolve(result);
							})
							.catch(()=>{
								//console.error("Rejected by dbase.rows()");
								reject();
							});
						};

						application.tmpfiles.init(false)
						.then (()=>{
							//console.log("Resolved by application.tmpfiles.init()");
							do_the_job();
						})
						.catch(()=>{
							//console.error("Rejected by application.tmpfiles.init()");
							reject();
						});

					}
					else {
						resolve([]);
					}

				}
			);
		}

	},


	// **************************************************************************
	// **************************************************************************
	//
	// Runtime exit
	//
	// **************************************************************************
	// **************************************************************************

	mobileExitRequested : false,

	close_local_database_and_exit : function()
	{
		var exit_application = function() {
			setTimeout(navigator.app.exitApp, 100);
		};
		if (typeof dbase !== "undefined") {
			dbase.close()
			.then (()=>{ exit_application(); } )
			.catch(()=>{ exit_application(); } );
		}
		else {
			exit_application();
		}
	},

	mobileExit : function ()
  {
		application.mobileExitRequested = true;

		var terminate = function() {
			if (context.is_cordova()) {

				if (typeof M !== "undefined") {
					M.forward.flush()
					.then (()=>{
						application.close_local_database_and_exit();
					})
					.catch(()=>{
						application.close_local_database_and_exit();
					});
				}
				else {
					application.close_local_database_and_exit();
				}

			}
			else {
				//window.document.location = "about:blank";
				history.back();
				history.back(); // Yes, needs 2x calls to history.back()
			}
		};
		
		if (typeof echo !== "undefined") {
			if (! echo.showing()) {
				terminate();
			}
		}
		else {
			terminate();
		}
  },


	// **************************************************************************
	// **************************************************************************
	//
	// Backbutton navigation
	//
	// **************************************************************************
	// **************************************************************************

	back_button_callback : null,
	back_button_callback_enabled : true,

	reg_back_button_callback : function(f)
	{
		application.back_button_callback = f;
	},

	unreg_back_button_callback : function()
	{
		application.back_button_callback = null;
	},

	disable_back_button_callback : function()
	{
		application.back_button_callback_enabled = false;
	},

	enable_back_button_callback : function()
	{
		application.back_button_callback_enabled = true;
	},

	onbackbutton : function()
	{
		//console.info("IN application.onbackbutton()");

		//console.log(typeof pages);
		//console.log(typeof pages.onbackbutton);
		//console.log(application.back_button_callback_enabled);
		//console.log(typeof application.back_button_callback);
		//console.log(application.back_button_callback);

		if (application.back_button_callback_enabled === false) {
			return false;
		}

		try {
			if (echo.showing()) {
				echo.hide();
			}
			else if (typeof application.back_button_callback === "function") {
				application.back_button_callback();
			}
			else if ((typeof pages !== "undefined") && (typeof pages.onbackbutton === "function")) {
				//console.log("Calling pages.onbackbutton()");
				pages.onbackbutton();
			}
			else {
				application.mobileExit();
			}
		}
		catch(e) {
			//console.error("Runtime exception in application.onbackbutton()");
			//console.error(String(e));
			application.mobileExit();
		}
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Internet connection
	//
	// **************************************************************************
	// **************************************************************************

	/*
	Returns one of following constants:
	
	Connection.UNKNOWN, Connection.ETHERNET, Connection.WIFI, Connection.CELL_2G,
	Connection.CELL_3G, Connection.CELL_4G,  Connection.CELL, Connection.NONE

	or null on error
	*/
	connection: function()
	{
		//console.info("IN application.connection()");
		if (context.is_cordova()) {
			if ((typeof navigator.connection !== "undefined") && (typeof Connection !== "undefined")) {
				try {
					return navigator.connection.type;
				}
				catch(e) {
					return null;
				}
			}
		}
		return null;
	},

	connected : function()
	{
		//console.info("IN application.connection.connected()");
		if (context.is_cordova()) {
			var dummy = application.connection();
			if ((dummy !== null) && (dummy !== Connection.NONE)) {
				return true;
			}
		}
		else {
			return true;
		}
		return false;
	},

	connect : function()
	{
		return new Promise(
			(resolve, reject)=>{
				if (context.is_cordova()) {
					var maxcount = 3;
					var count = 0;
					var iterate = function() {
						var go_on = function() {
							count++;
							if (count <= maxcount) {
								confirm(
									R.get("no_data_connection_text"), 
									R.get("no_data_connection_title"), 
									R.get("retry" ), 
									R.get("cancel"), 
									function() { iterate(); }, 
									function() { reject();  }
								);
							}
							else {
								reject();
							}
						};
						if (application.connected()) {
							resolve();
						}
						else {
							go_on();
						}
					};
					iterate();
				}
				else {
					resolve();
				}
			}
		);
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Access points
	//
	// **************************************************************************
	// **************************************************************************

	accesspoint : {

		// ap_by_url : URL used to call the application formatted as:
		//
		// https://sites.google.com/view/radiahub?ap=[appid]&dt=[dataType]&d=[data]
		//
		// <------------physical URL------------>|<---app-->|<--dataType->|<-payload->
		//                 |                           |            |          +--> Message data
		//                 |                           |            +--> dataType
		//                 |                           +--> Application ID
		//                 +--> As registered in AndroidManifest.xml
		//
		// ap_by_message : FCM message object structure
		//
		// message = { dataType:dataType, data:plainDataObject };
		//
		ap_on_fresh_start : false, ap_by_message : null, ap_by_url : "",

		set : {

			on_fresh_start : function(trueOrFalse)
			{
				application.accesspoint.ap_on_fresh_start = trueOrFalse;
			},

			by_url : function(url)
			{
				//console.info("IN application.accesspoint.set.by_url()");
				//console.log(url);
				if (strlen(url) > 0) {
					application.accesspoint.ap_by_url = url;
				}
			},

			by_message : function(message)
			{
				//console.info("IN application.accesspoint.set.by_message()");
				//console.log(JSON.stringify(message));
				if (message !== null) {
					application.accesspoint.ap_by_message = message;
				}
			}
		},

		reset : function() 
		{
			application.accesspoint.ap_on_fresh_start = false;
			application.accesspoint.ap_by_url = "";
			application.accesspoint.ap_by_message = null;
		},

		open : function() 
		{
			//console.info("IN application.accesspoint.open()");
			return new Promise(
				(resolve, reject)=>{

					if (strlen(application.accesspoint.ap_by_url) > 0) {
						//console.log("Open by URL url='"+application.accesspoint.ap_by_url+"'");
						if (typeof webintents !== "undefined") {
							webintents.open(application.accesspoint.ap_by_url)
							.then (()=>{ 
								application.accesspoint.reset();
								resolve(); 
							})
							.catch(()=>{ 
								application.accesspoint.reset();
								reject(); 
							});
						}
						else {
							reject();
						}
					}
					else if (application.accesspoint.ap_by_message !== null) {
						/*
						//console.log("Open by message");
						//console.log(JSON.stringify(application.accesspoint.ap_by_message));
						*/
						if (typeof ipc !== "undefined") {
							ipc.open_accesspoint()
							.then (()=>{ 
								application.accesspoint.reset();
								resolve(); 
							})
							.catch(()=>{ 
								//console.warn("Rejected by ipc.open_accesspoint()");
								application.accesspoint.reset();
								reject(); 
							});
						}
						else {
							reject();
						}
					}
					else {
						application.accesspoint.reset();
						reject();
					}

				}
			);
		}

	},


	// **************************************************************************
	// **************************************************************************
	//
	// Virtual keyboard
	//
	// **************************************************************************
	// **************************************************************************

	keyboard_will_show_callback : null,
	keyboard_did_show_callback  : null,
	keyboard_will_hide_callback : null,
	keyboard_did_hide_callback  : null,

	keyboardHeight : 0,

	keyboard_will_show : function(event)
	{
		//console.info("IN application.keyboard_will_show()");
		//console.log(JSON.stringify(event));
		//console.log(event.keyboardHeight);
		application.keyboardHeight = event.keyboardHeight;
		//console.log(application.keyboardHeight);
		if (typeof application.keyboard_will_show_callback === "function") {
			setTimeout(
				function() { 
					application.keyboard_will_show_callback(event);
				},
				100
			);
		}
	},

	keyboard_did_show : function(event)
	{
		//console.info("IN application.keyboard_did_show()");
		//console.log(JSON.stringify(event));
		//console.log(event.keyboardHeight);
		application.keyboardHeight = event.keyboardHeight;
		//console.log(application.keyboardHeight);
		if (typeof application.keyboard_did_show_callback === "function") {
			setTimeout(
				function() { 
					application.keyboard_did_show_callback(event);
				},
				100
			);
		}
	},

	keyboard_will_hide : function()
	{
		//console.info("IN application.keyboard_will_hide()");
		if (typeof application.keyboard_will_hide_callback === "function") {
			setTimeout(
				function() { 
					application.keyboard_will_hide_callback();
				},
				100
			);
		}
	},

	keyboard_did_hide : function()
	{
		//console.info("IN application.keyboard_did_hide()");
		if (typeof application.keyboard_did_hide_callback === "function") {
			setTimeout(
				function() { 
					application.keyboard_did_hide_callback();
				},
				100
			);
		}
	},

	// eventName: one of "keyboardWillShow", "keyboardDidShow",
	//                   "keyboardWillHide", "keyboardDidHide"
	//
	// F : function(event) {...}
	//
	reg_keyboard_event : function(eventName, F)
	{
		if (typeof F === "function") {
			switch (eventName) {
				case "keyboardWillShow": {
					application.keyboard_will_show_callback = F;
					break;
				}
				case "keyboardDidShow": {
					application.keyboard_did_show_callback = F;
					break;
				}
				case "keyboardWillHide": {
					application.keyboard_will_hide_callback = F;
					break;
				}
				case "keyboardDidHide": {
					application.keyboard_did_hide_callback = F;
					break;
				}
			}
		}
		else {
			application.unreg_keyboard_event(eventName);
		}
	},

	unreg_keyboard_event : function(eventName)
	{
		switch (eventName) {
			case "keyboardWillShow": {
				application.keyboard_will_show_callback = null;
				break;
			}
			case "keyboardDidShow": {
				application.keyboard_did_show_callback = null;
				break;
			}
			case "keyboardWillHide": {
				application.keyboard_will_hide_callback = null;
				break;
			}
			case "keyboardDidHide": {
				application.keyboard_did_hide_callback = null;
				break;
			}
		}
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Media player
	//
	// **************************************************************************
	// **************************************************************************

	media : function (url)
	{
		if (context.is_cordova()) {
			//console.info("IN application.media() is_cordova=true url='" + url + "'");
			try {
				var audio = new Media(url, noop, noop);
				audio.play();
			}
			catch(err) {
				//console.error("Failed to play audio URL='" + url + "': " + err);
			}
		}
		else {
			//console.info("IN application.media() is_cordova=false url='" + url + "'");
  		try {
				var audio = new Audio(url);
       	audio.play();
     	}
			catch (err) {
      	//console.error("Failed to play audio URL='" + url + "': " + err);
    	}
		}
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Initialization
	//
	// **************************************************************************
	// **************************************************************************

	initDevice : function()
	{
		return new Promise(
			(resolve, reject)=>{

				if (context.is_cordova()) {
					//console.info("IN application.initDevice() context.is_cordova()=true");

					document.addEventListener(
						"backbutton", 
						function (e) {
							e.stopPropagation();
							e.preventDefault();
							application.onbackbutton();
						}, 
						true
					);

					document.addEventListener("offline", application.onoffline_);
					document.addEventListener("online",  application.ononline_ );
					document.addEventListener("pause",   application.onpause_  );
					document.addEventListener("resume",  application.onresume_ );

					window.addEventListener('keyboardWillShow', application.keyboard_will_show);
					window.addEventListener('keyboardDidShow',  application.keyboard_did_show );
					window.addEventListener('keyboardWillHide', application.keyboard_will_hide);
					window.addEventListener('keyboardDidHide',  application.keyboard_did_hide );

					R.reg(context.libpath() + "html/strings.json"); // Minimal set of string translations to support
					                           											// launch time error messages and warnings
					window.CacheClear(
						function() {
							//console.log("Resolved by window.CacheClear()");
							application.preference("package_id")
							.then ((package_id)=>{
								application.package_id = package_id;
								theme.init();
								dbase.open()
								.then (()=>{
									application.tmpfiles.clean()
									.then (()=>{
										resolve();
									})
									.catch(()=>{
										//console.warn("Rejected by application.tmpfiles.clean()");
										resolve();
									});
								})
								.catch(()=>{
									//console.error("Rejected by dbase.open()");
									reject();
								});
							})
							.catch(()=>{
								//console.error("Rejected by application.preference()");
								reject();
							});
						},
						function() {
							//console.error("Rejected by window.CacheClear()");
							reject();
						}
					);

				}
				else {
					//console.log("IN application.initDevice()");

					history.pushState(null, document.title, location.href);
					window.addEventListener('popstate', application.on_history_popstate);

					var dumdum = window.location.pathname;
					dumdum = dumdum.slice(1); // Removes the leading "/"
					var p = dumdum.lastIndexOf("/");
					if (p > 0) {
						var st = dumdum.slice(p+1);
						//console.log(st);
						if (str_match(st, "index")) {
							dumdum = dumdum.slice(0, p+1);
						}
					}
					//console.log(dumdum);
					application.package_id = dumdum;

					if (typeof device === "undefined") {

						//console.log("Create device");
						var myUUID = storage.get("myUUID");
						if (strlen(myUUID) === 0) {
							//myUUID = String(rand_hex_str(16)).toLowerCase();
							myUUID = generateUUID();
							storage.set("myUUID", myUUID);
						}

						var device = {
							cordova      : false,
							model        : "",
							platform     : "browser",
							uuid         : myUUID,
							version      : "1.0.0",
							manufacturer : "",
							isVirtual    : false,
							serial       : myUUID,
							sdkVersion   : "1.0.0"
						};

						//console.log(JSON.stringify(device));
						window.device = device;
					}

					resolve();
				}

			}
		);

	},

	onrun : function(callback)
	{
		application.initDevice()
		.then (()=>{
			console.log("Resolved by application.initDevice()");
			callback()
			.then (()=>{ 
				console.log("Application runs normally");
			})
			.catch(()=>{
				console.error("Rejected by callback()");
				application.mobileExit();
			});
		})
		.catch(()=>{
			console.error("Rejected by application.initDevice()");
			application.mobileExit();
		});
	},

	run : function(callback)
	{
		if (context.is_cordova()) {
			document.addEventListener(
				'deviceready', 
				function() {
					if (typeof echo !== "undefined") {
						echo.init();
					}
					//wait.show();
					application.onrun(callback);
				},
				false
			);
		}
		else {
			application.onrun(callback);
		}
	}


};


// End of file: application.js
// ============================================================================
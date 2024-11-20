// ============================================================================
// Module      : theme.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Mobile device theme support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================
var theme = {

	initialized : false,


	// **************************************************************************
	// **************************************************************************
	//
	// STATUS BAR
	//
	// **************************************************************************
	// **************************************************************************

	statusbar : {

		currentSelector : "", currentColor : "",

		fromHexColor : function(bg_color) 
		{
			return new Promise(
				(resolve, reject)=>{
					//console.info("IN theme.statusbar.fromHexColor() bg_color='" + bg_color + "'");
					if ((! context.is_cordova()) || (typeof StatusBar === "undefined")) {
						//console.warn("Not a cordova application or typeof StatusBar = 'undefined'");
						resolve();
					}
					else {
						bg_color = hex2color(bg_color);
						var foreground = contrast(bg_color);
						//console.log("foreground='" + foreground + "'");
						try {
							theme.statusbar.currentColor = bg_color;
							//console.log(theme.statusbar.currentColor);
							StatusBar.backgroundColorByHexString(bg_color);
							if (strcasecmp(foreground, "light") === 0) {
								StatusBar.styleLightContent();
							}
							else {
								StatusBar.styleDefault();
							}
							resolve();
						}
						catch(e) {
							//console.error("Runtime error in statusbar.fromHexColor()");
							reject();
						}
					}
				}
			);
		},

		fromConfigXML : function()
		{
			return new Promise(
				(resolve, reject)=>{
					//console.info("IN theme.statusbar.fromConfigXML()");
					if (context.is_cordova()) {
						application.preference("StatusBarBackgroundColor")
						.then ((bg_color)=>{
							//console.log(bg_color);
							if (strlen(bg_color) > 0) {
								theme.statusbar.fromHexColor(bg_color)
								.then (()=>{
									//console.log("Resolved by theme.statusbar.fromHexColor()");
									resolve();
								})
								.catch(()=>{
									//console.error("Rejected by theme.statusbar.fromHexColor()");
									reject();
								});
							}
							else {
								//console.error("Undefined 'StatusBarBackgroundColor' in config.xml");
								reject()
							}
						})
						.catch(()=>{
							//console.error("Rejected by application.preference(StatusBarBackgroundColor)");
							reject();
						});
					}
					else {
						//console.warn("Called from web application");
						resolve(); // Avoid blocking
					}

				}
			);
		},

		fromCssSelector : function(selector)
		{
			return new Promise(
				(resolve, reject)=>{
					if (typeof selector === "undefined") { selector = "statusbar"; }
					//console.info("IN theme.statusbar.fromCssSelector() selector='" + selector + "'");
					if (context.is_cordova()) {
						try {
							var bg_color = hex2color(rgb2hex(getCssValue(selector, "background-color")));
							theme.statusbar.fromHexColor(bg_color)
							.then (()=>{
								//console.log("Resolved by theme.statusbar.fromHexColor()");
								theme.statusbar.currentSelector = selector;
								resolve();
							})
							.catch(()=>{
								//console.error("Rejected by theme.statusbar.fromHexColor()");
								theme.statusbar.currentSelector = "";
								reject();
							});
						}
						catch(e) {
							//console.error("Runtime exception");
							//console.error(e);
							reject();
						}
					}
					else {
						//console.warn("Called from web application");
						resolve(); // Avoid blocking
					}
				}
			);
		}

	},


	// **************************************************************************
	// **************************************************************************
	//
	// NAVIGATION BAR
	//
	// **************************************************************************
	// **************************************************************************

	navigationbar : {

		currentSelector : "", currentColor : "",

		fromHexColor : function(bg_color) 
		{
			return new Promise(
				(resolve, reject)=>{
					//console.info("IN theme.navigationbar.fromHexColor() bg_color='" + bg_color + "'");
					if ((! context.is_cordova()) || (typeof NavigationBar === "undefined")) {
						//console.log("NO THEMEING FOR NAVIGATIONBAR");
						resolve();
					}
					else {
						bg_color = hex2color(bg_color);
						var foreground = contrast(bg_color);
						//console.log("foreground='" + foreground + "'");
						try {
							theme.navigationbar.currentColor = bg_color;
							//console.log(theme.navigationbar.currentColor);
							if (strcasecmp("foreground", "light") === 0) {
								//console.log("navigationbar styling with default content");
								NavigationBar.backgroundColorByHexString(bg_color, false);				
							}
							else {
								//console.log("navigationbar styling with light content");
								NavigationBar.backgroundColorByHexString(bg_color, true);		
							}
							resolve();
						}
						catch(e) {
							//console.error("Runtime error in theme.navigationbar.fromHexColor()");
							reject();
						}
					}
				}
			);
		},

		fromConfigXML : function()
		{
			return new Promise(
				(resolve, reject)=>{
					//console.info("IN theme.navigationbar.fromConfigXML()");
					if (context.is_cordova()) {
						application.preference("NavigationBarBackgroundColor")
						.then ((bg_color)=>{
							//console.log(JSON.stringify(bg_color));
							if (strlen(bg_color) > 0) {
								theme.navigationbar.fromHexColor(bg_color)
								.then (()=>{
									//console.log("Resolved by theme.navigationbar.fromHexColor()");
									resolve();
								})
								.catch(()=>{
									//console.error("Rejected by theme.navigationbar.fromHexColor()");
									reject();
								});
							}
							else {
								//console.error("Undefined 'NavigationBarBackgroundColor' in config.xml");
								reject()
							}
						})
						.catch(()=>{
							//console.error("Rejected by application.preference(NavigationBarBackgroundColor)");
							reject();
						});
					}
					else {
						//console.warn("Called from web application");
						resolve(); // Avoid blocking
					}
				}
			);
		},

		fromCssSelector : function(selector)
		{
			return new Promise(
				(resolve, reject)=>{
					//console.info("IN theme.navigationbar.fromCssSelector() selector='" + selector + "'");
					if (context.is_cordova()) {
						try {
							var bg_color = hex2color(rgb2hex(getCssValue(selector, "background-color")));
							theme.navigationbar.fromHexColor(bg_color)
							.then (()=>{
								//console.log("Resolved by theme.navigationbar.fromHexColor()");
								theme.navigationbar.currentSelector = selector;
								resolve();
							})
							.catch(()=>{
								//console.error("Rejected by theme.navigationbar.fromHexColor()");
								theme.navigationbar.currentSelector = "";
								reject();
							});
						}
						catch(e) {
							//console.error("Runtime exception");
							//console.error(e);
							reject();
						}
					}
					else {
						//console.warn("Called from web application");
						resolve(); // Avoid blocking
					}
				}
			);
		}

	},


	// **************************************************************************
	// **************************************************************************
	//
	// RUNTIME
	//
	// **************************************************************************
	// **************************************************************************

	get : function()
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN theme.get()");
				if (typeof AutoTheme !== "undefined") {
					AutoTheme.getTheme(function(isDarkMode) {
						if (isDarkMode) {
							resolve("dark");
						}
						else {
							resolve("light");
						}
					});
				}
				else {
					if (context.is_cordova()) {
						resolve("light");
					}
					else {
						var dummy = storage.get("theme_radiahub");
						if (strlen(dummy) > 0) {
							dummy = str_replace("theme-", "", theme_radiahub);
							resolve(dummy);
						}
						else {
							resolve("light");
						}
					}
				}
			}
		);
	},

	apply : function (themeID)
	{
		return new Promise(
			(resolve, reject)=>{
				//console.info("IN theme.apply() themeID='" + themeID + "'");

				var terminate = function() {
					//console.info("IN theme.apply()->terminate()");
					theme.initialized = true;
					if (typeof pages !== "undefined") {
						pages.onthemechanged(themeID)
						.then (()=>{ delay (100).then(()=>{ resolve(); }).catch(()=>{}); })
						.catch(()=>{ delay (100).then(()=>{ resolve(); }).catch(()=>{}); });
					}
					else {
						//console.warn("pages object is undefined");
						delay (100).then(()=>{ resolve(); }).catch(()=>{});
					}
				};

				if (context.is_cordova()) {

					var applySelectorToStatusBar = function() {
						return new Promise(
							(yes, no)=>{
								//console.info("IN theme.apply()->applySelectorToStatusBar()");
								var _selector = "splashbar";
								if (theme.initialized) {
									_selector = (strlen(theme.statusbar.currentSelector) > 0) ? theme.statusbar.currentSelector : "statusbar";
								}
								//console.log(_selector);
								theme.statusbar.fromCssSelector(_selector)
								.then (()=>{
									yes();
								})
								.catch(()=>{
									//console.warn("Rejected by theme.statusbar.fromCssSelector()");
									no();
								});
							}
						);
					};

					var applySelectorToNavigationBar = function() {
						return new Promise(
							(yes, no)=>{
								//console.info("IN theme.apply()->applySelectorToNavigationBar()");
								var _selector = "splashbar";
								if (theme.initialized) {
									_selector = (strlen(theme.navigationbar.currentSelector) > 0) ? theme.navigationbar.currentSelector : "navigationbar";

									//console.log(_selector);
									theme.navigationbar.fromCssSelector(_selector)
									.then (()=>{
										yes();
									})
									.catch(()=>{
										//console.warn("Rejected by theme.navigationbar.fromCssSelector()");
										no();
									});

								}
								else {
									yes();
								}	
							}
						);
					};

					document.documentElement.className = "theme-" + themeID;

					applySelectorToStatusBar()
					.then (()=>{
						applySelectorToNavigationBar()
						.then (()=>{
							terminate();
						})
						.catch(()=>{
							terminate();
						});
					})
					.catch(()=>{
						terminate();
					});

				}
				else {
					//console.warn("Called from web application");
					document.documentElement.className = "theme-" + themeID;
					terminate();
				}

			}
		);
	},


	// **************************************************************************
	// **************************************************************************
	//
	// RUNTIME EVENTS
	//
	// **************************************************************************
	// **************************************************************************

	onThemeChange : function(isDarkMode)
	{
		//console.info("IN theme.onThemeChange() isDarkMode=" + String(isDarkMode));
		var currentTheme = (isDarkMode) ? "dark" : "light";
		theme.apply(currentTheme)
		.then (()=>{
			//console.log("Resolved by theme.apply() currentTheme='" + currentTheme + "'");
		})
		.catch(()=>{ 
			//console.warn("Rejected by theme.apply() currentTheme='" + currentTheme + "'");
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
		if (typeof AutoTheme !== "undefined") {

			//console.info("IN theme.init()");

			window.onThemeChange = function(isDarkMode) {
				theme.onThemeChange(isDarkMode);
			};

			AutoTheme.getTheme(function(isDarkMode) {
				theme.onThemeChange(isDarkMode);
			});

		}
	}

};




// End of file: theme.js
// ============================================================================
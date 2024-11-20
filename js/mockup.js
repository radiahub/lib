// ============================================================================
// Module      : mockup.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Page mockup basic navigation and execution support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 11-Feb-23 00:00 WIT   Denis  Deployment V. 2023 "LEO MALET"
// 22-Jan-24 00:00 WIT   Denis	mockupTools always point to the page on top
//                              of the pages stack
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// mockupTools implementation
//
// ****************************************************************************
// ****************************************************************************

var mockupTools = {

	showing: false, page_id: "",


	// **************************************************************************
	// **************************************************************************
	//
	// Runtime
	//
	// **************************************************************************
	// **************************************************************************

	reloadTargetPage : function()
	{
		console.info("IN mockupTools.reloadTargetPage()");
		mockupTools.hide();
		if (strlen(mockupTools.page_id) > 0) {
			var idx = pages.indexOf(mockupTools.page_id);
			if (idx >= 0) {
				var P = pages[idx];
				P.reload();
			}
		}
	},

	forceLightTheme : function()
	{
		console.info("IN mockupTools.forceLightTheme()");
		mockupTools.hide();
		theme.apply("light")
			.then (()=>{
			console.log("Resolved by theme.apply(light)");
		})
		.catch(()=>{
			M.error("Rejected by theme.apply(light)");
		});
	},

	forceDarkTheme : function()
	{
		console.info("IN mockupTools.forceDarkTheme()");
		mockupTools.hide();
		theme.apply("dark")
			.then (()=>{
			console.log("Resolved by theme.apply(dark)");
		})
		.catch(()=>{
			M.error("Rejected by theme.apply(dark)");
		});
	},

	showBenchmarkPage: function()
	{
		console.info("IN mockupTools.showBenchmarkPage()");
		if ((typeof benchmark !== "undefined") && (typeof benchmark.show === "function")) {
			mockupTools.hide();
			benchmark.show();
		}
	},

	showTypographyPage: function()
	{
		console.info("IN mockupTools.showTypographyPage()");
		if ((typeof typography !== "undefined") && (typeof typography.show === "function")) {
			mockupTools.hide();
			typography.show();
		}
	},

	forceCloseTargetPage : function()
	{
		console.info("IN mockupTools.forceCloseTargetPage()");
		mockupTools.hide();
		if (strlen(mockupTools.page_id) > 0) {
			var idx = pages.indexOf(mockupTools.page_id);
			if (idx >= 0) {
				if (typeof (pages.collection[idx]["options"]["onbackbutton"]) === "function") {
					confirm(
						"Page: '" + mockupTools.page_id + "' will be closed. Continue?",
						"mockupTools", "Yes", "No",
						function() { pages.collection[idx]["options"]["onbackbutton"](); },
						noop
					);
				}
				else {
					pages.collection[idx].remove();
				}
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

	show : function()
	{
		console.info("IN mockupTools.show()");
		jQuery("#MOCKUP_TOOLS_CONTAINER").show();
		mockupTools.showing = true;
	},

	hide : function()
	{
		console.info("IN mockupTools.hide()");
		jQuery("#MOCKUP_TOOLS_CONTAINER").remove();
		mockupTools.showing = false;
	},

	init : function(page_id)
	{
		console.info("IN mockupTools.init() page_id='" + page_id + "'");
		mockupTools.page_id = page_id;

		if (!DOMExists("MOCKUP_TOOLS_CONTAINER")) {

			var url = context.libpath() + "html/mockupTools.html";
			console.log(url);
			var html = file2bin(url);
			console.log(strlen(html));

			jQuery(document.body).append(html);

			jQuery("#MOCKUP_TOOLS_CONTAINER").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				if (typeof nativeclick !== "undefined") {
					nativeclick.trigger();
				}
				mockupTools.hide();
			});

			jQuery("#MOCKUP_HIDE").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				ripple(this, mockupTools.hide);
			});

			jQuery("#MOCKUP_REFRESH").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				ripple(this, mockupTools.reloadTargetPage);
			});

			jQuery("#MOCKUP_FORCE_LIGHT").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				//mockupTools.forceLightTheme();
				ripple(this, mockupTools.forceLightTheme);
			});

			jQuery("#MOCKUP_FORCE_DARK").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				/*
				if (typeof nativeclick !== "undefined") {
					nativeclick.trigger();
				}
				*/
				//mockupTools.forceDarkTheme();
				ripple(this, mockupTools.forceDarkTheme);
			});


			jQuery("#MOCKUP_BENCHMARK").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				//mockupTools.showBenchmarkPage();
				ripple(this, mockupTools.showBenchmarkPage);
			});

			jQuery("#MOCKUP_TYPOGRAPHY").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				//mockupTools.showBenchmarkPage();
				ripple(this, mockupTools.showTypographyPage);
			});

			jQuery("#MOCKUP_FORCE_CLOSE").off("click").on("click",function(e){
				e.preventDefault ();
				e.stopPropagation();
				//if (typeof nativeclick !== "undefined") {
				//	nativeclick.trigger();
				//}
				//mockupTools.forceCloseTargetPage();
				ripple(this, mockupTools.forceCloseTargetPage);
			});

		}

	},

	reset : function()
	{
		console.info("IN mockupTools.reset()");
		mockupTools.init();
	}

};




// ****************************************************************************
// ****************************************************************************
//
// mockup implementation
//
// ****************************************************************************
// ****************************************************************************

function mockup (page_id) 
{
	console.info("IN mockup() page_id='" + page_id + "'");

	var exec_eval = function(st) {
		if (strlen(st) > 0) {
			var arr = breakApart(st,";");
			for (var i = 0; i < arr.length; i++) {
				try {
					eval(arr[i]);
				}
				catch(e) {
					M.error("Runtime exception in '" + "#" + page_id + " .mockupEVAL" + "' eval='" + arr[i] + "'");
				}
			}
		}
	};

	var do_the_close = function() {
		var idx = pages.indexOf(page_id);
		if (idx >= 0) {
			if (typeof (pages.collection[idx]["options"]["onbackbutton"]) === "function") {
				pages.collection[idx]["options"]["onbackbutton"]();
			}
		}
	};

	var idx = pages.indexOf(page_id);
	if (idx >= 0) {

		jQuery("#" + page_id + " .mockupINIT").each(function(){
			var obj = jQuery(this);
			exec_eval(String(obj.data("oninit")));
		});

		jQuery("#" + page_id + " .mockupCLOSE").off("click").on("click",function(){
			ripple(this, do_the_close);
		});

		jQuery("#" + page_id + " .mockupFAILED").off("click").on("click",function(){
			ripple(this, function() {
				if (typeof failed === "function") {
					failed();
				}
				else {
					do_the_close();
				}
			});
		});

		jQuery("#" + page_id + " .mockupSUCCESS").off("click").on("click",function(){
			ripple(this, function() {
				if (typeof success === "function") {
					success();
				}
				else {
					do_the_close();
				}
			});
		});

		jQuery("#" + page_id + " .mockupTOOLS").off("click").on("click", function(){
			ripple(this, function(){
				mockupTools.init(page_id);
				setTimeout(mockupTools.show, 100);
			});
		});

		jQuery("#" + page_id + " .mockupCLICK").off("click").on("click",function(){
			var obj = jQuery(this);
			ripple(this, function() {
				exec_eval(String(obj.data("onclick")));
			});
		});

		jQuery("#" + page_id + " .mockupMENU").off("click").on("click",function(e){
			var obj = jQuery(this);
			ripple(this, function(){
				var div_menu_container_id = obj.data("menu");
				jQuery("#" + div_menu_container_id).show();
			});
		});

		jQuery("#" + page_id + " .mockupMENUOPTION").off("click").on("click",function(e){
			e.preventDefault();
			e.stopPropagation();
			var obj = jQuery(this);
			ripple(this, function() {
				var st = obj.data("onclick");
				obj.closest(".page.modal-cover").hide();
				exec_eval(st);
			});
		});

		jQuery("#" + page_id + " .tab").off("click").on("click",function(){
			var obj = jQuery(this);
			if (! obj.hasClass("selected")) {
				jQuery("#" + page_id + " .tab").removeClass("selected");
				obj.addClass("selected");
				exec_eval(String(obj.data("onclick")));
			}
		});

		jQuery("#" + page_id + " .navbutton").off("click").on("click",function(){
			var obj = jQuery(this);
			if (! obj.hasClass("selected")) {
				jQuery("#" + page_id + " .navbutton").removeClass("selected");
				obj.addClass("selected");
				exec_eval(String(obj.data("onclick")));
			}
		});

	}
};




// End of file: mockup.js
// ============================================================================
// ============================================================================
// Module      : auth.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : HTML reader
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

var reader = function(documentURI, title)
{
	return new Promise(
		(resolve, reject)=>{

			if (strlen(title) === 0) { title = ""; }
			console.log("IN reader() title='" + title + "'");

			let mypage = null, statusColor = "", navigationColor = "";
			if (typeof theme !== "undefined") {
				statusColor = theme.statusbar.currentColor;
				navigationColor = theme.navigationbar.currentColor;
			}


			// **********************************************************************
			// **********************************************************************
			// 
			// RUNTIME
			//
			// **********************************************************************
			// **********************************************************************

			let hide = function() 
			{
				console.log("IN reader()->hide()");

				var terminate = function() {
					if (mypage !== null) {
						mypage.remove();
						mypage = null;
					}
				};

				if (typeof theme !== "undefined") {
					theme.statusbar.fromHexColor(statusColor);
					theme.navigationbar.fromHexColor(navigationColor);
					terminate();
				}
				else {
					terminate();
				}

			};

			let success = () => {
				console.log("IN reader()->success()");
				hide();
				resolve();
			};


			// **********************************************************************
			// **********************************************************************
			// 
			// RUNTIME EVENTS
			//
			// **********************************************************************
			// **********************************************************************

			let onbackbutton = function()
			{
				console.log("IN reader()->onbackbutton()");
				success();
			};

			let onshow = function()
			{
				console.log("IN reader()->onshow() documentURI='" + documentURI + "'");
				jQuery("#DIV_READER_TITLE").html(title);
				application.load(documentURI)
				.then ((my_document)=>{
					my_document = str_replace("[appname]", version.record.appname, my_document);
					jQuery("#DIV_READER_CONTENT").html(my_document);
					if (strlen(title) === 0) {
						var p = my_document.indexOf("<b>"), q = my_document.indexOf("</b>");
						title = my_document.slice(p + 3, q);
					}
					jQuery("#DIV_READER_TITLE").html(title);
				})
				.catch(()=>{
					console.error("Rejected by application.load() documentURI='" + documentURI + "'");
				});
			};


			// **********************************************************************
			// **********************************************************************
			//
			// DISPLAY API
			//
			// **********************************************************************
			// **********************************************************************

			mypage = new page({
				page_id      : "page_reader",
				containerID  : "",
				contentURI   : context.libpath() + "html/reader.html",
				onbackbutton : onbackbutton,
				onshow       : onshow,
				globalize    : false
			});
			if (mypage !== null) { 			
				mypage.show();
			}

		}
	);
}


// End of file: reader.js
// ============================================================================
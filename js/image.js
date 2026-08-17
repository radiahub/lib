// ============================================================================
// Module      : image.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Images
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// UTILS
//
// ****************************************************************************
// ****************************************************************************

var noimage   = "lib/img/usecamera.png" ;
var noprofile = "lib/img/useprofile.png";


// ****************************************************************************
// ****************************************************************************
//
// IMAGE API
//
// ****************************************************************************
// ****************************************************************************

var image = {

	// Resize an image to a given limit in pixels and return the image source 
	// in dataURL format
	//
	// source  : either the URL/URI or dataURL format, representing the image to 
	//           resize
	// maxSize : max size of the larger dimension of the image source in pixels
	//           (default = 0: no size limitation applies)
	// type    : image/* MIME type of the resulting image dataURL, default: image/png
	// 
	// resolve : function(dataURL) {...}
	//
	toDataURL : function(source, maxSize, type)
	{
		return new Promise((resolve)=>{
			if (typeof type === "undefined") { type = (isDataURL(source)) ? mimeTypeFromDataURL(source) : "image/png"; }
			if (typeof maxSize === "undefined") { maxSize = 0; }
			maxSize = parseInt(String(maxSize));
			//console.info ("IN image.toDataURL() maxSize=" + maxSize + " type='" + type + "'");
			//console.log(logFromDataURL(source));
			try {
				var img = new Image();
				img.onload = function() {
					var canvas = document.createElement("canvas");
					var width = img.width, height = img.height, scaleFactor = 1.0;
					if (maxSize > 0) {
						scaleFactor = Math.min(maxSize/width, maxSize/height);
					}
					canvas.width  = scaleFactor * width ;
					canvas.height = scaleFactor * height;
					var context   = canvas.getContext("2d");
					context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
					var dataURL = canvas.toDataURL(type);
					delay(100).then(()=>{ resolve(dataURL); });
				};
				img.src = source;
			}
			catch(e) {
				console.error(JSON.stringify(e));
				resolve(false);
			}
		});
	},

	// source : either the image URL/URI or dataURL format
	// 
	geometry : function(source)
	{
		return new Promise((resolve)=>{
			//console.info ("IN image.geometry()");
			//console.log(logFromDataURL(source));
			try {
				var mimetype = "image/png", filesize = 0;

				if (isDataURL(source)) {
					mimetype = mimeTypeFromDataURL(source);
					filesize = strlen(source);
				}
				else if (typeof source === "string") {
					mimetype = mimeTypeFromFileName(source);
				}

				var result = {
					mimetype       : mimetype,
					filesize       : filesize,
					width          : 0,
					height         : 0,
					orientation    : "",
					ratio_w_over_h : 0 //Value of image_width / image_height
				};

				var img = new Image();

				img.onload = function() {
					result["width" ] = img.width;
					result["height"] = img.height;
					var orientation = (img.width > img.height) ? "landscape" : (img.width < img.height) ? "portrait" : "square";
					result["orientation"] = orientation;
					if (img.height > 0) {
						result["ratio_w_over_h"] = img.width / img.height;
					}
					if (filesize === 0) {
						var canvas = document.createElement("canvas");
						canvas.width  = img.width;
						canvas.height = img.height;
						var context   = canvas.getContext("2d");
						context.drawImage(img, 0, 0, img.width, img.height);
						var dataURL = canvas.toDataURL(type);
						result["filesize"] = strlen(dataURL);
					}
					resolve(result);
				};

				img.src = source;
			}
			catch(e) {
				console.error(JSON.stringify(e));
				resolve(false);
			}
		});
	},

	src : function(eltID)
	{
		return new Promise((resolve)=>{
			//console.info("IN image.src()");
			try {
				var src = "", element = document.getElementById(eltID);
				if (element.tagName === 'IMG') {
					src = element.src;
				}
				else if (element.tagName === 'DIV') {
					src = element.style.backgroundImage;
					//console.log(src);
					src = str_replace("url(\"", "", src);
					src = str_replace("\")", "", src);
					src = str_replace("url('", "", src);
					src = str_replace("')", "", src);
				}
				//console.log(logFromDataURL(src));
				if (strlen(src) > 0) {
					if (isDataURL(src)) {
						resolve(src);
					}
					else {
						image.toDataURL(src).then((dataURL)=>{
							resolve(dataURL);
						});
					}
				}
				else {
					//console.warn("Image SRC resolved to null or empty");
					resolve(null);
				}
			}
			catch(e) {
				//console.error("Runtime exception '" + JSON.stringify(e) + "'");
				resolve(null);
			}
		});
	},


	// **************************************************************************
	// **************************************************************************
	//
	// CAPTURE API
	//
	// **************************************************************************
	// **************************************************************************

	capture : {

		input : function (maxSize, withDetails)
		{
			return new Promise((resolve) => {	
				if (typeof withDetails === "undefined") { withDetails = false; }
				if (typeof maxSize === "undefined") { maxSize = ""; }	
				//console.info("IN image.capture.input() withDetails=" + String(withDetails));
				DOMFileInput("image/*", withDetails).then((res)=>{
					if (res !== false) {
						if (withDetails) {
							if (strlen(res["dataURL"]) > 0) {
								var mimeType = mimeTypeFromDataURL(res["dataURL"])
								image.toDataURL(res["dataURL"], maxSize, mimeType).then((dataURL)=>{
									if (dataURL !== false) {
										resolve({ 
											filename    : res.filename, 
											filesize    : strlen(dataURL), 
											dataURLSize : strlen(dataURL), 
											dataURL     : dataURL 
										});
									}
									else {
										resolve(false);
									}
								});
							}
							else {
								resolve(res);
							}
						}
						else if (isDataURL(res)) {
							var mimeType = mimeTypeFromDataURL(res);
							image.toDataURL(res, maxSize, mimeType).then((dataURL)=>{
								resolve(dataURL);
							});
						}
						else {
							resolve(res);
						}
					}
					else {
						resolve(false);
					}
				});
			});
		},

		camera : function (maxSize, quality)
		{
			return new Promise((resolve) => {				
				if (typeof quality === "undefined") { quality = 100; }
				//console.info("IN image.capture.camera()");
				if (is_cordova()) {
					let options = {
						quality            : quality,
						destinationType    : Camera.DestinationType.FILE_URI,
						sourceType         : Camera.PictureSourceType.CAMERA,
						allowEdit          : false,
						saveToPhotoAlbum   : true,
						correctOrientation : true	
					};
					//console.log(JSON.stringify(options));
					navigator.camera.getPicture(
						function (imageURI) {
							image.toDataURL(imageURI, maxSize, "image/jpeg")
							.then ((dataURL)=>{
								delay(100).then(()=>{ resolve(dataURL); });
							});
						},
						function (err) {
							//console.error("resolve(false)ed by navigator.camera.getPicture()");
							//console.error(JSON.stringify(err));
							resolve(false);
						},
						options
					);
				}
				else {
					image.capture.input(maxSize, false)
					.then ((dataURL)=>{
						delay(100).then(()=>{ resolve(dataURL); });
					});
				}
			});
		},

		gallery : function (maxSize, quality)
		{
			return new Promise((resolve) => {				
				if (typeof quality === "undefined") { quality = 100; }
				//console.info("IN image.capture.gallery()");
				if (is_cordova()) {
					let options = {
						quality         : quality,
						destinationType : Camera.DestinationType.FILE_URI,
						sourceType      : Camera.PictureSourceType.SAVEDPHOTOALBUM,
						allowEdit       : false
					};
					//console.log(JSON.stringify(options));
					navigator.camera.getPicture(
						function (imageURI) {
							image.toDataURL(imageURI, maxSize).then ((dataURL)=>{
								delay(100).then(()=>{ resolve(dataURL); });
							});
						},
						function (err) {
							//console.error("resolve(false)ed by navigator.camera.getPicture()");
							//console.error(JSON.stringify(err));
							resolve(false);
						},
						options
					);
				}
				else {
					image.capture.input(maxSize, false)
					.then ((dataURL)=>{
						delay(100).then(()=>{ resolve(dataURL); });
					});
				}
			});
		}

	}
	
};


// ****************************************************************************
// ****************************************************************************
//
// JQUERY DOM API
//
// ****************************************************************************
// ****************************************************************************

// jQuery DOM image function: set image data to a DOM image or DOM DIV object
//
// uri : either a valid URI/URL or a valid dbupload binary_id identifier
//
// Example: jQuery("#myObjectID").image(uri);
//          jQuery("#myObjectID").image("012345678901234567");
//
(function($) {
  $.fn.image = function(uriOrDataURL) {
		//console.info("IN jQuery(selector).image()");
		this.each(function() {
			//console.log(uriOrDataURL);
			var that = this;
			var assignUriOrDataURL = function(src) {
				if (that.tagName === 'IMG') {
					jQuery(that).attr("src", src);
				}
				else {
					if (! jQuery(that).hasClass("thumbnail")) {
						jQuery(that).addClass("thumbnail");
					}
					jQuery(that).css("background-image", "url('" + src + "')");
				}
			};
			assignUriOrDataURL(uriOrDataURL);
		});
		return this;
  };
}(jQuery));


// End of file: image.js
// ============================================================================

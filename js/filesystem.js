// ============================================================================
// Module      : filesystem.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Library to handle in-browser/device (local) file system
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// FILES AND BINARY UTILS
//
// ****************************************************************************
// ****************************************************************************

var pathHandle = function (path) {
	if (path.slice(path.length - 1, 1) !== "/") {
		path += "/";
	}
	return path;
};

var gateway = pathHandle(window.location.origin);

var pathUnHandle = function (path) {
	if (path.slice(path.length - 1, path.length) === "/") {
		path = path.slice(0, path.length - 1);
	}
	return path;
};

var randomizeUrl = function (filename) {
	var addThis = Math.random();
	if (filename.indexOf("?") > 0) {
		return filename + "&r=" + addThis;
	}
	else {
		return filename + "?r=" + addThis;
	}
};

var fileName = function (filename) { 
	if (filename.lastIndexOf("/") >= 0) {
		filename = filename.slice(filename.lastIndexOf("/") + 1);
	}
	else if (filename.lastIndexOf("\\") >= 0) {
		filename = filename.slice(filename.lastIndexOf("\\") + 1);
	}
	return filename;
};

const fileCopyName = (filename)=>{
    let p = filename.lastIndexOf(".");
    if (p >= 0) {
        filename = filename.slice(0,p) + " copy" + filename.slice(p);
    }
    else {
        filename += " copy";
    }
};

var stripExtension = function (filename) { 
	var result = "";
	var p = filename.lastIndexOf(".");
	if (p >= 0) {
		result = filename.slice(0, p); 
	}
	return result;
};

var setExtension = function (filename, ext) {
	var result = stripExtension(filename);
	if (ext.slice(0,1) !== ".") { ext = "." + ext; }
	result += ext;
	return result;
};

// Includes the leading "."
//
var fileExt = function (filename) { 
	var result = "";
	var p = filename.lastIndexOf(".");
	if (p >= 0) {
		result = filename.slice(p); 
	}
	return result;
};

var mimeTypeFromFileName = function (filename) 
{
	//console.info("IN mimeTypeFromFileName() filename='" + filename + "'");
	var result = "application/octet-stream";
	var extens = fileExt(filename);
	var maptxt = "/lib/mimetype_extensions.map.txt";
	var buffer = freadSync(maptxt);
	if (strlen(buffer) > 0) {
		var lines = breakApart(buffer, "\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var p = line.indexOf("\t");
			if (p > 0) {
				var theextens = line.slice(0, p); theextens = String(theextens).trim();
				if (strcasecmp(theextens, extens) === 0) {
					result = line.slice(p + 1); result = String(result).trim();
					break;
				}
			}
		}
	}
	return result;
};

var extensionFromMimeType = function(mimetype) 
{
	//console.info("IN extensionFromMimeType() mimetype='" + mimetype + "'");
	var result = ".bin";
	var maptxt = "/lib/mimetype_extensions.map.txt";
	var buffer = freadSync(maptxt);
	if (strlen(buffer) > 0) {
		var lines = breakApart(buffer, "\n");
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			var p = line.indexOf("\t");
			if (p > 0) {
				var themimetype = line.slice(p + 1); themimetype = String(themimetype).trim();
				if (strcasecmp(themimetype, mimetype) === 0) {
					result = line.slice(0, p);
					break;
				}
			}
		}
	}
	return result;
};

var filenameFromMimeType = function(mimetype)
{
	//console.info("IN filenameFromMimeType() mimetype='" + mimetype + "'");

	var dt   = datetime.now();
	var name = dt.slice(0, 8) + "_" + dt.slice(8) + "_" + rand_num_str(4); //20 chars
	//console.log(name);

	var ext  = extensionFromMimeType(mimetype);
	if ((strlen(ext) > 0) && (ext.slice(0,1) !== ".")) {
		ext = "." + ext;
	}

	return (name + ext);
};

var logFromDataURL = function(dataURL)
{
	var len = strlen(dataURL);
	if (len >= 50) {
		return String(dataURL).slice(0, 50) + " ..." + " (" + len + " chars)";
	}
	else {
		return String(dataURL);
	}
};

const mimeTypeFromDataURL = function(dataURL) {
	var mimetype = dataURL.slice(0, dataURL.indexOf(";"));
	mimetype = mimetype.slice(mimetype.indexOf(":") + 1);
	return mimetype;
};

var isDataURL = function(candidate) {
	return ((strmatch(candidate, "data:")) && (strlen(mimeTypeFromDataURL(candidate)) > 0));
};

var base64toBlob = function (base64Data, mimetype) 
{
	if (typeof mimetype === "undefined") { mimetype = "application/octet-stream"; }
	//console.info("IN base64toBlob() mimetype='" + mimetype + "'");
	//console.log(logFromDataURL(base64Data));

	var sliceSize      = 1024;
	var byteCharacters = window.atob(base64Data);
	var bytesLength    = byteCharacters.length;
	var slicesCount    = Math.ceil(bytesLength / sliceSize);
	var byteArrays     = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
		}

		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}

	return new Blob(byteArrays, { type: mimetype });
};

var base64FromDataURL = function(dataURL) {
	var base64Data = dataURL.slice(dataURL.indexOf(",") + 1);
	return base64Data;
};

var textFromDataURL = function(dataURL) {
	var base64Data = base64FromDataURL(dataURL);
	return window.atob(base64Data);
};

var blobFromDataURL = function(dataURL) {
	var mimetype = mimeTypeFromDataURL(dataURL);
	var base64Data = base64FromDataURL(dataURL);
	var blob = base64toBlob(base64Data, mimetype);
	return blob;
};

var dataURLFromBlob = function(blob, mimetype) {
    var base64Data = window.btoa(blob);
    var dataURL = "data:" + mimetype + ";base64," + base64Data;
    return dataURL;
};

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
};

function openDataURL(dataURL) 
{
    var blb = blobFromDataURL(dataURL);
    var url = URL.createObjectURL(blb);
    window.open(url, "_system");
};

/*
function fileExists(filepath)
{
    return new Promise((resolve)=>{
        //console.info("IN fileExists() filepath='" + filepath + "'");
        fetch(filepath).then(response=>{
            if (response.ok) {
                resolve(true);
            } 
            else if (response.status === 404) {
                //console.log('File not found');
                resolve(false);
            } 
            else {
                //console.error(response.status);
                resolve(false);
            }
        })
        .catch((error)=>{
            //console.error(JSON.stringify(error));
            resolve(false);
        });
    });
};
*/


// ****************************************************************************
// ****************************************************************************
//
// DOM FILE API
//
// ****************************************************************************
// ****************************************************************************

async function fileExists(filename) 
{
    const response = await fetch(filename, { method: 'HEAD' });
    return response.ok;
}

async function fread(filename, cast="text")
{
    const response = await fetch(randomizeUrl(filename));
    if (response.ok) {
        if (cast === "blob") {
            const result = await response.blob();
            return result;
        }
        else if (cast === "json") {
            const result = await response.json();
            return result;        }
        else if (cast === "text") {
            const result = await response.text();
            return result;
        }
        else {
            return null;
        }
    }
    else {
        //console.error(`${response.status}`);
        return null;
    }
};

function freadSync(url, jsonParse=false)
{
	url = randomizeUrl(url);
	//console.info("IN freadSync() url='" + url + "'");
    var result = (function() {
        var result = null;
		var args = {
			url         : url,
			cache       : false,
			async       : false,
			method      : "GET",
			global      : false,
			datatype    : false,
			contentType : false,
			processData : false,
			success     : (data) => { result = data; }
		};
	  jQuery.ajax(args);
		return result;
	})();
	if (jsonParse) {
		if (is_json(result)) {
			result = JSON.parse(result);
		}
	}
	return result;
};


// ****************************************************************************
// ****************************************************************************
//
// DOM FILEINPUT API
//
// ****************************************************************************
// ****************************************************************************

// file : one of the elements of a DOM file input files property
// cast : one of "text", "dataURL", "arrayBuffer" (or "blob") string values
//
const DOMFileRead = function(file, cast)
{
	return new Promise((resolve)=>{
		
		if (typeof cast === "undefined") { cast = "dataURL"; }
		
		//console.log("IN fileread() cast='" + cast + "'");
		
		let reader = new FileReader();
		reader.onload = function() {
			//console.log(String(reader.result).slice(0,100));
			if (cast.toUpperCase() === "BLOB") {
				var blob = new Blob(reader.result, { type: file.type || "application/octet-stream" });
				resolve(blob);
			}
			else {
				resolve(reader.result);
			}
		};
		reader.onerror = function() {
			//console.error(reader.error);
			resolve(null);
		};
		
		if (cast.toUpperCase() === "TEXT") {
			reader.readAsText(file);
		}
		else if (cast.toUpperCase() === "DATAURL"){
			reader.readAsDataURL(file);
		}
		else if (cast.toUpperCase() === "BLOB") {
			reader.readAsArrayBuffer(file);
		}
		
	});
};

// accept  = a valid DOM file input wildcard combination, ex.: accept="image/*"
// resolve = function(result) {...}
// result  = plain object { filename : "", dataURL  : "", filesize : 0, dataURLSize: 0 }
//           or false on error
//           Notice that filesize is different from strlen(dataURL) (shorter)
//
const DOMFileInput = function(accept = "*", withDetails = false)
{
	return new Promise((resolve)=>{

		//console.info("IN fileinput() accept=" + String(accept) + " withDetails=" + String(withDetails));

		var element = document.getElementById("fileInputID");
		
		if ((typeof element === 'undefined') || (element === null)) {
		    //console.log("Create DOM element for 'fileInputID'");
			var inputHTML = '<div style="position:absolute; top:-1000px; height:fit-content;"><input id="fileInputID" type="file" accept="[accept]"></div>';
			inputHTML = str_replace("[accept]", accept, inputHTML);
			jQuery("body").append(inputHTML);
		}
		else {
		    //console.log("Reuse DOM element for 'fileInputID'");
			jQuery("#fileInputID").attr("accept", accept);
			document.getElementById('fileInputID').value = '';
		}

		delay(100).then(()=>{
		    //console.log("Instantiate DOM element for 'fileInputID'");
			jQuery("#fileInputID")
			.off("change")
			.val(null)
			.on ("change", function() {
				var input = document.getElementById('fileInputID');
				if ((input !== null) && (input.files.length > 0)) {
					var file = input.files[0];
					DOMFileRead(file,"dataURL")
					.then ((dataURL)=>{
						//console.log(logFromDataURL(dataURL));
						if (withDetails) {
						    //console.log(file.name, file.size);
							resolve({ 
								filename    : file.name, 
								filesize    : file.size, 
								dataURLSize : strlen(dataURL), 
								dataURL     : dataURL 
							});
						}
						else {
							resolve(dataURL);
						}
					})
					.catch((err)=>{
						//console.error("Rejected by DOMFileRead()");
						//console.error(JSON.stringify(err));
						resolve(null);
					});
				}
				else {
				    //console.error("Environment not set or no file to read");
				    resolve(null);
				}
			});
			
			//console.log("Before click");
			jQuery("#fileInputID").click();
		});

	});
};

function DOMFileFromDataURL(dataURL, filename) 
{
	var mimetype = mimeTypeFromDataURL(dataURL);
	if (strlen(filename) === 0) {
		filename = filenameFromMimeType(mimetype);
	}

	//console.info("IN DOMFileFromDataURL() filename='" + filename + "'");
	//console.log (logFromDataURL(dataURL));

    // 1. Split the data URL
    var arr = dataURL.split(',');
    // 2. Decode the base64 string to a binary string
    var bstr = window.atob(arr[arr.length - 1]);
    var n = bstr.length;
    // 3. Create a Uint8Array to hold the binary data
    var u8arr = new Uint8Array(n);
    // 4. Populate the Uint8Array with the character codes from the binary string
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // 5. Create and return a new File object using the Uint8Array data
    return new File([u8arr], filename, {type:mimetype});
}


// ****************************************************************************
// ****************************************************************************
//
// GUI UTILS
//
// ****************************************************************************
// ****************************************************************************

function getFileShortcutIcon(mimeType) 
{
	//console.info("IN binaries.getFileShortcutIcon() mimeType='" + mimeType + "'");
	
	var result = "doc_other_file.png";

	if (strmatch(mimeType, "IMAGE")) {
		result = "doc_image.png";
	}
	else if (strmatch(mimeType, "VIDEO")) {
		result = "doc_video.png";
	}
	else if (strmatch(mimeType, "AUDIO")) {
		result = "doc_audio.png";
	}
	else if (strmatch(mimeType, "application/pdf")) {
		result = "doc_adobe_acrobat.png";
	}
	else {
		var wordDocuments = [
			"application/x-abiword",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/vnd.oasis.opendocument.text",
			"text/plain"
		];

		var spreadsheetsDocuments = [
			"application/vnd.oasis.opendocument.spreadsheet",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		];

		var presentationDocuments = [
			"application/vnd.oasis.opendocument.presentation",
			"application/vnd.ms-powerpoint",
			"application/vnd.openxmlformats-officedocument.presentationml.presentation"
		];

		if (wordDocuments.includes(mimeType)) {
			result = "doc_ms_word.png";
		}
		else if (spreadsheetsDocuments.includes(mimeType)) {
			result = "doc_ms_excel.png";
		}
		else if (presentationDocuments.includes(mimeType)) {
			result = "doc_ms_powerpoint.png";
		}
	}

	return result;
}


// ****************************************************************************
// ****************************************************************************
//
// SERVER FILES API
//
// ****************************************************************************
// ****************************************************************************

function file_upload(filepath, dataURL, asDataURL="NO")
{
    //console.info("IN file_upload()");
    return new Promise((resolve)=>{
        let server_url = randomizeUrl(`${GATEWAY}file-upload.php`);
        //console.log(server_url);
        let mimetype = mimeTypeFromDataURL(dataURL);
        //console.log(mimetype);
        //console.info(`IN file_upload() server_url='${server_url}' filepath='${filepath}'`);
        //console.log(logFromDataURL(dataURL));
 
        fetch(server_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filepath  : filepath,
                dataURL   : dataURL,
                asDataURL : asDataURL
            })
        })
        .then((response)=>{
            //console.log(JSON.stringify(response));
			if (response.ok) {
                console.log("Response OK");
                response.json().then((result)=>{
                    console.log(result);
                    console.log(`ERRNO=${result.errno}`);
                    resolve(strlen(dataURL));
                });
            }
            else {
                console.error("http error");
                resolve(false);
            }
        })
        .catch(()=>{
            console.error("Rejected by fetch()");
            resolve(false);
        });

    });
}

function file_unlink(filename)
{
    return new Promise((resolve)=>{
        var server_url = randomizeUrl(`${GATEWAY}file-unlink.php?filename=${filename}`);
        //console.info(`IN file_unlink() filename='${filename}' server_url='${server_url}'`);
        fetch(server_url)
        .then((response)=>{
            if (response.ok){
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
        .catch(()=>{
            resolve(false);
        });
    });
}

function file_data(filepath)
{
    return new Promise((resolve)=>{
        var server_url = randomizeUrl(`${GATEWAY}file-data.php?filepath=${filepath}`);
        //console.info(`IN file_data() server_url='${server_url}'`);
        fetch(server_url)
        .then((response)=>{
            if (response.ok) {
                response.json().then((result)=>{
                    resolve(result.dataURL);
                });
            }
            else {
                //console.error("http error");
                resolve(null);
            }
        })
        .catch(()=>{
            resolve(null);
        });
    });
}

function folder_scan(dir="./", ignore="import,min")
{
    return new Promise((resolve)=>{
        var server_url = randomizeUrl(`${GATEWAY}folder-scan.php?dir=${dir}&ignore=${ignore}`);
        //console.info(`IN folder_scan() server_url='${server_url}'`);
        fetch(server_url)
        .then((response)=>{
            if (response.ok) {
                response.json().then((result)=>{
                    resolve(result.files);
                });
            }
            else {
                //console.error("http error");
                resolve(null);
            }
        })
        .catch(()=>{
            resolve(null);
        });
    });
}

function files_find(pattern="*.*", ignore="import,min")
{
    return new Promise((resolve)=>{
        var server_url = randomizeUrl(`${GATEWAY}files-find.php?pattern=${pattern}&ignore=${ignore}`);
        //console.info(`IN files_find() server_url='${server_url}'`);
        fetch(server_url)
        .then((response)=>{
            if (response.ok) {
                response.json().then((result)=>{
                    resolve(result.files);
                });
            }
            else {
                //console.error("http error");
                resolve(null);
            }
        })
        .catch(()=>{
            resolve(null);
        });
    });
}

async function readRemoteFile (filepath) {
    try {
        let dataURL = await file_data(filepath);
        if (dataURL) {
            let buffer = textFromDataURL(dataURL);
            return buffer;
        }
    }
    catch(e) {
        console.error(e);
    }
    return false;
}

async function writeRemoteFile (filepath, buffer) {
    try {
        let mimetype = mimeTypeFromFileName(filepath);
        let dataURL = dataURLFromBlob(buffer, mimetype);
        let result =  await file_upload(filepath, dataURL);
        return result;
    }
    catch(e) {
        console.error(e);
        return false;
    }
}


// ****************************************************************************
// ****************************************************************************
//
// BROWSER LOCAL FILES API (CHROMIUM-BASED BROWSERS ONLY)
//
// ****************************************************************************
// ****************************************************************************

// handle: valid file handle
//
async function ensureWritePermission(handle) {
    console.info(`IN ensureWritePermission() handle=${(handle !== null)}`);
    const p = await handle.queryPermission({ mode: 'readwrite' });
    if (p === 'granted') return true;
    const r = await handle.requestPermission({ mode: 'readwrite' });
    return (r === 'granted');
}

// Only working on answer to an user-triggered UI event
// Returns file handle or false
//
async function openLocalFile() {
    console.info(`IN openLocalFile()`);
    if ('showOpenFilePicker' in window) {
        let fileHandle;
        [fileHandle]= await window.showOpenFilePicker(fileEntryOptions);
        if (fileHandle) {
            //console.log(`fileHandle is set`);
            return fileHandle;
        }
        else {
            //console.error(`window.showOpenFilePicker() unresolved`);
            return false;
        }
    }
    else {
        //console.error(`showOpenFilePicker() is not defined`);
        return false;
    }
}

async function readLocalFile(handle) {
    try {
        console.info(`IN openLocalFile() handle=${(handle !== null)}`);
        let file = await handle.getFile();
        let buffer = await file.text();
    }
    catch(e) {
        console.error(e);
    }
    return false;
}

async function writeLocalFile(handle, buffer) {
    console.info(`IN writeLocalFile() handle=${(handle !== null)} len=${strlen(buffer)}`);
    try {
        if (handle && ensureWritePermission(handle)) {
            const writable = await handle.createWritable();
            console.log(`writable=${(writable !== null)}`);
            if (writable) {
                await writable.write(buffer);
                await writable.close();
                return strlen(buffer);
            }
            else {
                console.error("Create writable denied");
                return false;
            }
        }
        else {
            console.error(`Write access denied`);
            return false;
        }
    }
    catch(e) {
        console.error(e);
        return false;
    }
}


//console.log("filesystem loaded");


// End of file: filesystem.js
// ============================================================================

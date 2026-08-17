// ============================================================================
// Module      : ipc.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : IPC Inter-Process Communication
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

var ipc = {
	// collection : array of {
	//   dataType  : IPC data type,
	//   onmessage : function(message, isBackgroundMessage, isClickedMessage)
	//               return Promise 
	// } objects
	//
	collection : [],

	indexOf : function(dataType, strict = false) {
		for (var i = 0; i < ipc.collection.length; i++) {
			if (ipc.collection[i].dataType === dataType) {
				return i;
			}
		}
		if (! strict) {
			for (var i = 0; i < ipc.collection.length; i++) {
				if (ipc.collection[i].dataType === "*") {
					return i;
				}
			}
		}
		return -1;
	},

	unreg : function(dataType) {
		let idx = ipc.indexOf(dataType, true);
		if (idx >= 0) {
			ipc.collection.splice(idx,1);
		}
	},

	// onmessage           : function(message, isBackgroundMessage, isClickedMessage) 
	//                       return Promise 
	//
	// isBackgroundMessage : true = the message has been delivered in background
	// isClickedMessage    : true = the message has been clicked on statusbar
	//
	// message             : plain object { dataType:..., data:{...} }
	//
	// dataType            : IPC data type,
	// data                : DECODED message data
	//
	reg : function (dataType, onmessage)
	{
		ipc.unreg(dataType);
		ipc.collection.push({ dataType: dataType, onmessage: onmessage });
	},

	reset : function()
	{
		ipc.collection = [];
	},

	// message             : plain object { dataType:..., data:{...} }
	//
	// dataType            : IPC data type,
	// data                : DECODED message data
	//
	// isBackgroundMessage : true = the message has been delivered in background
	// isClickedMessage    : true = the message has been clicked on statusbar
	//
	onmessage : function (message, isBackgroundMessage = false, isClickedMessage = false)
	{
		return new Promise((resolve)=>{
			//console.info("IN ipc.onmessage()");
			//console.log (JSON.stringify(message));
			var dataType = message["dataType"];
			var idx = ipc.indexOf(dataType);
			//console.log(idx);
			if (idx >= 0) {
			    if (is_promise(ipc.collection[idx].onmessage)) {
				    ipc.collection[idx].onmessage(message,isBackgroundMessage,isClickedMessage).then((result)=>{
					    if (typeof result === "undefined") { result = true; }
				    	resolve(result);
				    });
			    }
				else {
				    delay(0).then(()=>{
				        var result = ipc.collection[idx].onmessage(message,isBackgroundMessage,isClickedMessage);
				        if (typeof result === "undefined") { result = true; }
				        resolve(result);
				    });
				}
			}
			else {
				resolve(false);
			}
		});
	}

};


// End of file: ipc.js
// ============================================================================

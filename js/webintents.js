// ============================================================================
//
// Module      : webintents.js
// Version     : 2.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Application webintents URL access point support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 05-Sep-24 00:00 WIT   Denis  Version 2.0  Ensure unicity of dataType for
//                              each application identified by a package_id
//
// ============================================================================

// ****************************************************************************
//
// url is expected to be formed as
//
// https://sites.google.com/view/radiahub?ap=[appid]&dt=[dataType]&d=[data]
//
// <------------physical URL------------>|<---app-->|<--dataType->|<-payload->
//                 |                           |            |          |
//                 |                           |            |          +--> Message data
//                 |                           |            |
//                 |                           |            +--> dataType
//                 |                           |
//                 |                           +--> Application ID
//                 |
//                 +--> As registered in AndroidManifest.xml
//
// example:
//
// https://sites.google.com/view/radiahub?ap=wmslite&dt=show&d=(payload_encode({sku: 1234567890123}))
// 
// dataType (dt) and data (d) parameters match the IPC message structure:
//
// `dataType` VARCHAR(30)  NOT NULL DEFAULT '', -- Data type
// `data`     BLOB NOT NULL,                    -- Payload-encoded data
//
// Use the functions webintents.create() and  webintents.createURL() to build 
// INTENT URLs
//
// webintents provides an IPC-like dispatcher to process webintent requests
// and can be generated and used by stand-alone applications
//
// ****************************************************************************

var webintents = {

	manifestURL : "https://sites.google.com/view/radiahub?ap=[appid]&dt=[dataType]&d=[data]", 


	// **************************************************************************
	// **************************************************************************
	//
	// Initialization
	//
	// **************************************************************************
	// **************************************************************************

	url : function(package_id, dataType, data)
	{
		var appid = package_id.slice(package_id.lastIndexOf(".") + 1);
		console.info("IN webintents.manifestURL() appid='" + appid + "' dataType='" + dataType + "'");
		console.log(JSON.stringify(data));
		var result = webintents.manifestURL;
		result = str_replace("[appid]", appid, result);
		result = str_replace("[dataType]", dataType, result);
		result = str_replace("[data]", payload_encode(data), result);
		console.log(result);
		return result;
	},


	// **************************************************************************
	// **************************************************************************
	//
	// Runtime
	//
	// **************************************************************************
	// **************************************************************************
	
	open : function(url) 
	{
		return new Promise(
			(resolve, reject)=>{
				
				console.info("IN webintents.open() url='" + url + "'");

				var dataType = evalUrl(url, "dt"), data = evalUrl(url, "d");
				console.log("dataType='" + dataType + "'");
				if (strlen(data) > 0) {
					data = payload_decode(data);
				}
				console.log(JSON.stringify(data));
				
				if (strlen(dataType) > 0) {

					var message = { dataType: dataType, data: data };
					console.log(JSON.stringify(message));

					ipc.onMessage(message, true, true)
					.then (()=>{
						resolve();
					})
					.catch(()=>{
						console.error("Rejected by ipc.onMessage()");
						reject();
					});

				}
				else {
					console.error("Resolve dataType returns null or empty");
					reject();
				}

			}
		);
	}

};


// End of file: webintents.js
// ============================================================================
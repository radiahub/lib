
// ============================================================================
// Module      : run.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : AJAX-based execution of server library function here
//               taylored for operation on  local/intranet connection
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

function run(function_name, arguments, libraries)
{
	return new Promise(
		(resolve, reject) => {

			if (typeof gateway   === "undefined") { gateway   = "ssdk"; }
			if (typeof libraries === "undefined") { libraries = [];     }
			if (typeof arguments === "undefined") { arguments = {};     }

			//console.info("IN run() function_name='" + function_name + "' arguments='" + JSON.stringify(arguments) + "' libraries='" + JSON.stringify(libraries) + "' gateway='" + gateway + "'");

			var local_ip = storage.get("mlog_local_ip");
			if (strlen(local_ip) > 0) {

				var url = "http://" + local_ip + "/api/"
								+ "runl.php"
								+ "?function="  + URLEncode(function_name)
								+ "&arguments=" + URLEncode(window.btoa(JSON.stringify(arguments)))
								+ "&libraries=" + URLEncode(window.btoa(JSON.stringify(libraries)));
				//console.log(url);

				new connect().get(url)
				.then ((data) => {
					try {
						//console.log(data);
						if (is_json(data)) { data = JSON.parse(data); }
						//console.log(JSON.stringify(data));
						if ((data !== null) && (parseInt("" + data.errno) === 1000)) {
							//console.log(data.result);
							resolve(data.result);
						}
						else {
							var msg = (data === null) ? "run request returned null" : "error " + String(data.errno) + ": " + String(data.errstr);
							//console.error(msg);
							reject();
						}
					}
					catch(e) {
						//console.error("Runtime exception in run()");
						//console.error(e);
						reject();
					}
				})
				.catch(() => { 
					//console.error("Rejected by new connect().get(url)");
					reject(); 
				});

			}
			else {
				//console.error("Resolve local_ip return null or empty value");
				reject();
			}
		}
	);

}

function runsync(function_name, arguments, libraries, gateway)
{
	if (typeof gateway   === "undefined") { gateway   = "ssdk"; }
	if (typeof libraries === "undefined") { libraries = [];     }
	if (typeof arguments === "undefined") { arguments = {};     }

	//console.info("IN runsync() function_name='" + function_name + "' arguments='" + JSON.stringify(arguments) + "' libraries='" + JSON.stringify(libraries) + "' gateway='" + gateway + "'");

	var local_ip = storage.get("mlog_local_ip");
	if (strlen(local_ip) > 0) {
		var url = "http://" + local_ip + "/api/"
						+ "runl.php"
						+ "?function="  + URLEncode(function_name)
						+ "&arguments=" + URLEncode(window.btoa(JSON.stringify(arguments)))
						+ "&libraries=" + URLEncode(window.btoa(JSON.stringify(libraries)));
		//console.log(url);
		try {
			var data = file2bin(url);
			if (is_json(data)) { data = JSON.parse(data); }
			//console.log(JSON.stringify(data));
			if ((data !== null) && (parseInt("" + data.errno) === 1000)) {
				return data.result;
			}
			else {
				//var msg = (data === null) ? "run request returned null" : "error " + String(data.errno) + ": " + String(data.errstr);
				//console.error(msg);
			}
		}
		catch(e) {
			//console.error("Runtime exception in runsync()");
		}
	}

	return null;
}


// End of file: run.js
// ============================================================================
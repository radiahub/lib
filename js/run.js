// ============================================================================
// Module      : run.js
// version     : 4.0R0.0
// PHP version : PHP 8+
//
// Author      : Denis Patrice <radiahub@gmail.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2026
//               All rights reserved
//
// Description : Run server script
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 31-Jul-26 00:00 WIT   Denis  Deployment V. 2016 "Pierre Dac"
//
// ============================================================================

// fname     : name of the PHP function to call
// fargs     : plain object of arguments to pass to the function at runtime
// libraries : array of URI pointing to PHP libraries to add using require_once
//
// run(fname, fargs, libraries).then((result)=>{
//   if (result !== ...){...} 
// });
//
function run (fname, fargs = {}, libraries = [])
{
    return new Promise((resolve)=>{

        //console.info("IN run() fname='" + fname + "'");

        const url = window.location.origin + "/run.php"
                  + "?f=" + fname
                  + "&a=" + payload_encode(fargs)
                  + "&l=" + payload_encode(libraries);

        //console.log(url);
        
        
        if (fname === "fcm_push") {
            console.log(url);
        }
        

        fetch(url)
        .then((response)=>{
            if (response.ok) {
                response.text().then((result)=>{
                    //console.log(result);
                    result = payload_decode(result);
                    //console.log(result);
                    resolve(result);
                });
            }
            else {
                //console.error("fetch response error");
                resolve(null);
            }
        })
        .catch(()=>{
            //console.error("Rejected by fetch()");
            resolve(null);
        });
        
    });
}


function runSync (fname, fargs = {}, libraries = [])
{
    //console.info("IN runSync() fname='" + fname + "'");
    try {
        const url = GATEWAY + "run.php"
                  + "?f=" + fname
                  + "&a=" + payload_encode(fargs)
                  + "&l=" + payload_encode(libraries);
        
        //console.log(url);
    
        var result = freadSync(url, false);
        result = payload_decode(result);
        //console.log(result);
        
        return result;
    }
    catch(e) {
        //console.error('Runtime exception');
        return null;
    }
}
	

// End of file: run.js
// ============================================================================

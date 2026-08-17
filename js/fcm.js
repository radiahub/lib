// ============================================================================
// Module      : fcm.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : FCM client
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

const fcm = {

    // ************************************************************************
    // ************************************************************************
    //
    // TOKEN REGISTRATION
    //
    // ************************************************************************
    // ************************************************************************

    reg : async function(token) {
        return new Promise((resolve)=>{
            const identifier = storage.get("identifier");
            console.info(`IN fcm.reg() identifier='${String(identifier)}'`);
            if ((identifier !== null) && (String(identifier).length > 0)) {
                var a = {
                    package_id : PACKAGE_ID,
                    identifier : identifier,
                    token      : token
                };
                run("fcm_reg", a).then((result)=>{
                    console.log(`Result fcm_reg()=${result}`);
                    resolve(result);
                });
            }
        });
    },


    // ************************************************************************
    // ************************************************************************
    //
    // INCOMING MESSAGES
    //
    // ************************************************************************
    // ************************************************************************
    
    onmessage : function(google_message) {
        return new Promise((resolve)=>{
            //console.log(google_message["data"]);
            console.info(`IN fcm.onmessage() Google messageId='${google_message.messageId}'`);
            //console.log (google_message["data"]["data"]);
            google_message["data"]["data"] = JSON.parse(window.atob(google_message["data"]["data"]));
            //console.log(google_message);
            var message = { dataType:google_message["data"]["dataType"], data:google_message["data"]["data"] };
            console.log(message);
            ipc.onmessage(message).then((result)=>{ resolve(result); });
        });
    },

    
    // ************************************************************************
    // ************************************************************************
    //
    // OUTGOING MESSAGES
    //
    // ************************************************************************
    // ************************************************************************

    push : function (token, dataType, data={}) {
        return new Promise((resolve)=>{
            console.info("IN fcm.push()");
            let f = "fcm_data";
            let a = {
                token    : token,
                dataType : dataType, 
                data     : data
            };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    notify : function (identifier, dataType, data={}, text="") {
        return new Promise((resolve)=>{
            console.info(`IN fcm.notify() identifier='${identifier}' text='${text}'`);
            let f = "fcm_notify";
            let a = {
                package_id : PACKAGE_ID,
                identifier : identifier, 
                dataType   : dataType, 
                data       : data, 
                text       : text
            };
            console.log(a);
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

				
    // ************************************************************************
    // ************************************************************************
    //
    // SELF TEST
    //
    // ************************************************************************
    // ************************************************************************

    selftest : function() {
        return new Promise((resolve)=>{
            console.info("IN fcm.selftest()");

            let timer = null;
            
            let identifier = storage.get("identifier");
            let name = storage.get("google_name");
            let picture = storage.get("google_picture");

            var onresponse = function(message) {
                console.info("IN fcm.selftest()->onresponse()");
                console.log(message);
                ipc.unreg("FCM_SELFTEST");
                clearTimeout(timer);
                timer = null;
                delay(0).then(()=>{ resolve(true); });
            };

            ipc.reg("FCM_SELFTEST", onresponse);

            var dataType = "FCM_SELFTEST";
            var data = {
                name    : name,
                picture : picture,
                time    : datetime.sql()
            };
            
            //console.log(dataType, data);
            
            fcm.notify (identifier, dataType, data, "Application FCM self test").then((result)=>{
                console.log(result);
                if (String(result?.errno) === "1000") {
                    timer = setTimeout(
                        function() {
                            console.error("Request timed out");
                            resolve(false);
                        },
                        10000
                    );
                }
                else {
                    console.error("FCM notify failed");
                    resolve(false);
                }
            });

        });
    }

};


// End of file: fcm.js
// ============================================================================

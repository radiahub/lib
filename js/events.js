// ============================================================================
// Module      : events.js
// Version     : 1.2
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : global
// Description : Centralized asynchronous event handlers
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

const events = {
    
    map: new Map(),
    
    reg: function(eventName, functionName, callback) {
        console.info(`IN events.reg(${eventName},${functionName})`);
        if (!events.map.has(eventName)) {
            events.map.set(eventName,new Map());
        }
        events.map.get(eventName).set(functionName,callback);
    },
    
    unreg: function(eventName, functionName = "") {
        console.info(`IN events.unreg(${eventName},${functionName})`);
        if (events.map.has(eventName)) {
            if (functionName.length > 0) {
                if (events.map.get(eventName).has(functionName)) {
                    events.map.get(eventName).delete(functionName);
                }
            }
            else {
                events.map.delete(eventName);
            }
        }        
    },
       
    on : function(eventName) {
        console.info(`IN events.on(${eventName})`);
        if (events.map.has(eventName)) {
            events.map.get(eventName).foreach((functionName, callback)=>{
                callback();
            });
        }
    },
    
    dump: function(eventName = "") {
        console.info(`IN events.dump(${eventName})`);
        let result = "";
        if (eventName.length > 0) {
            if (events.map.has(eventName)) {
                events.map.get(eventName).foreach((functionName, callback)=>{
                    if (result.length > 0) { result += "\n"; }
                    result += `${eventName}:${functionName}`;
                });
            }
        }
        else {
            events.map.foreach((eventName, mapobj)=>{
                mapobj.foreach(functionName, (callback)=>{
                    if (result.length > 0) { result += "\n"; }
                    result += `${eventName}:${functionName}`;
                });
            });
        }
        return result;
    }
    
}


// End of file: events.js
// ============================================================================

// ============================================================================
// Module      : pager.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : FCM-based Pager
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

/*
// Request from a_identifier to b_identifier
// Reply from b_identifier to a_identifier
//
const pager_message = {
    message_id : "pager_message_id",
    package_id : "package_id",
    identifier : "b_identifier",
    dataType   : "PAGER",
    data : {
        from : "a_identifier", 
        text : "notification_text"
    },
    text       : "notification_text"
};

const pager_message_reply = {
    message_id : "pager_message_id",
    package_id : "package_id",
    identifier : "a_identifier",
    dataType   : "RESP_PAGER_SUCCESS", // "RESP_PAGER_FAILED"
    data : {
        from : "b_identifier", 
        text : "notification_text"
    },
    text       : "notification_text"
};

// Location/viewpath link in pager text

#title:/location/page/?param1=123456&param2=7890
style: inline link

Examples:

#case 564-112-3284:/open/jaga/case_view/?reference=564-112-3284
#take over:/open/jaga/case_takeover/?reference=564-112-3284&email=radiahub@gmail.com
#register action:/open/jaga/case_action/?reference=564-112-3284&email=radiahub@gmail.com

can probably be fixed in UI using <link> tag

*/

const pager = new view('pager', '', '/lib/html/pager.html');

jQuery.extend(pager, {
    
    /*
    pager internal message structure:
        instant         : "2026-08-22 21:49:16",
        message_id      : "pager_message_id",
        from            : "a_identifier",
        text            : "notification_text",
        repliedDataType : "RESP_PAGER_SUCCESS", // "RESP_PAGER_FAILED"
        repliedText     : "reply_text"
    */
    messages : [],
    
    store : function () {
        return new Promise((resolve)=>{
            console.info(`IN pager.store()`);
            const map_id = `PAGER_${storage.get('identifier')}`;
        });        
    },
    
    load : function () {
        return new Promise((resolve)=>{
            console.info(`IN pager.load()`);
            const map_id = `PAGER_${storage.get('identifier')}`;
        });        
    },
    
    purge : function () {
        console.info(`IN pager.purge()`);
        const limit = datetime.subtract (8, "hours", moment(), true);
        let idx = -1;
        for (let i  = 0; i < pager.messages.length; i++) {
            if (pager.messages[i].instant >= limit) {
                console.log(`splice to message '${pager.messages[i].message_id}' ${pager.messages[i].instant}`);
                idx = i;
                break;
            }
        }
        if (idx > 0) {
            pager.messages.splice(0, idx);
        }
        else {
            pager.messages = [];
        }
    },
    
    indexOf : function (message_id) {
        console.info(`IN pager.indexOf() message_id='${message_id}'`);
        for (let i  = 0; i < pager.messages.length; i++) {
            if (pager.messages.message_id === message_id) {
                return i;
            }
        }
        return -1;
    },
    
    alert : function () {
        return new Promise((resolve)=>{
            console.info(`IN pager.alert()`);
        });
    },
    
    reply : function (message_id, mode = "success", text = "") {
        return new Promise((resolve)=>{
            console.info(`IN pager.reply() pager_message_id='${message_id}' mode='${mode}'`);
            console.log (text);
            const idx = pager.indexOf(message_id);
            if (idx >=0) {
                let dataType = "RESP_PAGER_SUCCESS";
                if (mode.toUpperCase() !== "SUCCESS") {
                    dataType = "RESP_PAGER_FAILED";
                }
                console.log(dataType);
                const data = {
                    from : storage.get(`identifier`), 
                    text : "text"
                };
                console.log(data);
                const a_identifier = messages[idx].from;
                console.log(a_identifier);
                fcm.notify(a_identifier, dataType, data, text).then((response)=>{
                    if (!response) {
                        console.error(`fcm.notify() resolved ${response}`);
                        resolve(false);
                    }
                    else {
                        messages[idx].repliedDataType = dataType;
                        messages[idx].repliedText = text;
                        console.log(messages[idx]);
                        resolve(true);
                    }                
                });
            }
            else {
                console.error(`Unknown message ${message_id}`);
                resolve(false);
            }
        });
    },
    
    onmessage : function (message, isBackgroundMessage = false, isClickedMessage = false) {
        return new Promise((resolve)=>{
            console.info(`IN pager.onmessage()`);
            console.log (message);
        });
    },
    
    
    // ************************************************************************
    // ************************************************************************
    //
    // Extend view UI
    //
    // ************************************************************************
    // ************************************************************************
    
    ontextlinkclicked : function (linkObj) {
        console.info(`IN ontextlinkclicked()`);
        let href = jQuery(linkObj).attr("href");
        viewpaths.open(href);
    }
    
});


// ****************************************************************************
// ****************************************************************************
//
// Initialization
//
// ****************************************************************************
// ****************************************************************************

if (typeof ipc !== "undefined") {
    ipc.reg("PAGER", pager.onmessage);
    ipc.reg("RESP_PAGER_SUCCESS", pager.onmessage);
    ipc.reg("RESP_PAGER_FAILED",  pager.onmessage);
    ipc.reg("ADMIN_REQUEST", pager.onmessage);
    ipc.reg("RESP_ADMIN_REQUEST_SUCCESS", pager.onmessage);
    ipc.reg("RESP_ADMIN_REQUEST_FAILED",  pager.onmessage);
}


// End of file: pager.js
// ============================================================================
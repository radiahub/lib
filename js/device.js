// ============================================================================
// Module      : device.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : global
// Description : Virtual device
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

const is_cordova = function() {
    return ((typeof cordova == "object") || (window.hasOwnProperty("cordova")));
};

function browser() {
    //console.info("IN browser()");
    let name = "Webview";
    let version = "Unknown";

    if (is_cordova()) {
        name = "Cordova Webview";
        version = device.cordova;
    }
    else {
        let userAgent = navigator.userAgent;
        //console.log(userAgent);
        if (userAgent.indexOf("Edg") > -1) {
            name = "Microsoft Edge";
            //version = userAgent.match(/Edg\/([\d.]+)/)[1];
        } 
        else if (userAgent.indexOf("Chrome") > -1) {
            name = "Chrome";
            version = userAgent.match(/Chrome\/([\d.]+)/)[1];
        } 
        else if (userAgent.indexOf("Firefox") > -1) {
            name = "Firefox";
            version = userAgent.match(/Firefox\/([\d.]+)/)[1];
        } 
        else if (userAgent.indexOf("Safari") > -1) {
            name = "Safari";
            version = userAgent.match(/Version\/([\d.]+).*Safari/)[1];
        } 
        else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
            name = "Opera";
            version = userAgent.match(/(Opera|OPR)\/([\d.]+)/)[2];
        } 
        else if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {
            name = "Internet Explorer";
            version = userAgent.match(/(MSIE |rv:)([\d.]+)/)[2];
        }
    }

    let result = {name: name, version: version};
    //console.log(result);
    return result;
}

function platform() {
    let result = "unknown";
    if (is_cordova()) {
        result = "Cordova";
    }
    else {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        result = (manifestLink !== null) ? "PWA" : "Browser";
    }
    return result;
}

function JavascriptVersion() {
    //console.info("IN JavascriptVersion()");
    let version = undefined;

    if (String.prototype.trim) {
        version = 5;
        if (Array.prototype.map) {
            version = 6;
            if (Array.prototype.includes) {
                version = 7;
                if (Object.values) {
                    version = 8;
                    if (Promise.prototype.finally) {
                        version = 9;
                        if (Array.prototype.flat) {
                            version = 10;
                            if (String.prototype.matchAll) {
                                version = 11;
                                if (String.prototype.replaceAll) {
                                    version = 12;
                                    if (Object.hasOwn) {
                                        version = 13;
                                        if (Array.prototype.toSorted) {
                                            version = 14;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (version) {
    return "1." + version;
    } 
    else {
        return "unknown";
    }

}

if (typeof device === "undefined") {

    let brInfo = browser();

    let store_device_variable = PACKAGE_ID + "_uuid";
    store_device_variable = str_replace(".", "_", store_device_variable);
    let myUUID = storage.get(store_device_variable);
    if (myUUID === null) {
        console.log("Generating UUID");
        myUUID = unique_id();
        storage.set(store_device_variable, myUUID);
    }

    let device = {
        model        : brInfo["name"],
        platform     : platform(),
        uuid         : myUUID,
        version      : brInfo["version"],
        manufacturer : "",
        isVirtual    : true,
        serial       : "",
        sdkVersion   : JavascriptVersion()
    };

    window.device = device;
}

//console.log(device);
//console.log(window.device);


// End of file: device.js
// ============================================================================

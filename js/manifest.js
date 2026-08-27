// ============================================================================
// Module      : manifest.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : generic
// Description : generate application manifest
//               ideally called from within a <script type="module"... object
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Sep-26 00:00 WIT   Denis  Deployment V. 2026 "Alexandre Dumas"
//
// ============================================================================

const manifest = function (fullname, shortname, accent_color = "#1289FD", description = "", icon_512 = "") {
    return new Promise((resolve)=>{
        
        console.info(`IN manifest('${fullname}')`);
        
        const manifest_ = {
            "name"             : fullname,
            "short_name"       : shortname,
            "theme_color"      : accent_color,
            "background_color" : accent_color,
            "display"          : "standalone",
            "scope"            : "",
            "start_url"        : "https://" + fullname,
            "description"      : description,
            "icons": [
                {
                    "src"   : icon_512,
                    "sizes" : "512x512"
                }
            ]
        };
        
        // Convert JSON to base64 data URL
        const manifestString  = JSON.stringify(manifest_);
        const manifestBase64  = btoa(unescape(encodeURIComponent(manifestString)));
        const manifestDataUrl = "data:application/json;base64," + manifestBase64;
        
        // Inject into <head>
        const link = document.createElement("link");
        link.rel = "manifest";
        link.href = manifestDataUrl;
        document.head.appendChild(link);
        
        delay(100).then(()=>{
            console.log("Stand alone app manifest registered");
            resolve(true);
        });
        
    });
}


// End of file: manifest.js
// ============================================================================
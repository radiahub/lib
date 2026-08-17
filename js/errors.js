// ============================================================================
// Module      : errors.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Error definitions
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================


//alert("loading and initializing errors");


let errors = {
        
    collection: [],
        
    indexOf : function(error_id) {
        //console.info("IN E.errors.indexOf() error_id='" + String(error_id) + "'");
        for (let i = 0; i < this.collection.length; i++) {
            if (E.errors.collection[i]["id"] === String(error_id)) {
                return i;
            }
        }
        return -1;
    },
        
        get : function(error_id)
        {
            //console.info("IN E.errors.get() error_id='" + String(error_id) + "'");
            let idx = this.indexOf(error_id);
            if (idx >= 0) {
                return this.collection[idx];
            }
            else {
                return null;
            }
        },
        
        text: function(error_id) {
            //console.info("IN E.errors.text() error_id='" + String(error_id) + "'");
            var idx = this.indexOf(error_id);
            if (idx >= 0) {
                return this.collection[idx]["text"];
            }
            else {
                return "";
            }
        },
        
        init: function() {
            //console.info("IN E.errors.init()");
            let filename = "/lib/errors.json";
            let json = freadSync(filename, true);
            if (json) {
                Object.assign(E.errors.collection, json);
                return true;
            }
            else {
                return false;
            }
        }
};


// End of file: errors.js
// ============================================================================

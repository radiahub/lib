// ============================================================================
// Module      : users.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Users
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Sep-26 00:00 WIT   Denis  Deployment V. 2026 "Alexandre Dumas"
//
// ============================================================================

const whoami = function() {
    let identifier = storage.get(`primaryEmail`);
    console.info(`IN whoami() identifier='${String(identifier)}'`);
    if (strlen(identifier) > 0) {
        return identifier;
    }
    return null;
}

const registerUser = function(email, name, picture, as_current_user = false) {
    return new Promise((resolve)=>{
        console.info(`IN registerUser() email='${email}' name='${name}' picture='${picture}'`);
        
        if (as_current_user) {
            storage.set(`primaryEmail`, email);
            storage.set(`displayName`,  name);
            storage.set(`pictureURI`,   picture);
        }
        
        const row = {
            displayName: name,
            pictureURI : picture
        };
        //console.log(row);
        const loc = {
            primaryEmail: email
        };
        //console.log(loc);
        xdbref.set("radiahub", "users", row, loc).then((result)=>{
            //console.log(result);
            resolve(result);
        });
    });
};


// End of file: users.js
// ============================================================================

// ============================================================================
// Module      : auth-google.js
// Version     : 4.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : Generic
// Description : Trivial file cache
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 31-Jul-26 00:00 WIT   Denis  Deployment V. 2026 "Pierre Dac"
//
// ============================================================================

const auth = new view('auth', '', '/lib/html/auth.html');

jQuery.extend(auth, {
    
});

const login_with_google = function (pageURI) {
    return new Promise((resolve)=>{
        console.info(`IN login_with_google() pageURI='${pageURI}'`);
        exec("auth", {}, pageURI).then((result)=>{
            console.log(result);
            delay(0).then(()=>{
                console.log(whoami());
                resolve(result);
            });
        });
    });
};


// End of file: auth-google.js
// ============================================================================
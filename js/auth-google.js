// ============================================================================
// Module      : auth-google.js
// Version     : 4.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : Generic
// Description : Login with Google
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 31-Jul-26 00:00 WIT   Denis  Deployment V. 2026 "Pierre Dac"
//
// ============================================================================

const auth = new view('auth', '', '/lib/html/auth.html');

jQuery.extend(auth, {
    
    authenticate : function () {
        
        if (!google?.accounts?.id) {
            alert("Google Identity Services library not loaded");
            auth.failed();
        }
        
        try {
            
            const DEVELOPER_CLIENT_ID = '526889796130-7jm34btcio33q2d2t7o9li53fo6jlogd.apps.googleusercontent.com';
            let theme_id = 'light';
            
            if (typeof theme !== "undefined") {
                theme_id = theme.currentThemeID;
            }
            
            const handleCredentialResponse = function(response) {
              //fetch('http://localhost:8080/auth-google.php', {
                fetch('https://radiahub.22web.org/auth-google.php', {
                    method  : 'POST',
                    headers : { 'Content-Type': 'application/json' },
                    body    : JSON.stringify({ token: response.credential })
                })
                .then(res => res.text())
                .then(data => {
                    console.log(data);
                    if (is_json(data)) {
                        data = JSON.parse(data);
                    }
                    users.registerUser(data.email, data.name, data.picture, true).then((res)=>{
                        if (res === false) {
                            console.error(`rejected by users.registerUser()`); 
                            auth.failed();
                        }
                        else {
                            auth.success(data.email);
                        }
                    });
                })
                .catch((err)=>{
                    console.error("Error sending token to backend", err);
                    auth.failed();
                });
                
            }
    
            google.accounts.id.initialize({
                client_id : DEVELOPER_CLIENT_ID,
                callback  : handleCredentialResponse
            });
            
        } 
        catch(e) {
            console.error(e);
        }
        
        google.accounts.id.renderButton(
            document.getElementById("BTN_AUTH_GOOGLE"),
            { theme: "outline", size: "large", theme: theme_id }
        );
        
    },
    
    onshow : function () {
        console.log(`IN auth.onshow() view_id='${this.view_id}'`);
        
        this.onthemechanged();
        events.reg(`themechanged`, `${this.view_id}.onthemechanged`, this.onthemechanged);
        
        this.onviewportresize();
        events.reg(`viewportresize`, `${this.view_id}.onviewportresize`, this.onviewportresize);
        
        jQuery(`#BTN_SKIP_GOOGLE_AUTH`).off(`click`).on(`click`, function(){
            ripple(`BTN_SKIP_GOOGLE_AUTH`, function() {
                auth.success(`anonymous`);
            });
        });
        
        authenticate();
    }
});

const login_with_google = function (pageURI = "") {
    return new Promise((resolve)=>{
        
        let identifier = whoami();
        console.info(`IN login_with_google() pageURI='${pageURI}' identifier='${String(identifier)}'`);
    
        if (strlen(identifier) > 0) {
            resolve(identifier);
        }
        else {        
            exec("auth", {}, pageURI).then((result)=>{
                console.log(result);
                delay(0).then(()=>{
                    console.log(whoami());
                    resolve(result);
                });
            });
        }
        
    });
};


// End of file: auth-google.js
// ============================================================================
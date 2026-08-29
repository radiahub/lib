// ============================================================================
// Module      : dialogs.js
// Version     : 4.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Implements default interaction dialogs
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Pierre Dac"
//
// ============================================================================

/*
 * Toast
 * 
 */
const toast = function (message, type = 'info', position = 'bottom', image = '', duration = duration_normal) {
    
    //console.log(`IN toast() duration=${duration}`);
    
    const container_id = 'toast-container-' + position;
    if (!DOMExists(container_id)) {
        let toastHtml = ui.load("/lib/html/dialogs.html", "toast");
        jQuery(document.body).append(toastHtml);
    }
    
    const container = document.getElementById(container_id);
    
    // 1. Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 2. Set internal structural markup
    let toastHtml = document.getElementById('divtpl-toast').innerHTML;
    if (image.length > 0) {
        toastHtml = toastHtml.replaceAll(`[image]`, image);
    }
    else {
        toastHtml = ui.html_strip_section(toastHtml, "image");
    }
    
    toastHtml = toastHtml.replaceAll(`[message]`, message);
    toast.innerHTML = toastHtml;
    
    // 3. Append to target wrapper
    container.appendChild(toast);
    
    // Function to safely animate and remove node
    const dismissToast = ()=>{
        toast.classList.add('hide');
        // Wait for CSS fadeOut animation to finish before removing DOM node
        toast.addEventListener('animationend', ()=>{
            toast.remove();
        });
    };
    
    // 4. Auto-dismiss timer
    const autoCloseTimeout = setTimeout(dismissToast, duration);
    
    // 5. Manual dismissal listener
    jQuery('.toast-close').on('click', function() {
        ripple(this, function() {
            clearTimeout(autoCloseTimeout);
            dismissToast();
        });
    });
}

/*
 * Alert
 * 
 */
const alert = function (message = '', title = '', btnOK = 'CLOSE') {
    return new Promise((resolve)=>{
        
        if ((message.length === 0) && (title.length === 0)) {
             return resolve(false);
        }
        
        const container_id = 'alert-container';
        if (DOMExists(container_id)) {
            return resolve(false);
        }
        
        let contHtml = ui.load("/lib/html/dialogs.html", "alert");
        //E.html(contHtml);
        
        if (title.length > 0) {
            contHtml = str_replace("[title]", title, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_title");
        }
        
        if (message.length > 0) {
            contHtml = str_replace("[message]", message, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_message");
        }
        
        contHtml = str_replace("[btn-prompt-ok]", btnOK, contHtml);
        jQuery(document.body).append(contHtml);
        
        const hide = function() {
            unreg_back_button_callback();
            document.getElementById(container_id).remove();
        };
        
        const success = function() {
            hide();
            resolve(true);
        };
        
        const failed = function() {
            hide();
            resolve(false);
        };
        
        reg_back_button_callback(failed);
        
        jQuery(`#BTN_PROMPT_OK`).off("click").on("click", function(){
            ripple(this, function() {
                success();
            });
        });
        
    });
}

/*
 * Confirm
 * 
 */
const confirm = function (message = '', title = '', btnOK = 'OK', btnCancel = 'CANCEL') {
    return new Promise((resolve)=>{
        
        if ((message.length === 0) && (title.length === 0)) {
             return resolve(false);
        }
        
        const container_id = 'confirm-container';
        if (DOMExists(container_id)) {
            return resolve(false);
        }

        let contHtml = ui.load("/lib/html/dialogs.html", "confirm");
        //E.html(contHtml);
        
        if (title.length > 0) {
            contHtml = str_replace("[title]", title, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_title");
        }
        
        if (message.length > 0) {
            contHtml = str_replace("[message]", message, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_message");
        }
        
        contHtml = str_replace("[btn-prompt-ok]", btnOK, contHtml);
        contHtml = str_replace("[btn-prompt-cancel]", btnCancel, contHtml);
        jQuery(document.body).append(contHtml);
        
        const hide = function() {
            unreg_back_button_callback();
            document.getElementById(container_id).remove();
        };
        
        const success = function() {
            hide();
            resolve(true);
        };
        
        const failed = function() {
            hide();
            resolve(false);
        };
        
        reg_back_button_callback(failed);
        
        jQuery(`#BTN_PROMPT_OK`).off("click").on("click", function(){
            ripple(this, function() {
                success();
            });
        });
        
        jQuery(`#BTN_PROMPT_CANCEL`).off("click").on("click", function(){
            ripple(this, function() {
                failed();
            });
        });
        
    });
}

/*
 * Prompt
 * 
 */
const prompt = function (message = '', title = '', type = 'text', value = '', decimals = 0, btnOK = 'OK', btnCancel = 'CANCEL') {
    return new Promise((resolve)=>{
        
        if ((message.length === 0) && (title.length === 0)) {
             return resolve(false);
        }
        
        const container_id = 'prompt-container';
        if (DOMExists(container_id)) {
            return resolve(false);
        }

        let contHtml = ui.load("/lib/html/dialogs.html", "prompt");
        //E.html(contHtml);
        
        if (title.length > 0) {
            contHtml = str_replace("[title]", title, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_title");
        }
        
        if (message.length > 0) {
            contHtml = str_replace("[message]", message, contHtml);
        }
        else {
            contHtml = ui.html_strip_section(contHtml, "dialog_message");
        }
        
        switch (type.toLowerCase()) {
            case 'string':
            case 'text'  : {
                contHtml = ui.html_strip_section(contHtml, "dialog_numeric_input");
                break;
            }
            case 'numeric':
            case 'number' : 
            case 'num'    : {
                contHtml = ui.html_strip_section(contHtml, "dialog_text_input");
                break;
            }
        }
        
        contHtml = str_replace("[value]", value, contHtml);
        contHtml = str_replace("[decimals]", decimals, contHtml);
        contHtml = str_replace("[btn-prompt-ok]", btnOK, contHtml);
        contHtml = str_replace("[btn-prompt-cancel]", btnCancel, contHtml);
        jQuery(document.body).append(contHtml);
        
        const hide = function() {
            unreg_back_button_callback();
            document.getElementById(container_id).remove();
        };
        
        const success = function() {
            var result = jQuery(`#inp-prompt`).val();
            switch (type.toLowerCase()) {
                case 'numeric':
                case 'number' : 
                case 'num'    : {
                    result = str_replace(thousandsSeparator(), "",  result);
                    result = str_replace(decimalsSeparator (), ".", result);
                    if (decimals > 0) {
                        result = parseFloat(result).toFixed(decimals);
                    }
                    else {
                        result = parseInt(result);
                    }
                    break;
                }
            }
            hide();
            resolve(result);
        };
        
        const failed = function() {
            hide();
            resolve(false);
        };
        
        reg_back_button_callback(failed);
        
        jQuery(`#BTN_PROMPT_OK`).off("click").on("click", function(){
            ripple(this, function() {
                success();
            });
        });
        
        jQuery(`#BTN_PROMPT_CANCEL`).off("click").on("click", function(){
            ripple(this, function() {
                failed();
            });
        });
        
        delay(0).then(()=>{
            jQuery(`#inp-prompt`).focus();
        });
        
    });
}

/*
 * Connect
 * 
 */
const connect = function () {
    return new Promise((resolve)=>{
        
        console.info(`IN connect()`);
        
        const iterate = function() {
            connected().then((result)=>{
                console.log(`connected=${result}`);
                if (result) {
                    resolve(true);
                }
                else {
                    confirm(R.get('no_connect_text'), R.get('no_connect_title'), R.get('retry'), R.get('cancel')).then((result)=>{
                        console.log(result);
                        if (result) {
                            iterate();
                        }
                        else {
                            resolve(false);
                        }
                    });
                }
            });
        };            
        
        iterate();
    });
};

/*
 * Login with Google
 * 
 */
const auth_google = function(icon_512 = "/default_512x512.png", logo = "/lib/img/logo_400_bg_light.png", title = "", message = "", about_href = "") {
    return new Promise((resolve)=>{
    
        console.info("IN auth_google()");
        
        about_href = str_replace("/?=", "?=", about_href);

        // For testing only
        //
        storage.del("primaryEmail");

        var email = storage.get("primaryEmail");
        if (strlen(email) > 0) {
            resolve(true);
        }
        else {
            
            const container_id = "auth_google_container";        
            const contUrl = globalizedFileUri("/lib/html/auth_google.html");
            let contHtml  = ui.load(contUrl);
    
            contHtml = str_replace("[icon_512]", icon_512, contHtml);
            contHtml = str_replace("[logo]", logo, contHtml);
            if (title.length > 0) {
                contHtml = str_replace("[title]", title, contHtml);
            }
            else {
                contHtml = ui.html_strip_section(contHtml, "title");
            }

            if (message.length > 0) {
                contHtml = str_replace("[message]", message, contHtml);
            }
            else {
                contHtml = ui.html_strip_section(contHtml, "message");
            }

            contHtml = str_replace("[about_href]", about_href, contHtml);
            jQuery(document.body).append(contHtml);
            delay(0).then(()=>{
                
                const hide = function() {
                    events.unreg(`themechanged`, onthemechanged);
                    unreg_back_button_callback();
                    document.getElementById(container_id).remove();
                };
                
                const DEVELOPER_CLIENT_ID = '526889796130-7jm34btcio33q2d2t7o9li53fo6jlogd.apps.googleusercontent.com';
                
                try {
                    const handleCredentialResponse = function(response) {
                      fetch('http://localhost:8080/auth-google.php', {
                      //fetch('http://192.168.222.102:8080/auth-google.php', {
                      //fetch('https://radiahub.22web.org/auth-google.php', {
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
                            registerUser(data.email, data.name, data.picture, true).then((res)=>{
                                if (res === false) {
                                    console.error(`rejected by users.registerUser()`);
                                    hide();
                                    resolve(false);
                                }
                                else {
                                    hide();
                                    resolve(true);
                                }
                            });
                        })
                        .catch((err)=>{
                            console.error("Error sending token to backend", err);
                            hide();
                            resolve(false);
                        });
                    };
    
                    google.accounts.id.initialize({
                        client_id : DEVELOPER_CLIENT_ID,
                        callback  : handleCredentialResponse
                    });
    
                }
                catch(e) {
                    console.error(e);
                }
    
                const onthemechanged = function() {
                    if (typeof theme !== "undefined") {
                        let src = jQuery("#IMG_AUTH_GOOGLE_LOGO").attr("src");
                        src = strParseTheme(src);
                        jQuery("#IMG_AUTH_GOOGLE_LOGO").attr("src", src);
                    }
                    document.getElementById("DIV_TARGET_GOOGLE_LOGIN").innerHTML = "";
                    let theme_id = 'light';
                    if (typeof theme !== "undefined") {
                        theme_id = theme.currentThemeID;
                    }
                    let google_theme_id = (theme_id === "light") ? "outline" : "filled_black";
                    google.accounts.id.renderButton(
                        document.getElementById("DIV_TARGET_GOOGLE_LOGIN"),
                        { theme: google_theme_id, size: "large" }
                    );
                };
                
                onthemechanged();
                events.reg(`themechanged`, onthemechanged);
                
                const failed = function() {
                    hide();
                    resolve(false);
                };
                
                reg_back_button_callback(failed);
            
                jQuery("#BTN_AUTH_GOOGLE_MORE").off("click").on("click", function() {
                    ripple("BTN_AUTH_GOOGLE_MORE", function() {
                        jQuery("#DIV_AUTH_GOOGLE_MENU").show();
                    });
                });
                
                jQuery("#DIV_AUTH_GOOGLE_MENU").off("click").on("click", function() {
                    jQuery("#DIV_AUTH_GOOGLE_MENU").hide();
                });
          
                dispatcher.animate("auth_google_container");
                
            });
            
        }
        
    });
};



// End of file: dialogs.js
// ============================================================================

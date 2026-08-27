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


// End of file: dialogs.js
// ============================================================================

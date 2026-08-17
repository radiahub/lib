// ============================================================================
// Module      : statesSPA.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Implements states and navigation
//               in Single Page Application
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// BACK BUTTON NAVIGATION
//
// ****************************************************************************
// ****************************************************************************

var mobileExitRequested = false;

const mobileExit = function() {
    //console.info(`IN mobileExit()`);
    const terminate = function() {
        //alert(`IN terminate()`);
        history.go(-2);
    };
    if (E) {
        if (mobileExitRequested) {
            terminate();
        }
        else {
            mobileExitRequested = true;
            delay(0).then(()=>{
                E.show(true);
                E.write("warn", ["Mobile exit requested"]);
            });
        }
    }
    else {
        terminate();
    }
};

var back_button_callback = null;

const reg_back_button_callback = function(F) {
    if (typeof F === "function") {
        back_button_callback = F;
    }
}

const unreg_back_button_callback = function() {
    back_button_callback = null;
}

const onbackbutton = function() {
    console.info(`IN onbackbutton()`);
    console.log(typeof back_button_callback);
    if (typeof back_button_callback === "function") {
        back_button_callback();
        delay(0).then(()=>{
            unreg_back_button_callback();
        });
    }
    else {
        const topView = view_on_top();
        if (topView.length > 0) {
            const obj = object(topView);
            if (obj) {
                obj.onbackbutton();
                delay(0).then(()=>{
                    let dum = view_on_top();
                    if (dum.length === 0) {
                        mobileExit();
                    }
                });
            }
            else {
               mobileExit(); 
            }
        }
        else {
            mobileExit();
        }
    }
};


// ****************************************************************************
// ****************************************************************************
//
// HISTORY STATES EVENTS LISTENERS
//
// ****************************************************************************
// ****************************************************************************

const historyUrl = function(args) {
    let url = new URL(HREF);
    for (p in args) { 
        url.searchParams.set(p, args[p]); 
    }
    console.log(url.toString()); 
    return url.toString();
}

// Initial state
// history.replaceState({ page: 1 }, "", "?page=1");
history.replaceState({ page: 1 }, "", historyUrl({ page: 1 }));

// Flag to prevent infinite loops
let handlingPop = false;

// popstate event handler
window.addEventListener("popstate", function (event) {
    if (handlingPop) return; // Prevent re-entry
    
    handlingPop = true;
    //alert(`popstate fired ${JSON.stringify(event.state)}`);
    console.warn(`popstate fired ${JSON.stringify(event.state)}`);

    // Push a new state when user navigates back/forward
    const newPage = (event.state?.page || 1) + 1;
    // history.pushState({ page: newPage }, "", "?page=" + newPage);
    history.pushState({ page: newPage }, "", historyUrl({ page: newPage }));
    
    //alert(`Pushed new state ${JSON.stringify({ page: newPage })}`)
    console.warn(`Pushed new state ${JSON.stringify({ page: newPage })}`)
    onbackbutton();
    
    // Allow future popstate handling
    setTimeout(() => { handlingPop = false; }, 0);
});

// Manual pushState on user action
const pushState = function(force = false) {
    let okcont = true;
    const currentPage = history.state?.page || 1;
    if (force || (currentPage <= 1)) {
        const nextPage = currentPage + 1;
        //history.pushState({ page: nextPage }, "", "?page=" + nextPage);
        history.pushState({ page: nextPage }, "", historyUrl({ page: nextPage }));
        console.warn(`Manually pushed new state ${JSON.stringify({ page: nextPage })}`)
        //alert(`Manually pushed new state ${JSON.stringify({ page: nextPage })}`)
    }
}


// End of file: statesSPA.js
// ============================================================================

// ============================================================================
// Module      : views.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Implements view class
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// DOM UTILS
//
// ****************************************************************************
// ****************************************************************************

const view_all = function() {
    //console.info(`IN view_all()`);
    result = [];
    
    jQuery(".view").each(function(n,elt) {
        let id = jQuery(elt).attr("id");
        //console.log(id);
        result.push(id);
    });
    
    return result;
};

const view_on_top = function() {
    //console.info(`IN view_on_top()`);
    let views = view_all();
    if (views.length > 0) {
        for (let i = views.length - 1; i >= 0; i--) {
            if (!jQuery(`#${views[i]}`).hasClass('hidden')) {
                return views[i];
            }
        }
        return "";
    }
    else {
        return "";
    }
};

const view_entry_point = function() {
    console.info(`IN view_entry_point()`);
    let views = view_all();
    if (views.length > 0) {
        for (let i = 0; i < views.length; i++) {
            if (!jQuery(`#${views[i]}`).hasClass('hidden')) {
                return views[i];
            }
        }
    }
    return "";
};

const bring_to_front = function(view_id) {
    //console.info(`IN bring_to_front() view_id='${view_id}'`);
    const views = view_all();
    for (let i = views.length - 1; i >= 0; i--) {
        if (views[i] === view_id) {
            jQuery(`#${view_id}`).removeClass('hidden');
            jQuery(`#${view_id}`).show();
            break;
        }
        else {
            let obj = object(views[i]);
            if (obj) { obj.remove(); }
        }
    }
};

const rewind = function() {
    console.info(`IN rewind()`);
    const view_id = view_entry_point();
    console.log (`resolved view_id='${view_id}'`);
    if (strlen(view_id) > 0) {
        bring_to_front(view_id);
    }
}

const dump_views = function() {
    let viewTop = view_on_top();
    let result = [];
    let views = view_all();
    return {
        top: viewTop,
        all: views
    };
};


// ****************************************************************************
// ****************************************************************************
//
// VIEWS RENDERING
//
// ****************************************************************************
// ****************************************************************************

/*
 * UI view renderer
 *
 */
const render = function(view_id) {
    console.info(`IN render() view_id='${view_id}'`);
    let obj = object(view_id);
    if (obj) {
        if (DOMExists(view_id)) {
            bring_to_front(view_id);
        }
        else {
            obj.show();
        }
    }
    else {
        console.error(`no such object: '${view_id}'`);
    }
};

/*
 * Open a view
 *
 */
const open = function(view_id, options = {}) {
    console.info(`IN open() view_id='${view_id}'`);
    const obj = object(view_id);
    if (obj) {
        obj.args(options);
        delay(0).then(()=>{ render(view_id); });
    }
    else {
        console.error(`no such object: '${view_id}'`);
    }
};

/*
 * Open a view as modal dialog
 * Uses Promise-based async interactive  API
 *
 */
const exec = function(view_id, options = {}, pageURI = "") {
    return new Promise((resolve)=>{
        console.info(`IN exec() view_id='${view_id}'`);
        
        const onsuccess = function(value) {
            delay(0).then(()=>{ resolve(value); });
        };
        
        const onfailed = function() {
            delay(0).then(()=>{ resolve(false); });
        };
        
        const obj = object(view_id);
        if (obj) {
            if (!obj.visible()) {
                obj.reset(onsuccess, onfailed, options);
                if (strlen(pageURI) > 0) {
                    obj.setpage(pageURI).then(()=>{
                        obj.show();
                    });
                }
                else {
                    delay(0).then(()=>{ obj.show(); });
                }
            }
            else {
                console.error(`object '${view_id}' already on UI`);
                onfailed();
            }
        }
        else {
            console.error(`no such object: '${view_id}'`);
            onfailed();
        }
        
    });
};


// ****************************************************************************
// ****************************************************************************
//
// DISPATCHER
//
// ****************************************************************************
// ****************************************************************************

/*
let href = /open/refresh_map/?map=home.map&time=now
           <---location----><---URLSearchParams--->
*/

const dispatcher = {

    // collection : array of { path=..., callback=... } objects
    // callback   : function(href) {return new Promise(()=>{...});
    //
    collection : [],
    
    format : function (path) {
        if (path.slice(0, 1) !== "/") { path = "/" + path; }
        if (path.slice(strlen(path) - 1) !== "/") { path += "/"; }
        return path;
    },
    
    indexOf: function (path, strict = false) {
        path = dispatcher.format(path);
        for (let i = 0; i < dispatcher.collection.length; i++) {
            if (dispatcher.collection[i]["path"] === path) {
                return i;
            }
        }
        if (strict) {
            return -1;
        }
        else {
            const tokens = path.split("/").filter(Boolean);
            const first_one = dispatcher.format(tokens.at(0));
            for (let i = 0; i < dispatcher.collection.length; i++) {
                if (dispatcher.collection[i]["path"] === first_one) {
                    return i;
                }
            }
        }
        return -1;
    },
    
    get : function (path, strict = false) {
        path = dispatcher.format(path);
        let idx = dispatcher.indexOf(path, strict);
        if (idx >= 0) {
            return dispatcher.collection[i]["callback"];
        }
    },
    
    reg : function (path, callback) {
        // console.info(`IN dispatcher.reg() path='${path}'`);
        path = dispatcher.format(path);
        // console.log(path);
        if (typeof callback === "function") {
            let idx = dispatcher.indexOf(path, true);
            if (idx >= 0) {
                dispatcher.collection[idx]["callback"] = callback;
            }
            else {
                dispatcher.collection.push({
                    path : path,
                    callback: callback
                });
            }
        }
    },

    unreg : function (path) {
        path = dispatcher.format(path);
        let idx = dispatcher.indexOf(path, true);
        if (idx >= 0) {
                dispatcher.collection.splice(idx, 1);
        }
    },

    execute : function (href) {
        console.info(`IN dispatcher.execute() href='${href}'`);
        
        let url = new URL(href, window.location.origin);
        const path = dispatcher.format(url.pathname);
        //console.log(path);
        const search = new URLSearchParams(url.search);
        const params = Object.fromEntries(search);
        console.log(params);
        let idx = dispatcher.indexOf(path, false);
        console.log(idx);
        if (idx >= 0) {
            dispatcher.collection[idx]["callback"](href);
        }
    },

    animate : function (eltID) {
        console.info(`IN dispatcher.animate() eltID='${eltID}'`);
        jQuery(`#${eltID} .dispatcher`).off("click").on("click", function() {
            const that = this;
            //console.log(jQuery(that));
            ripple(that, function() {
                const href = jQuery(that).attr("href");
                if (strlen(href) > 0) {
                    dispatcher.execute(href);
                }
            });
        });
    },
   
    makehref : function (path, args={}) {
        path = dispatcher.format(path);
        console.info(`IN dispatcher.makehref() path='${path}'`);
        console.log(args);
        if (Object.keys(args).length > 0) {
            const searchParams = new URLSearchParams(args);
            console.log(searchParams.toString());
            const url = URL(path);
            url.search = searchParams.toString();
            console.log(url.href);
            return url.href;
        }
        return path;
    }
    
};

dispatcher.reg(`/open/`, function(href) {
    console.info(`IN /open/ execution href='${href}'`);
    const url = new URL(href, window.location.origin);
    const path = url.pathname;
    //console.log(path);
    const tokens = path.split("/").filter(Boolean);
    const view_id = tokens.at(1);
    console.log(view_id);
    const search = new URLSearchParams(url.search);
    const options = Object.fromEntries(search);
    console.log(options);
    open(view_id, options);
});


// ****************************************************************************
// ****************************************************************************
//
// CLASS "VIEW" IMPLEMENTATION
//
// ****************************************************************************
// ****************************************************************************

const viewHtml = `
<div id="[view_id]" class="view bg-transparent overflow-none" style="position:absolute; top:0; left:0; width:100%; height:100%;">
[html]
</div>
`;

class view {

    // ************************************************************************
    // ************************************************************************
    //
    // INITIALIZATION
    //
    // ************************************************************************
    // ************************************************************************

    constructor(view_id, contentHTML = "", contentURI = "", onsuccess = null, onfailed = null) {
        this.view_id     = view_id;
        this.contentHTML = contentHTML;
        this.contentURI  = contentURI;
        this.onsuccess   = onsuccess;
        this.onfailed    = onfailed;
        this.options     = {};
        this.form        = null;
    }

    args(options = {}) {
        for (let i in options) { 
            this.options[i] = options[i]; 
        }
    }
    
    reset(onsuccess = null, onfailed = null, options = {}) {
        if (typeof onsuccess === "function") {
            this.onsuccess = onsuccess;
        }
        if (typeof onfailed === "function") {
            this.onfailed = onfailed;       
        }
        this.args(options);
    }
    

    // ************************************************************************
    // ************************************************************************
    //
    // RUNTIME
    //
    // ************************************************************************
    // ************************************************************************

    // Called by UI support to trigger positive
    // return value to caller before close
    // Overwrite: rarely
    //
    success(value = true) {
        if (typeof this.onsuccess === "function") {
          this.onsuccess(value);
        }
        this.remove();
    }

    // Called by UI support to trigger negative
    // return value to caller before close
    // Overwrite: rarely
    //
    failed() {
        if (typeof this.onfailed === "function") {
          this.onfailed();
        }
        this.remove();
    }


    // ************************************************************************
    // ************************************************************************
    //
    // EVENTS
    //
    // ************************************************************************
    // ************************************************************************

    // Triggered after the theme was changed
    // overwrite: sometimes
    //
    onthemechanged() {
        // console.log(`IN view.onthemechanged('${this.view_id}')`);
        // Do something meaningful with the theme
        //
    }

    // Triggered after the viewport was resized
    // overwrite: sometimes
    //
    onviewportresize() {
        // console.log(`IN view.onviewportresize('${this.view_id}')`);
        // Do something meaningful with the view layout
        //
    }

    // Triggered after the hardware back button was pressed
    // overwrite: sometimes
    //
    onbackbutton() {
        //console.log(`IN view.onbackbutton() view_id='${this.view_id}'`);
        this.failed();
    }


    // ************************************************************************
    // ************************************************************************
    //
    // UI
    //
    // ************************************************************************
    // ************************************************************************
    
    // Return true if the view is positioned on UI and visible
    // overwrite: as good as never
    //
    visible() {
        console.log(`IN view.visible() view_id='${this.view_id}'`);
        return jQuery(`#${this.view_id}`).is(":visible");
    }
    
    // Removes the displayed view from UI
    // overwrite: rarely
    //
    remove() {
        console.log(`IN view.remove() view_id='${this.view_id}'`);
        jQuery(`#${this.view_id}`).remove();
        events.unreg('themechanged',   this.onthemechanged);
        events.unreg('viewportresize', this.onviewportresize);
        if (this.form) {
            this.form.remove();
        }
    }
    
    // Hide the displayed view
    // overwrite: rarely
    //
    hide() {
        console.log(`IN view.hide() view_id='${this.view_id}'`);
        jQuery(`#${this.view_id}`).removeClass('hidden').addClass('hidden');
    }
    
    // Tweak the loaded UI HTML buffer
    // Overwrite: often
    //
    onload(buffer) {
        //console.log(`IN view.onload() view_id='${this.view_id}'`);
        if (strlen(buffer) > 0) {
            // Do something meaningful
            // to alter the raw buffer
            //
        }
        return buffer;
    }
    
    // Load UI HTML buffer
    // Overwrite: sometimes
    //
    load() {
        //console.log(`IN view.load() view_id='${this.view_id}'`);
        let that = this;
        return new Promise((resolve)=>{
            if (strlen(that.contentHTML) > 0) {
                const buffer = that.contentHTML;
                resolve(that.onload(buffer));
            }
            else if (strlen(that.contentURI) > 0) {
                let uri = this.contentURI;
                
                const terminate = function(uri) {
                    fread(uri).then((buffer)=>{
                        if (buffer) {
                            that.contentHTML = buffer;
                            resolve(that.onload(buffer));
                        }
                        else {
                            resolve("");
                        }
                    });
                };
                
                fileExists(uri).then((result)=>{
                    if (result) {
                        terminate(uri);
                    }
                    else if (globalizedFileUri) {
                        terminate(globalizedFileUri(uri));
                    }
                    else {
                        resolve("");
                    }
                });
            }
            else {
                resolve("");
            }
        });
    }
    
    // Initialize the page data and interactivity when the page is displayed
    // overwrite: most of the time
    //
    onshow() {
        //console.log(`IN view.onshow() view_id='${this.view_id}'`);
        this.onthemechanged();
        events.reg(`themechanged`, this.onthemechanged);
        this.onviewportresize();
        events.reg(`viewportresize`, this.onviewportresize);
        // Do something useful here
        //
    }
    
    // Building the view on UI
    // overwrite: rarely
    //
    show() {
        //console.log(`IN view.show() view_id='${this.view_id}'`);
        let that = this;
        this.load().then((buffer)=>{
            if (strlen(buffer) > 0) {
                let contHtml = str_replace("[view_id]", that.view_id, viewHtml);
                contHtml = str_replace("[html]", buffer, contHtml);
                jQuery(document.body).append(contHtml);
            }
            delay(0).then(()=>{ that.onshow(); });
        });
    }
    
    setpage (pageURI, options = {}) {
        return new Promise((resolve)=>{
            this.contentHTML = "";
            this.contentURI = pageURI;
            const is_visible = this.visible();
            //const is_visible = DOMExists(this.view_id);
            if (is_visible) {
                this.remove();
            }
            this.options = {};
            this.args(options);
            delay(0).then(()=>{
                if (is_visible) {
                    this.show();
                    delay(0).then(()=>{
                        resolve(true);
                    });
                }
                else {
                    resolve(true);
                }
            });
        });
    }

}


// End of file: views.js
// ============================================================================

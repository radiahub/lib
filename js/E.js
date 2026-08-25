// ============================================================================
// Module      : E.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic mobile web
// Description : Console support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// EVENTS
//
// ****************************************************************************
// ****************************************************************************

window.onerror = function(message, source, lineno, colno) {
    source = str_replace(GATEWAY, "/", source);
    //alert(`IN window.onerror()`);
    let msg = `${message} in ${source}:${lineno}:${colno}`;
    alert(msg);
    if (E) {
        E.winlog(msg);
    }
    return true;
};

window.onunhandledrejection = (event)=>{
    //alert("IN window.onunhandledrejection()");
    event.preventDefault();
    let stack = event.reason?.stack || event.reason;
    alert(stack);
    let pos = stack.indexOf("@");
    if (pos >= 0) {
        let dum = stack.slice(0, stack.indexOf("\n"));
        let pos = dum.indexOf("@");
        if (pos >= 0) { dum = dum.slice(pos + 1); }
        if (dum.slice(0,1) === "/") { dum = dum.slice(1); }
        dum = dum.replace("<","",dum);
        dum = dum.replace(">","",dum);
        dum = dum.replace("@","",dum);
        dum = str_replace(GATEWAY,"/",dum);
        let msg = `${event.reason.message} in ${dum}`;
        alert(msg);
        if (E) {
            E.winlog(msg);
        }
    }
    else {
        stack = stack.replace("\n","",stack);
        stack = stack.replace("   at","in",stack);
        stack = str_replace(GATEWAY,"/",stack);
        alert(stack);
        if (E) {
            E.winlog(stack);
        }
    }
    return true;
};


// ****************************************************************************
// ****************************************************************************
//
// E IMPLEMENTATION
//
// ****************************************************************************
// ****************************************************************************

const E_WRAP = `<div id="[echoline_id]" class="echoline" style="padding:0.25em 0.5em;">
[echoline-time][echoline-rows]
</div>`;

const E_TIME = `<div class="col-24 echoline-time monospace wordwrap" style="color:[fg-color]; white-space: pre-wrap;">[time]</div>`;

const E_TEXT = `<div class="col-24 echoline-text monospace wordwrap [bold]" style="margin-top:0.25em; color:[fg-color]; white-space: pre-wrap;">[text]</div>`;

const E_HTML = `<div id="DIV_E_CONTAINER" class="page fit bg-black overflow-none hidden" style="z-index:24000;">
    <div id="DIV_E_OPTIONS" class="page-docking-top fg-white" style="height:40px; background-color:#000000;">
        <div id="BTN_E_CLEAR" class="float-left fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span class="material-icons">block</span>
        </div>
        <div id="BTN_E_COPY" class="float-left fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span class="material-icons">content_copy</span>
        </div>
        <div id="BTN_E_MUTE" class="float-right fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span id="SPAN_E_MUTE" class="material-icons-outlined">notifications_active</span>
        </div>
        <div id="BTN_E_WINLOG" class="float-right fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span class="material-icons">settings_backup_restore</span>
        </div>
        <div id="BTN_E_EVENTS" class="float-right fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span class="material-icons">bolt</span>
        </div>
        <div id="BTN_E_VIEWS" class="float-right fit-height flex flex-center flex-middle" style="width:40px; cursor:pointer;">
            <span class="material-icons">call_split</span>
        </div>
    </div>
    <div id="DIV_E_DATA" class="absolute overflow-y h5" style="top:40px; bottom:0px; height:calc(100% - 40px); width:100%;"></div>
</div>`;

const E_TOGGLE = `<div id="DIV_E_TOGGLE" class="bg-transparent" style="position:absolute; top:0; left:0; width:14px; height:100%; cursor:pointer; z-index:24002;"></div>`;

const E_STATE = `
<div class="e-table-container">
<table class="e-table">
<tr class="bold">
<td>state</td>
<td>href</td>
</tr>
<tr>
<td>[state]</td>
<td>[href]</td>
</tr>
</table>
`;

const E_VIEWS = `
<div class="e-table-container">
<table class="e-table">
<tr class="bold">
<td></td>
<td></td>
<td>view_id</td>
<td style="min-width:8ch;">visible</td>
</tr>
[rows]
</table>
</div>
`;

const E_VIEW_ROW = `
<tr>
<td>[number]</td>
<td></td>
<td>[view_id]</td>
<td style="min-width:8ch;">[visible]</td>
</tr>
`;

const E_VIEW_ROW_ACTIVE = `
<tr class="active">
<td>[number]</td>
<td><span class="material-icons" style="font-size:80%; padding-top:0.3em;">circle</span></td>
<td>[view_id]</td>
<td style="min-width:8ch;">[visible]</td>
</tr>
`;

const E_EVENTS = `
<div class="e-table-container">
<table class="e-table">
<tr class="bold">
<td style="min-width:8ch;">Event name</td>
<td style="min-width:8ch;">Function</td>
</tr>
[rows]
</table>
</div>
`;

const E_EVENT_ROW = `
<tr>
<td style="min-width:8ch;">[eventName]</td>
<td style="min-width:8ch;">[functionName]</td>
</tr>
`;

const E_COLORS = {
    winerror : "#FF4500",
    error    : "#FF0000",
    eval     : "#FFFFFF",
    info     : "#7CFC00",
    log      : "#EAEAEA",
    warn     : "#FF8D00",
    html     : "#3CE2D4",
    xml      : "#3CE2D4"
};

const E = {

    UIavailable : false, redirected : false,
    initAddressTabColor : "",

    activate : function() {
        E.UIavailable = true;
    },

    winlog_cached : [],

    winlog : function(message){
        if (E.UIavailable) {
            E.write("winerror",[message]);
        }
        else {
            E.winlog_cached.push({scope:"winerror", objects:[message]});
        }
    },


    // ************************************************************************
    // ************************************************************************
    //
    // WINDOW ERROR STACK PARSER
    //
    // ************************************************************************
    // ************************************************************************

    read_from_stack: function(offset = 3) {
		
        let stk = null;
        try {
            throw new Error("ERR_E_FILEINFO");
        }
        catch (err) {
            stk = err.stack;
        }
        
        // Stack format varies by browser:
        //
        // Chrome : "at functionName (file:line:col)"
        // Edge   : "at functionName (file:line:col)"
        // Firefox: "functionName@file:line:col"
        // Safari : "functionName@file:line:col"
        // Node.js: "at functionName (file:line:col)"
        //			

        // console.log(stk);

        //alert(stk);

        let msg = "", theProperI = -1, theProperLine = "";
        let lines = stk.split("\n");
        for (let i = 0; i < lines.length; i++) {
            //alert(`${i} ${lines[i]}`);
            if (theProperI < 0) {
                if (String(lines[i]).indexOf("do_the_write") >= 0) {
                    theProperI = i + offset;
                }
            }
            else if (i === theProperI) {
                theProperLine = lines[i];
                break;
            }
        }

        //console.log(theProperLine);
        
        if (theProperLine.indexOf("@") >= 0) {
            //alert("IN Firefox, Safari");
            theProperLine = theProperLine.trim();
            let arr = theProperLine.split("@");
            //alert(JSON.stringify(arr));
            funcdum = arr[0];
            funcdum = funcdum.replaceAll("<", "");
            funcdum = funcdum.replaceAll(">", "");
            funcdum = funcdum.replaceAll(GATEWAY, "/");
            let p = funcdum.indexOf("/");
            if (p > 0) {
                funcdum = funcdum.slice(0, p);
            }

            let filedum = arr[1], filename = "", filepos = "";
            filedum = filedum.replace(GATEWAY, "/");
            p = filedum.indexOf(" ");
            if (p > 0) {
                filename = filedum.slice(0, p);
                let q = filedum.indexOf("srcScript");
                filepos = filedum.slice(q + 9); // 9 = length of "srcScript"
                filedum = filename + filepos;
            }

            theProperLine = (funcdum.length > 0) ? `in ${funcdum}() at ${filedum}` : `in ${filedum}`;
        }
        else {
            //alert("IN Chrome, Edge, Node.js");
            theProperLine = theProperLine.replace("at", "");
            theProperLine = theProperLine.trim();
            var arr = theProperLine.split(" ");
            //console.log(arr);

            var funcdum = arr[0];
            funcdum = funcdum.replaceAll("<", "");
            funcdum = funcdum.replaceAll(">", "");
            funcdum = funcdum.replace(GATEWAY, "/");

            let filedum = (arr.length >= 2) ? arr[1] : "";
            //console.log(funcdum, filedum);
            if (filedum.length > 0) {
                filedum = String(filedum).replaceAll("(","");
                filedum = filedum.replaceAll(")","");
                filedum = filedum.replace(GATEWAY, "/");
                filedum = filedum.replaceAll("<", "");
                filedum = filedum.replaceAll(">", "");
                var p = filedum.lastIndexOf("/");
                if (p >= 0) {
                    filedum = filedum.slice(p + 1);
                }
            }
            
            theProperLine = (filedum.length > 0) ? `in ${funcdum}() at ${filedum}` :  (funcdum.length > 0) ? `in ${funcdum}` : "";
        }
        
        //console.log(theProperLine);
        return theProperLine;
    },


    // ************************************************************************
    // ************************************************************************
    //
    // OUTPUT
    //
    // ************************************************************************
    // ************************************************************************

    muted: false,

    mute: ()=>{
        E.muted = true;
        jQuery("#SPAN_E_MUTE").html("notifications_off");
    },

    unmute: ()=>{
        E.muted = false;
        jQuery("#SPAN_E_MUTE").html("notifications_active");
    },

    stringify : function(obj) {
        //console.info("IN E.stringify() obj='" + JSON.stringify(obj) + "'");
        //console.log (typeof obj);
        
        if (typeof obj === "object")	{
            if (obj === null) {
                return "(object) null";
            }
            else if (obj instanceof Date) {
                let st = new Date(obj).toISOString();
                st = st.substring(0, 19).replace('T', ' ');
                return '(date) ' + st;
            }
            else if (obj instanceof Map) {
                return '(map) ' + JSON.stringify(obj);
            }
            else if (Array.isArray(obj)) {
                return '(array) ' + JSON.stringify(obj);
            }
            else {
                return '(object) ' + JSON.stringify(obj);
            }
        }
        
        else if (typeof obj === "boolean") {
            var dumdum = (obj === true) ? "true" : "false";
            return '(bool) ' + dumdum;
        }
        
        else if (typeof obj === "number") {
            if (obj && obj % 1 === 0) {
                return '(int) ' + String(obj);
            }
            else {
                return '(number) ' + String(obj);
            }
        }
        
        else if (typeof obj === "function") {
            return '(function) ' + obj.name;
        }
        
        else if (typeof obj === "string") {
            return obj;
        }
        
    },

    do_the_write: function(scope, objects, offset = 3) {
        const fg_color = E_COLORS[scope];

        let time = (scope === "winerror") ? "" : E_TIME.replace("[time]", E.read_from_stack(offset));
        time = time.replace("[fg-color]", fg_color);

        let rows = "", bold = (scope === "winerror") ? "bold" : "";
        for (obj of objects) {
            let html = E_TEXT.replace("[fg-color]", fg_color);
            html = html.replace("[bold]", bold);
            if (rows.length > 0) { rows += "\n"; }
            rows += html.replace("[text]", E.stringify(obj));
        }

        let echoline_id = "EL_"+rand_hex_str(16);
        let html = E_WRAP.replace("[echoline_id]", echoline_id);
        html = html.replace("[echoline-time]", time);
        html = html.replace("[echoline-rows]", rows);
        jQuery("#DIV_E_DATA").append(html);
        
        jQuery("#" + echoline_id).off("click").on("click", function(){
            if (jQuery("#" + echoline_id).hasClass("echoselected")) {
                jQuery("#" + echoline_id).removeClass("echoselected");
            }
            else {
                jQuery("#" + echoline_id).addClass("echoselected");
            }
        });

        E.scroll();
    },

    winlog_flush: function() {
        E.write("info", [`IN E.winlog_flush()`], 2);
        if (E.UIavailable && (E.winlog_cached.length > 0)) {
            E.show(true);
            for (let i = 0; i < E.winlog_cached.length; i++) {
                E.do_the_write(
                    E.winlog_cached[i].scope,
                    E.winlog_cached[i].objects
                );
             }
             E.winlog_cached = [];
        }
    },

    events_dump: function() {
        if (typeof events !== "undefined") {
            const dump = String(events.dump()).split("\n");
            if (dump.length > 0) {
                let contHtml = "";
                for (let i = 0; i < dump.length; i++) {
                    const [eventName,functionName] = dump[i].split(":");
                    let lineHtml = E_EVENT_ROW.replace(`[eventName]`, eventName);
                    lineHtml = lineHtml.replace(`[functionName]`, functionName);
                    if (contHtml.length > 0) { contHtml += "\n"; }
                    contHtml += lineHtml;
                }
                contHtml = E_EVENTS.replace(`[rows]`, contHtml);
                E.write("log", [contHtml], 2);
            }
        }
    },
    
    views_dump: function() {
        if (typeof handlingPop !== "undefined") {
            let contHtml = "";
            const state = history.state;
            const href = window.location.href;
            contHtml = E_STATE.trim();
            contHtml = contHtml.replace("[state]", JSON.stringify(state));
            contHtml = contHtml.replace("[href]", href);
            E.write("log", [contHtml], 2);
        }
        if (dump_views) {
            const rows = dump_views();
            E.write(`log`, [rows], 2);
        }
    },

    write: function(scope, objects, offset = 3) {
        if (E.UIavailable) {
            E.show();
            E.do_the_write(scope, objects, offset);
        }
        else {
            E.winlog_cached.push({ scope:scope, objects:objects });
        }
    },

    eval: (...args)=>{
        let objects = [];
        
        let e_eval_one = function(expr) {
	          try {
	              return eval(expr);
	          }
	          catch(err) {
	              return "eval runtime exception";
	          }
        };
        
        for (expr of args) {
             objects.push(e_eval_one(expr)); 
        }

        E.write("eval", objects);
    },

    log: function(...args) {
        let objects = [];
        for (const obj of args) {
            if (typeof obj === "undefined")	{ obj = "undefined"; }
            objects.push(obj);
        }
        E.write("log", objects);
    },
 
    info: function(...args) {
        let objects = [];
        for (const obj of args) {
            if (typeof obj === "undefined")	{ obj = "undefined"; }
            objects.push(obj);
        }
        E.write("info", objects);
    },

    warn: function(...args) {
       let objects = [];
       for (const obj of args) {
            if (typeof obj === "undefined")	{ obj = "undefined"; }
            objects.push(obj);
        }
        E.write("warn", objects);
    },

    error: function(...args) {
       let objects = [];
       for (const obj of args) {
            if (typeof obj === "undefined")	{ obj = "undefined"; }
            objects.push(obj);
        }
        E.write("error", objects);
    },

    html: function(html) {
        let objects = [];
        let wrap = `<pre><code style="font-family:monospace">[html]</pre></code>`;
        html = str_replace("<", "&lt;", html);
        html = str_replace(">", "&gt;", html);
        wrap = str_replace("[html]", html.trim(), wrap);
        objects.push(String(wrap));
        E.write("html", objects);
    },


    // ************************************************************************
    // ************************************************************************
    //
    // UI
    //
    // ************************************************************************
    // ************************************************************************

    scroll : function()
    {
        var objDiv = document.getElementById("DIV_E_DATA");
        objDiv.scrollTop = objDiv.scrollHeight;
    },

    selectedText : function() {
        let text = "";
        jQuery("#DIV_E_DATA .echoline").each((i,eltLine)=>{
            if (jQuery(eltLine).hasClass("echoselected")) {
                if (strlen(text) > 0) { text += "\n"; }
                //text += jQuery(eltLine).find(".echoline-time").text();
                jQuery(eltLine).find(".echoline-text").each((j,eltText)=>{
                    if (strlen(text) > 0) { text += "\n"; }
                    text += jQuery(eltText).text();
                });
            }
            text += "\n";
        });
        return text.trim();
    },

    animate: function() {
        jQuery("#BTN_E_CLEAR").off("click").on("click", function(){
            jQuery("#DIV_E_DATA").empty();
        });

        jQuery("#BTN_E_MUTE").off("click").on("click", function(){
            if (E.muted) {
                E.unmute();
            }
            else {
                E.mute();
            }
        });

        jQuery("#BTN_E_WINLOG").off("click").on("click", function(){
            E.winlog_flush();
        });
        
        jQuery("#BTN_E_EVENTS").off("click").on("click", function(){
            E.events_dump();
        });
        
        jQuery("#BTN_E_VIEWS").off("click").on("click", function(){
            E.views_dump();
        });
        
        jQuery("#BTN_E_COPY").off("click").on("click", function(){
		          //console.log("IN oncopy()");
             if (navigator.clipboard) {
                 let st = E.selectedText();
                 if (st.length > 0) {
	                    navigator.clipboard.writeText(st);
                 }
             }
        });

        jQuery("#DIV_E_TOGGLE").off("click").on("click", function(){
            if (jQuery("#DIV_E_CONTAINER").is(":visible")) {
                E.hide();
            }
            else {
                E.show(true);
            }
        });
    },


    hide : function() {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', E.initAddressTabColor);
        jQuery("#DIV_E_CONTAINER")
        .removeClass("hidden")          
        .addClass("hidden");
        setTimeout(
            function() {
                if ((typeof mobileExitRequested !== "undefined") && (mobileExitRequested === true)) {
                    mobileExit();
                }
            },
            0
        );
    },

    show : function(force=false) {
        const Div = document.querySelector('#DIV_E_CONTAINER');
        if (!Div) {
            let contHtml = E_HTML + "\n" + E_TOGGLE;
            jQuery(document.body).append(contHtml);
            E.animate();
        }

        const canShow = function(){
            return (force || (!E.muted));
        };

        if (canShow() && (jQuery("#DIV_E_CONTAINER").hasClass("hidden"))) {
            E.initAddressTabColor = document.querySelector('meta[name="theme-color"]').getAttribute('content');
            document.querySelector('meta[name="theme-color"]').setAttribute('content',"#000000");
            jQuery("#DIV_E_CONTAINER").removeClass("hidden");

            if (E.muted) {
                jQuery("#SPAN_E_MUTE").html("notifications_off");
            }
            else {
                jQuery("#SPAN_E_MUTE").html("notifications_active");
            }
         }
    }

};


// ****************************************************************************
// ****************************************************************************
//
// WINDOW CONSOLE
//
// ****************************************************************************
// ****************************************************************************

const originalConsole = {
    log   : console.log,
    info  : console.info,
    warn  : console.warn,
    error : console.error
};

const redirectConsole = function() {
    //console.info("IN redirectConsole()");
    E.info("IN redirectConsole()");
    if (E.redirected) { return; }
    
    E.redirected = true;
    ['log','info','warn','error'].forEach((method)=>{
        console[method] = (...args) => {
            let objects = [];
            for (obj of args) {
                objects.push(obj);
            }
            E.write(method, objects);
        };
    });

    console["eval"] = E.eval;
    console["html"] = E.html;
};

const restoreConsole = function() {
    console.info("IN restoreConsole()");

    E.redirected = false;
    Object.assign(console, originalConsole);

    console.eval = console.log;
    console.html = console.log;

    console.warn("Console is restored");
};


// ****************************************************************************
// ****************************************************************************
//
// UI EVENTS
//
// ****************************************************************************
// ****************************************************************************

document.addEventListener('DOMContentLoaded', function() {
    E.activate();
    if ((window.matchMedia)&&(window.matchMedia('(max-width: 767px)').matches)) {
        redirectConsole();
    }
    setTimeout(()=>{
        E.write("log", [`IN documentEventListener('DOMContentLoaded')`]);
        E.winlog_flush();
    }, 0);
});


// End of file: E.js
// ============================================================================

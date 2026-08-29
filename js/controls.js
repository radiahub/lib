// ============================================================================
// Module      : controls.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : GUI add-ons
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 26-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// UI CONTROLLER
//
// ****************************************************************************
// ****************************************************************************

const ui = {
    
   /*
    * Objects reference
    */
    cache : new cache(),
    
   /*
    * Files
    */
    load : function (filepath, section = "") {
        
        //console.info(`IN ui.load() filepath='${filepath}' section='${section}'`);
        
        const ststart = `<!--${section}-->`;
        const stend = `<!--${section}-end-->`;
        
        let buffer = ui.cache.get(filepath);
        if (buffer.length > 0) {
            buffer = buffer.replaceAll("  ", " ");
            if (section.length > 0) {
                buffer = str_section(buffer, ststart, stend);
                return buffer;
            }
            else {
                return buffer;
            }
        }
        
        return "";
    },
    
   /*
    * HTML edit
    */
    html_strip_section: function (html, section) {
        const ststart = `<!--${section}-->`;
        const stend = `<!--${section}-end-->`;
        return str_section_erase(html, ststart, stend);
    }
    
};


// ****************************************************************************
// ****************************************************************************
//
// EFFECTS
//
// ****************************************************************************
// ****************************************************************************

/*
 * Default animation and durations times
 */
const animation_fast   = 200;
const animation_short  = 300;
const animation_normal = 400;
const animation_slow   = 600;

const duration_short   = 1500;
const duration_normal  = 3000;
const duration_long    = 4500;

let rippling = false;

const ripple = (element, callback=noop, duration=animation_normal)=>{

    //console.info("IN ripple()");
    if (rippling) { return; }
    rippling = true; 
    
    element = (typeof element === "string") ? document.getElementById(element) : jQuery(element).get(0);

    if (jQuery(element).hasClass('disabled')) {
        return;
    }
    
    console.log(element);
    console.log(element.tagName);

    if (strcasecmp(element.tagName,"SPAN") === 0) {
        duration = animation_short;
        jQuery(element).removeClass(`span-ripple`).addClass(`span-ripple`);
        setTimeout(()=>{
            jQuery(element).removeClass(`span-ripple`);
            callback();
            rippling = false;
        }, duration);
    }
    else if (strcasecmp(element.tagName, "DIV") === 0) {

        let addOVNone = false;
        if (! jQuery(element).hasClass("overflow-none")) {
            jQuery(element).addClass("overflow-none");
            addOVNone = true;
        }

        jQuery(`.ripple`).remove();

        var circle   = document.createElement("span");
        var diameter = Math.max(element.clientWidth, element.clientHeight);
        var radius   = (diameter / 2) + 2;

        circle.style.width  = circle.style.height = `${diameter}px`;
        circle.style.left   = `${(element.clientWidth  / 2) - radius - 1 }px`;
        circle.style.top    = `${(element.clientHeight / 2) - radius - 1 }px`;
        circle.style.zIndex = 5;
        circle.classList.add("ripple");
        element.appendChild(circle);

        setTimeout(()=>{
            jQuery(`.ripple`).remove();
            if (addOVNone)  { jQuery(element).removeClass("overflow-none"); }
            callback();
            rippling = false;
        }, duration);
    }
};

/*
Usage:

spotlight.show(document.querySelector('#saveButton'));
...
spotlight.hide();
*/
const spotlight = (() => {
    let overlay = null;

    function create() {
        if (overlay) return;
        overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            inset: '0',
            //zIndex: '999999',
            zIndex: '1',
            pointerEvents: 'none',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)'
        });
        document.body.appendChild(overlay);
    }

    function show(element, padding = 10) {
        create();
        const r = element.getBoundingClientRect();
        const left = r.left - padding;
        const top = r.top - padding;
        const right = r.right + padding;
        const bottom = r.bottom + padding;
        overlay.style.background =
            `rgba(0,0,0,.45)`;
        overlay.style.mask = `
            linear-gradient(#000 0 0),
            linear-gradient(#000 0 0)
        `;
        overlay.style.webkitMask = `
            linear-gradient(#000 0 0)
        `;
        overlay.style.clipPath =
            `polygon(
                0 0,
                100% 0,
                100% 100%,
                0 100%,
                0 0,
                ${left}px ${top}px,
                ${left}px ${bottom}px,
                ${right}px ${bottom}px,
                ${right}px ${top}px,
                ${left}px ${top}px
            )`;
        overlay.style.background = `
            linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45))
            `;
    }

    function hide() {
        if (!overlay) return;
        overlay.remove();
        overlay = null;
    }

    return { show, hide };
})();


// ****************************************************************************
// ****************************************************************************
//
// SOUND EFFECTS
//
// ****************************************************************************
// ****************************************************************************

function media(url)
{
    try {
        var audio = new Audio(url);
        audio.play();
    }
    catch(e) {
        //console.error(err);
    }
}

function klik()
{
    if (typeof nativeclick !== "undefined") {
        nativeclick.trigger();
    }
    else {
        media("lib/mp3/click.mp3");
    }
}


// ****************************************************************************
// ****************************************************************************
//
// DOM GENERIC CONTROLS
//
// ****************************************************************************
// ****************************************************************************

const isset = (ref)=>{ 
    return ref !== null; 
};


const select = {

    get :(id)=>{
        return jQuery('#' + id + ' option:selected').val();
    },

    //Get the list of selected options
    //Get the DOM first selected option: select.selected(id).get(0);
    //
    selected: (id)=>{
        return jQuery('#'+id+' option:selected');
    },

    set: (id,value)=>{
        jQuery('#' + id).val(value).change();
    },

    options: {

        clear: (id)=>{
            jQuery("#" + id).empty();
        },

        set: (id,options)=>{
            select.options.clear(id);
            for (let i=0; i<options.length; i++) {
                let html = `<option value="${options[i]["value"]}">${options[i]["caption"]}</option>`;
                jQuery("#" + id).append(html);
            }
        }

    }

};


const checkbox = {

    get : (id)=>{
        return (jQuery("#" + id).prop("checked") === true) ? true : false;
    },

    set : (id, checked=true)=>{
        jQuery("#" + id).prop("checked", checked);
    }

};


const checkgroup = {

    get : (name)=>{
        var result = {};
        jQuery(`input[type=checkbox][name="${name}"]`).each(function(){
            let id = jQuery(this).attr("id");
            if (strlen(id) > 0) {
                result[id] = checkbox.get(id);
            }
		     });
        return result;
    }

};


const radio = {
    
    get : (name)=>{
        return jQuery(`input[type=radio][name="${name}"]:checked`).val();
    },

    set : (name, value)=>{
        jQuery('input[type=radio][name="' + name + '"]').removeAttr('checked');
        jQuery('input[type=radio][name="' + name + '"][value="' + value + '"]').prop('checked', true);
    }

};


// Works for editable DIV
//
function move_cursor_to_end(eltID) 
{
    let element = document.getElementById(eltID);
    let range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.collapse(false);
        range.select();
    }
}

// Works for input, textarea
//
function input_selection_start(eltId)
{
    let element = document.getElementById(eltId);
    return element.selectionStart;
}

function input_selection_end(eltId)
{
    let element = document.getElementById(eltId);
    return element.selectionEnd;
}

function input_cursor_to_pos(eltId, pos)
{
    let element = document.getElementById(eltId);
    element.focus();
    element.setSelectionRange(pos, pos);
}

function input_cursor_to_end(eltId)
{
    let element = document.getElementById(eltId);
    let len = strlen(element.value);
    input_cursor_to_pos(eltId, len);
}


// May work for editable DIV
//
function DIVinsert(text) 
{
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) { 
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode (document.createTextNode(text));
        }
    }
    else if (document.selection?.createRange) {
        document.selection.createRange().text = text;
    }
}

// May work for input and textarea
//
const TAinsert = (textareaElement,newText)=>{
    //console.log("IN TAinsert()");
    textareaElement.focus();
    const start = textareaElement.selectionStart;
    const end = textareaElement.selectionEnd;
    textareaElement.setRangeText(newText, start, end, 'select');
    textareaElement.selectionStart = textareaElement.selectionEnd = start + newText.length;
}


// ****************************************************************************
// ****************************************************************************
//
// DOM MISC CONTROLS AND TRIGGERS
//
// ****************************************************************************
// ****************************************************************************

const isTouchSupported = ('ontouchstart' in window);


// End of file: controls.js
// ============================================================================

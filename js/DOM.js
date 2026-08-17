// ============================================================================
// Module      : DOM.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : General
// Description : DOM library
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 26-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// VIEWPORT
//
// ****************************************************************************
// ****************************************************************************

function geometry()
{
	var orientation = (window.innerWidth > window.innerHeight) ? "landscape" : "portrait";
	var result = { orientation: orientation };

	result["screenWidth"] = screen.width ;
	result["screenHeight"] = screen.height;
	result["windowWidth"] = window.innerWidth ;
	result["windowHeight"] = window.innerHeight;

	result["screenRatioWidth"] = decimal((screen.width  / window.innerWidth),  3);
	result["screenRatioHeight"] = decimal((screen.height / window.innerHeight), 3);

	if (! DOMExists("geometry_div")) {
		var html = "<div id='geometry_div' style='position:absolute; height:1in; width:1in; left:-100%; top:-100%;'></div>";
		jQuery(document.body).append(html);
	}

	var devicePixelRatio = window.devicePixelRatio || 1;
	result["devicePixelRatio"] = devicePixelRatio;

	var dpi_x = document.getElementById('geometry_div').offsetWidth  * devicePixelRatio;
	var dpi_y = document.getElementById('geometry_div').offsetHeight * devicePixelRatio;
	var ppi_x = document.getElementById('geometry_div').offsetWidth ; // dpi_x / devicePixelRatio
	var ppi_y = document.getElementById('geometry_div').offsetHeight; // dpi_y / devicePixelRatio

	result["inch_to_device_px"] = "1 inch = " + dpi_x + " device_px";
	result["inch_to_css_px"] = "1 inch = " + ppi_x + " css_px";
	result["inch_to_dp"] = "1 inch = 160 dp";

	var dp_ratio = (dpi_x / devicePixelRatio) / 160;
	var px_ratio = (dp_ratio > 0) ? (1 / dp_ratio) : 1;

	result["dp_ratio"] = dp_ratio;
	result["dp_to_css_px"] = "1 dp = " + decimal(dp_ratio, 3) + " css_px";
	result["px_ratio"] = px_ratio;
	result["css_px_to_dp"] = "1 css_px = " + decimal(px_ratio, 3) + " dp";
	var numW = window.innerWidth * px_ratio, numH = window.innerHeight * px_ratio;
	result["window_to_DP"] = "windowWidth = " + decimal(numW, 3) + " dp, windowHeight = " + decimal(numH, 3) + " dp";

	return result;
};


// ****************************************************************************
// ****************************************************************************
//
// UTILS
//
// ****************************************************************************
// ****************************************************************************

const DOMExists = function(domID) {
  return (document.getElementById(domID) === null) ? false : true;
}

const DOMElement = function(obj) {
	return obj instanceof Element;
};

//Quick resolve an element parent depending on the input object
//
function parent(elt)
{
	var parentElement = null;
	try {
		if (typeof elt === "undefined") { parentElement = document.documentElement; }
		else if (typeof elt === "string") { parentElement = document.getElementById(elt).parentElement; }
		else parentElement = elt.parentElement;
	}
	catch(e) {
		//console.warn("Runtime exception in parent()");
		parentElement = null;
	}
	return parentElement;
}

function descendants(element, classList)
{
	element = (typeof element === "string") ? document.getElementById(element) : jQuery(element).get(0);

	if (typeof classList === "undefined") { 
		classList = []; 
	}
	else if (typeof classList === "string") {
		var delimiter = (classList.indexOf(",") > 0) ? "," : " ";
		classList = array_of(classList, delimiter);
	}

	var clist = classList.join(" ");
	console.log(clist);
	return element.getElementsByClassName(clist);
}

function parentStyle(childID, jsStylePropertyName)
{
	try {
		const child = document.getElementById(childID);
		if (child && child.parentElement) {
			const parentStyle = window.getComputedStyle(child.parentElement);
			return parentStyle[jsStylePropertyName];
		}
		else {
			console.warn("Element or parent element not found.");
			return null;
		}
} 
	catch (error) {
		console.warn("Runtime exception ", error);
		return null;
	}
}

//Resolves the font size of an element in pixels
//
function fontsize(elt)
{
	if (typeof elt === "undefined") { elt = document.documentElement; }
	else if (typeof elt === "string") { elt = document.getElementById(elt); }
	return parseFloat(getComputedStyle(elt).fontSize);
}

const getScreenCordinates = function (obj) {
	if (typeof obj === "string") { obj = document.getElementById(obj); }
  var p = {};
  p.x = obj.offsetLeft;
  p.y = obj.offsetTop;
  while (obj.offsetParent) {
    p.x = p.x + obj.offsetParent.offsetLeft;
    p.y = p.y + obj.offsetParent.offsetTop - obj.offsetParent.scrollTop;
    if (obj == document.getElementsByTagName("body")[0]) {
      break;
    }
    else {
      obj = obj.offsetParent;
    }
  }
  return p;
}


// ****************************************************************************
// ****************************************************************************
//
// CSS STYLESHEETS
//
// ****************************************************************************
// ****************************************************************************

var css = {

	load : function(newURI, msecs)
	{
		return new Promise((resolve)=>{
			//console.info("IN css.load() newURI='" + newURI + "'");
			if (typeof msecs === "undefined") { msecs = 400; }
			try {
				var html = '<link rel="stylesheet" type="text/css" href="' + newURI + '">';
				jQuery("head").append(html);
				setTimeout(function(){ resolve(true); }, msecs);
			}
			catch(e){
				resolve(false);
			}
		});
	},

	unload : function(currentURI, msecs)
	{
		return new Promise((resolve)=>{
			//console.info("IN css.unload() currentURI='" + currentURI + "'");
			if (typeof msecs === "undefined") { msecs = 400; }
			try {
				var obj = jQuery("link[href='" + currentURI + "']")[0];
				if ((typeof obj !== "undefined") && (obj !== null)){
					jQuery("link[href='"+currentURI+"']").prop("disabled", true);
					jQuery("link[href='"+currentURI+"']").remove();
					setTimeout(function(){ resolve(); }, msecs);
				}
				else {
					resolve();
				}
			}
			catch(e){
				resolve(); // not blocking flow
			}
		});
	},

	replace : function(currentURI, newURI, msecs)
	{
		return new Promise((resolve,reject)=>{
			//console.info("IN css.replace() currentURI='" + currentURI + "' newURI='" + newURI + "'");
			if (typeof msecs === "undefined") { msecs = 400; }
			css.unload(currentURI, msecs).then(()=>{
				css.load(newURI, msecs).then((result)=>{
					resolve(result);
				});
			});
		});
	},
	
    val : function(cssVariableName)
    {
    	   if (cssVariableName.slice(0,2) !== "--") { cssVariableName = "--" + cssVariableName; }
    	   const rootStyles = getComputedStyle(document.documentElement);
    	   return rootStyles.getPropertyValue(cssVariableName).trim();
    }
	
}


// ****************************************************************************
// ****************************************************************************
//
// COLORS
//
// ****************************************************************************
// ****************************************************************************

// hexcolor: RRGGBB or #RRGGBB
//
function rgb2dec(hexcolor)
{
    if (hexcolor.slice(0, 1) === "#") {
	    hexcolor = hexcolor.slice(1);
    }
    //console.info(`IN rgb2dec() hexcolor='${hexcolor}'`);     
    return { 
        r: parseInt(hexcolor.slice(0, 2), 16),        
        g: parseInt(hexcolor.slice(2, 4), 16), 
        b: parseInt(hexcolor.slice(4, 6), 16)
    };
}

function dec2rgb(r, g, b) {
    // Converts numbers to base-16 and pads with a leading zero if needed
    const toHex = (c) => c.toString(16).padStart(2, '0').toUpperCase();
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function holo (hexcolor)
{
    let rgb = rgb2dec(hexcolor);
    let r = rgb.r, g = rgb.g, b = rgb.b;
    // Calculate perceived brightness using weighted root-mean-square
    const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );
    // Midpoint is 127.5
    return hsp > 127.5 ? 'light' : 'dark';
}

function contrast (hexcolor)
{
    switch(holo (hexcolor)) {
        case "dark"  : return "light";
        case "light" : return "dark" ;
    }
}

/*
const hsl = rgb2hsl(r, g, b);
const css = `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;

const hsl = rgb2hsl(255, 128, 0);
console.log(hsl);
// { h: 30, s: 100, l: 50 }
*/
function rgb2hsl(r, g, b) {
	
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    let s;
    const l = (max + min) / 2;

    if (max === min) {
        h = 0;
        s = 0;
    } 
    else {
        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            default:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/*
const rgb = hsl2rgb(h, s, l);
const css = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

const rgb = hsl2rgb(30, 100, 50);
console.log(rgb);
// { r: 255, g: 128, b: 0 }
*/
function hsl2rgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r;
    let g;
    let b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;
        };

        const q = l < 0.5
            ? l * (1 + s)
            : l + s - l * s;

        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// Change the lightness value by a percentage
//
// Example:
//
// increase lightness by 10%
// hsl = lightness(hsl, 110);
// decrease by 10%
// hsl = lightness(hsl, 90);
//
function lightness(hsl, pct = 100)
{
    hsl.l = Math.min(100, (hsl.l * pct / 100));
    return hsl;
}

// Change the saturation value by a percentage
//
// Example:
//
// increase saturation by 10%
// hsl = saturation(hsl, 110);
// decrease by 10%
// hsl = saturation(hsl, 90);
//
function saturation(hsl, pct = 100)
{
    hsl.s = Math.min(100, (hsl.s * pct / 100));
    return hsl;
}

// Increase the saturation value by an amount
//
function saturate(hsl, amount = 0)
{
    hsl.s = Math.min(100, hsl.s + amount);
    return hsl;
}

// Decrease the saturation value by an amount
//
function desaturate(hsl, amount = 0)
{
    hsl.s = Math.max(0, hsl.s - amount);
    return hsl;
}


// ****************************************************************************
// ****************************************************************************
//
// SCROLLING
//
// ****************************************************************************
// ****************************************************************************

/*
 * Horizontal scrolling
 *
 */
function isXScrollable(node) 
{
  if (typeof node === "string") { node = document.getElementById(node); }
  
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false;
  }
  
  const style = getComputedStyle(node);
  
  return ['overflow','overflow-x'].some(function(propertyName){
    const value = style.getPropertyValue(propertyName)
    return (value === 'auto' || value === 'scroll');
  });
}

function getXScrollParent(node) 
{
  if (typeof node === "string") { node = document.getElementById(node); }
  let currentParent = node.parentElement;
  while (currentParent) {
    if (isXScrollable(currentParent)) {
      return currentParent;
    }
    currentParent = currentParent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}

function isFullyXVisible(node)
{
  if (typeof node === "string") { node = document.getElementById(node); }
	var container = getXScrollParent(node);
	if ((container !== "undefined") && (container !== null)) {
		var containerRect = container.getBoundingClientRect();
		var nodeRect = node.getBoundingClientRect();
		return ((nodeRect.left >= containerRect.left) && (nodeRect.right <= containerRect.right));
	}
	else {
		return false;
	}
}

function XscrollIntoView(node) 
{
  if (typeof node === "string") { node = document.getElementById(node); }

	var dummy = isFullyXVisible(node);
	
	if (! dummy) {
		var container = getXScrollParent(node);
	
    var expectedLeft = container.getBoundingClientRect().left;
    var nodeLeft = node.getBoundingClientRect().left;
    var deltaLeft = nodeLeft - expectedLeft;
		
    container.scrollLeft += deltaLeft;
  }
}


/*
 * Vertical scrolling
 *
 */
function isYScrollable(node) 
{
  if (typeof node === "string") { node = document.getElementById(node); }
  
  if (!(node instanceof HTMLElement || node instanceof SVGElement)) {
    return false;
  }
  
  const style = getComputedStyle(node);
  
  return ['overflow','overflow-y'].some(function(propertyName){
    const value = style.getPropertyValue(propertyName)
    return (value === 'auto' || value === 'scroll');
  });
}

function getYScrollParent(node) 
{
  if (typeof node === "string") { node = document.getElementById(node); }
  let currentParent = node.parentElement;
  while (currentParent) {
    if (isYScrollable(currentParent)) {
      return currentParent;
    }
    currentParent = currentParent.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}

function isFullyYVisible(node, isOnKeyboardEvent)
{
	if (typeof isOnKeyboardEvent === "undefined") { isOnKeyboardEvent = false; }
	if (typeof node === "string") { node = document.getElementById(node); }

  var winHeight = window.innerHeight;
	if ((typeof application !== "undefined") && (is_cordova() && isOnKeyboardEvent)) {
		winHeight -= application.keyboard.height;
	}

	var container = getYScrollParent(node);
	if ((container !== "undefined") && (container !== null)) {
		var containerRect = container.getBoundingClientRect();
		var bottom = Math.min(winHeight, containerRect.bottom);
		var nodeRect = node.getBoundingClientRect();
		return ((nodeRect.top >= containerRect.top) && (nodeRect.bottom <= bottom));
	}
	else {
		return false;
	}
}

function YscrollIntoView(node, isOnKeyboardEvent) 
{
	if (typeof isOnKeyboardEvent === "undefined") { isOnKeyboardEvent = false; }
  if (typeof node === "string") { node = document.getElementById(node); }

	var dummy = isFullyYVisible(node, isOnKeyboardEvent);
	//console.log(String(dummy));
	
	if (! dummy) {
		var container = getYScrollParent(node);
	
    var expectedTop = container.getBoundingClientRect().top;
    //console.log(expectedTop);
    var nodeTop = node.getBoundingClientRect().top;
    //console.log(nodeTop);
    var deltaTop = nodeTop - expectedTop;
    //console.log(deltaTop);
		
    container.scrollTop += deltaTop;
  }
}

/*
 * jQuery support for vertical scrolling
 *
 */
(function($) {
  $.fn.scrollIntoView = function(isOnKeyboardEvent) {
		if (typeof isOnKeyboardEvent === "undefined") { isOnKeyboardEvent = false; }
		return this.each(function() {
			YscrollIntoView(jQuery(this).get(0), isOnKeyboardEvent);
		});
  };
}(jQuery));		




// End of file: DOM.js
// ============================================================================

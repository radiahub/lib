// ============================================================================
// Module      : arrays.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Arrays library
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// ARRAY <--> STRING
//
// ****************************************************************************
// ****************************************************************************

// Does NOT trim key values, number of returned values limited to max
// max <= 0 : all values are returned (no number limitation)
//
const breakApart = (str, delimiter, max) => {

    if (typeof max === "undefined") { max= 0; }
    if (typeof delimiter === "undefined") { delimiter = " "; }
    str = String(str);

    //console.info("IN breakApart() delimiter=" + delimiter + " max=" + max);

    if (Array.isArray(str)) { return str; }

    var result = [];

    var p = str.indexOf(delimiter);

    while ((p >= 0) && (str.length > 0)) {
        if (p === 0) {
            result.push("");
            if (str.length > 1) {
                str = str.slice(1);
            }
            else {
                str = "";
                break;
            }
        }
        else {
            if (max > 0) {
                //console.log(result);
                //console.log(max);
                //console.log(result.length);
                if (result.length < (max - 1)) {
                    result.push(str.slice(0, p));
                    if (result.length >= max) {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            else {
                result.push(str.slice(0,p));
            }
            str = (p < str.length - 1) ? str.slice(p + 1) : "";
        }

        p = str.indexOf(delimiter);
    }

    if (str.length > 0) {
        result.push(str);
    }

    return result;
};

const words = (str) => {
    str = String(str);
    var result = Array.from(str.matchAll(/\b\w+\b/g), match => match[0]);
    return result;
};

// DOES trim key values, does not limit the number of returned values
//
const arrayOf = (st, delimiter) => {

    if (is_array(st)) {
        return st;
    }

    if (typeof delimiter === "undefined") { delimiter = ","; }

    var result = [];

    if (typeof st === "string") {
        var dummy = breakApart (st, delimiter);
        for (var i = 0; i < dummy.length; i++) {
            var dumdum = String(dummy[i]).trim();
            if (dumdum.length > 0) {
                result.push(dumdum);
            }
        }
    }
    else {
        result = [];
        result.push(String(st));
    }

    return result;
};


// ****************************************************************************
// ****************************************************************************
//
// OBJECTS MERGING
//
// ****************************************************************************
// ****************************************************************************

// Use if objects include functions
//
function deepMerge(targetObject = {}, sourceObject = {}) {
  // clone the source and target objects to avoid the mutation
  const copyTargetObject = JSON.parse(JSON.stringify(targetObject));
  const copySourceObject = JSON.parse(JSON.stringify(sourceObject));
  // Iterating through all the keys of source object
  Object.keys(copySourceObject).forEach((key) => {
    if (typeof copySourceObject[key] === "object" && !Array.isArray(copySourceObject[key])) {
      // If property has nested object, call the function recursively
      copyTargetObject[key] = deepMerge(
        copyTargetObject[key],
        copySourceObject[key]
      );
    } else {
      // else merge the object source to target
      copyTargetObject[key] = copySourceObject[key];
    }
  });
  return copyTargetObject;
}

// Clone an object
//
function clone(obj) { 
    if (Array.isArray(obj)) {
        return Object.assign([], obj);
    }
    else {
        return Object.assign({}, obj);
    }
};


// JavaScript API (objects not using functions)
//
// var newObj = structuredClone(original);

// Shallow copies
//
// use Object.assign(target, ...sources)
// var newObj = Object.assign({}, original);




// End of file: arrays.js
// ============================================================================

// ============================================================================
// Module      : cache.js
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

/*
 * Generic class cache
 * 
 */
class cache {
    
    constructor () {
        this.files = new Map();
    }    

    has (filepath) {
        return this.files.has(filepath);
    }
        
    set (filepath, buffer){
        this.files.set(filepath, buffer);
    }
    
    get (filepath) {
        if (this.files.has(filepath)) {
            return this.files.get(filepath);
        }
        else {
            let buffer = freadSync(filepath);
            if (buffer.length > 0) {
                this.set(filepath, buffer);
            }
            return buffer;
        }
    }
    
    del (filepath) {
        return this.files.delete(filepath);
    }
    
}

/*
 * Global application cache object
 * 
 */
const appcache = new cache();


// End of file: cache.js
// ============================================================================
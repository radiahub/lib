// ============================================================================
// Module      : search.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright(c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Search database support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 20-Jan-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
//
// SEARCH ENGINE
//
// ****************************************************************************
// ****************************************************************************

/*
format JSON search item element

Important:

sortBy should always point to a consistent format across 
queries, like some sql_timestamp() format
sorting is based on string comparision

item = {
    table    : ``,
    fields   : [],
    operator : "OR",
    response_format : {
        sortKey    : `[updated]`,
        icon       : `<span class="material-icons">search</span>`,
        title      : `[type]&nbsp;[name]`,
        text       : `[location]<br>[description]`,
        imgDataURL : `[dataURL]`,
        url        : `/open/view_id/?[args]`
    }
}

url examples:

`/jaga/refresh/?map=home.map : Sample only: refreshed the map on Jaga home page
`/open/[view_id]/?[args]`    : opens view_id using args (format as URLSearchParams location)

*/

class search_engine {
    
    // ************************************************************************
    // ************************************************************************
    //
    // INITIALIZATION
    //
    // ************************************************************************
    // ************************************************************************
    
    constructor (search_queries = []) {
        this.queries = [];
        if (search_queries.length > 0) {
            for (let i = 0; i < search_queries.length; i++) {
                this.queries.push(search_queries[i]);
            }
        }
    },
    
    add (search_query) {
        this.queries.add(search_query);
    },
    
    
    // ************************************************************************
    // ************************************************************************
    //
    // QUERY EXECUTION
    //
    // ************************************************************************
    // ************************************************************************
    
    execute (what, operator = "OR") {
        return new Promise((resolve)=>{
            
            console.info(`IN search_engine.execute('${what}')`);
            console.log (this.queries);
            
            let values = arrayOf(what, " ");
            
            const url = window.location.origin + "/search.php";
            const payload = {
                queries : payload_encode(this.queries),
                values  : payload_encode(values),
                operator: operator
            };
            
            try {
                fetch(
                    url, {
                        method: "POST", // HTTP method
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload) // Convert JS object to JSON string
                    }
                )
                .then((response)=>{
                    if (response.ok) {
                        response.json().then((obj)=>{
                            if (String(obj["errno"]) === "1000") {
                                resolve(obj["result"]);
                            }
                            else {
                                console.error(`Runtime error ${obj["errno"]}`);
                                resolve([]);
                            }
                        });
                    }
                    else {
                        console.error("Rejected by fetch()");
                        resolve([]);
                    }
                });
            }
            catch (error) {
                console.error("Error during POST request:", error.message);
                resolve([]);
            }
            
        });
    } 
};


// ****************************************************************************
// ****************************************************************************
//
// SEARCH UI
//
// ****************************************************************************
// ****************************************************************************

const search_view = new view('search_view', '', '/lib/html/search_view.html');

jQuery.extend(search_view, {
    
    queries : [],
    
    reset : function() {
        console.info(`IN search_view.reset()`);
        search_view.queries = [];
    },
    
});


// ****************************************************************************
// ****************************************************************************
//
// SEARCH VIEW EXECUTE
//
// ****************************************************************************
// ****************************************************************************

const search = function (queries = []) {
    return new Promise((resolve)=>{
        search_view.reset();
        search_view.queries = queries;
        delay(0).then(()=>{
            exec('search_view').then((res)=>{
                resolve(res);
            });
        });
    });
}


// End of file: search.js
// ============================================================================
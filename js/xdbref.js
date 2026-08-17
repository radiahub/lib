// ============================================================================
// Module      : xdbref.js
// version     : 4.0R0.0
// PHP version : PHP 8+
//
// Author      : Denis Patrice <radiahub@gmail.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2026
//               All rights reserved
//
// Description : Run server script
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 31-Jul-26 00:00 WIT   Denis  Deployment V. 2016 "Pierre Dac"
//
// ============================================================================

var xdbref = {
	
    query : function (dbname, sql) {
        return new Promise((resolve)=>{
            var f = "xdbref_query";
            var a = { dbname:dbname, sql:sql };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },
	
    insert : function (dbname, table, row) {
        return new Promise((resolve)=>{
            var f = "xdbref_insert";
            var a = { dbname:dbname, table:table, row:row };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    update : function(dbname, table, row, args) {
        return new Promise((resolve)=>{
            var f = "xdbref_update";
            var a = { dbname:dbname, table:table, row:row, args:args };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    delete : function(dbname, table, args) {
        return new Promise((resolve)=>{
            var f = "xdbref_delete";
            var a = { dbname:dbname, table:table, args:args };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    rows : function (dbname, sql) {
        return new Promise((resolve)=>{
            var f = "xdbref_rows";
            var a = { dbname:dbname, sql:sql };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    row : function(dbname, sql) {
        return new Promise((resolve)=>{
            var f = "xdbref_row";
            var a = { dbname:dbname, sql:sql };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    locate : function(dbname, table, args) {
        return new Promise((resolve)=>{
            var f = "xdbref_locate";
            var a = { dbname:dbname, table:table, args:args };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

    set : function(dbname, table, row, args) {
        return new Promise((resolve)=>{
            //console.info(`IN xdbref.set()`);
            var f = "xdbref_set";
            var a = { dbname:dbname, table:table, row:row, args:args };
            run(f,a).then((result)=>{
                //console.log(result);
                resolve(result);
            });
        });
    },

    tail_by_recno : function(dbname, table, greater_than_recno, maxrecs, args) {
        return new Promise((resolve)=>{
            var f = "xdbref_tail_by_recno";
            var a = { dbname:dbname, table:table, greater_than_recno:greater_than_recno, maxrecs:maxrecs, args:args };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    },

	    tail_by_updated : function(dbname, table, updated_after, maxrecs, args) {
        return new Promise((resolve)=>{
            var f = "xdbref_tail_by_updated";
            var a = { dbname:dbname, table:table, updated_after:updated_after, maxrecs:maxrecs, args:args };
            run(f,a).then((result)=>{
                resolve(result);
            });
        });
    }

};


// End of file: xdbref.js
// ============================================================================

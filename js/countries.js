// ============================================================================
// Module      : countries.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Countries and phone code support
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 12-May-24 00:00 WIT   Denis  Deployment V. 2024 "LEO MALET"
//
// ============================================================================

var countries = {

    collection : [],
    
    load : function() {
        
        countries.collection = [];
        
        try {
            var filename = "/lib/countries.json";
            let json = freadSync(filename, true);
            
            if (json) {
                for (var i = 0; i < json.length; i++) {
                    
                    const codes = str_replace("-", "", json[i]["code"]);
                    const name  = json[i]["country"];
                    const iso   = json[i]["iso"];
                    
                    const codeList = codes.split(',').map(s => s.trim()).filter(Boolean);                    
                    codeList.forEach((code)=>{
                        countries.collection.push({
                            country: name,
                            code   : code,
                            iso    : iso
                        });
                    }
                    
                }                    
            }                
        }
        catch(e) {
            countries.collection = [];
        }
    },
    
    // sort_by : "code", "iso", "name"
    //
    sort : function(sort_by = "code") {
        
        if (countries.collection.length === 0) {
            countries.load();
        }
        
        const compare = (a,b)=>{
            switch(sort_by.toUpperCase()) {
                case "ISO" : {
                    let a_code = str_replace("-", "", a["code"]);
                    let b_code = str_replace("-", "", b["code"]);
                    return strcmp(a_code, b_code);
                    break;
                }
                case "CODE" : {
                    return strcmp(a["iso"], b["iso"]);
                    break;
                }
                case "NAME" :
                default: {
                    return strcasecmp(a["country"], b["country"]);
                    break;
                }
            }
        };
        let sorted = structuredClone(countries.collection);
        sorted.sort(compare);
        return sorted;
    },
    
	
    // **********************************************************************
    // **********************************************************************
    //
    // SEARCH
    //
    // **********************************************************************
    // **********************************************************************

    indexOf : function(key) {
                
        key = str_replace("+", "", key);
        key = str_replace("-", "", key);
        
        console.info(`IN countries.indexOf() key='${key}'`);

        if (countries.collection.length === 0) {
            countries.load();
        }

        for (var i = 0; i < countries.collection.length; i++) {
            var code = str_replace("-", "", countries.collection[i]["code"]);
            if (key === code) {
                return i;
            }
            else if (strcasecmp(key, countries.collection[i]["iso"]) === 0) {
                return i;
            }
            else if (strmatch(key, countries.collection[i]["country"])) {
                return i;
            }
        }	
	
        return -1;
    },
    
    get : function(key) {
        let idx = countries.indexOf(key);
        if (idx >= 0) {
            return countries.collection[idx];
        }
        return null;
    },
    
    
    // **********************************************************************
    // **********************************************************************
    //
    // PHONE NUMBER API
    //
    // **********************************************************************
    // **********************************************************************
    
    country_code: function(phone_no) {
        if (phone_no.slice(0, 1) === "+") {
            phone_no = phone_no.slice(1);
        }                
        console.info(`IN countries.country_code() phone_no='${phone_no}'`);        
        let sorted = countries.sort("code");
        for (var i = 0; i < sorted.length; i++) {
            let code = str_replace("-", "", sorted[i]["code"]);
            if (strmatch(phone_no, code)) {
                return code;
            }
        }
        return "";
    },
    
    parse_phone_no : function(phone_no) {
        if (phone_no.slice(0, 1) === "+") {
            phone_no = phone_no.slice(1);
        }                
        console.info(`IN countries.parse_phone_no() phone_no='${phone_no}'`);
        let code = countries.country_code(phone_no);
        if (code.length > 0) {
            let local_no = phone_no.slice(code.length);
            let name = "", iso = "";
            let row = countries.get(code);
            console.log(row);
            if (row !== null) {
                name = row["country"];
                iso  = row["iso"];
            }
            return {
                phone_no : phone_no,
                local_no : local_no,
                country  : name,
                code     : code,
                iso      : iso
            }
        }
        return null;
    },
    
    
    // **********************************************************************
    // **********************************************************************
    //
    // SELECT - LIST API
    //
    // **********************************************************************
    // **********************************************************************
    
    options : function(selectId="", selected="", sort_by="country", format_caption="[iso]-[code]-[country]", format_value="[iso],[code],[country]") {
        
        let result = [];
        
        const str = function (template, iso, code, country) {
            let result = template;
            result = result.replaceAll("[iso]", iso);
            result = result.replaceAll("[code]", iso);
            result = result.replaceAll("[country]", iso);
            return result;
        }
        
        let selected_value = str(format_value, COUNTRY_ISO_2LTR, str_replace("+", "", ST_PHONE_CTRY_CODE), COUNTRY_NAME);
        
        if (selected.length > 0) {
            let row = countries.get(selected);
            if (row) {
                selected_value = str(format_value, row["iso"], row["code"], row["country"]);
            }
        }
        
        const sorted = countries.sort(sort_by);
        
        for (let i = 0; i < sorted.length; i++) {
            let caption = str(format_caption, sorted[i]["iso"], sorted[i]["code"], sorted[i]["country"]); 
            let value   = str(format_value,   sorted[i]["iso"], sorted[i]["code"], sorted[i]["country"]);            
            let option = {
                caption : caption,
                value   : value
            };            
            result.push(result);
        }
        
        if (selectId.length > 0) {
            select.options.set(selectId, result);
            delay(0).then(()=>{
                select.set(selectId, selected_value);
            });
        }
        
        return result;
    }
    
};    


// End of file: countries.js
// ============================================================================

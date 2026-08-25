// ============================================================================
// Module      : geocoding.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : Mostly Mapbox-based geolocation/geocoding
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Sep-26 00:00 WIT   Denis  Deployment V. 2026 "Alexandre Dumas"
//
// ============================================================================

const MAPBOX_TOKEN      = 'pk.eyJ1IjoicmFkaWFodWIiLCJhIjoiY201Z2RubzhiMDRyczJ2czR4aGowN2pwNyJ9.gyphW7zZdcov_ZNGfw0edA';
const DEFAULT_LONGITUDE = 106.816666; // Default to Jakarta
const DEFAULT_LATITUDE  = -6.200000;
const DEFAULT_POSITION  = [DEFAULT_LONGITUDE,DEFAULT_LATITUDE];

if (typeof mapboxgl !== "undefined") {
    mapboxgl.accessToken = MAPBOX_TOKEN;
}

/**
 * Calculates the great-circle distance between two points in kilometers or miles.
 * @param {number} lon1 - Longitude of point 1 in decimal degrees
 * @param {number} lat1 - Latitude of point 1 in decimal degrees
 * @param {number} lon2 - Longitude of point 2 in decimal degrees
 * @param {number} lat2 - Latitude of point 2 in decimal degrees
 * @param {string} unit - 'K' for kilometers (default) or 'M' for miles
 * @returns {number} Distance between the two points
 */
function geolocation_distance (lon1, lat1, lon2, lat2, unit = 'K') {
    // Earth's radius: 6371 kilometers or 3956 miles
    const R = unit === 'M' ? 3956 : 6371; 

    // Convert decimal degrees to radians
    const toRadians = (degree) => (degree * Math.PI) / 180;
    
    const dLat  = toRadians(lat2 - lat1);
    const dLon  = toRadians(lon2 - lon1);

    const rLat1 = toRadians(lat1);
    const rLat2 = toRadians(lat2);

    // Haversine core formula
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Final distance
}

/*
// Example Usage: Distance between New York City and London

const nycLat = 40.7128, nycLon = -74.0060;
const londonLat = 51.5074, londonLon = -0.1278;

const distanceKm = geolocation_distance(nycLon, nycLat, londonLon, londonLat, 'K');
const distanceMiles = geolocation_distance(nycLon, nycLat, londonLon, londonLat, 'M');

console.log(`Distance: ${distanceKm.toFixed(2)} km`);     // Output: 5570.22 km
console.log(`Distance: ${distanceMiles.toFixed(2)} miles`); // Output: 3458.13 miles

*/


const get_current_location = function () {
    return new Promise((resolve)=>{
        
        console.info(`IN get_current_location()`);
        
        if (!"geolocation" in navigator) {
            console.error("Geolocation is not supported by your browser.");
            resolve(false);
        }
        else {
            
            const options = {
                enableHighAccuracy: true, // Uses GPS if available
                timeout: 10000,           // Wait max 10 seconds
                maximumAge: 0             // Do not use a cached location
            };
                
            // Request location to force browser location permission dialog
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Success Callback
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const pos = { longitude:lng, latitude:lat };
                    //console.log(pos);
                    resolve(pos);
                },
                (error) => {
                    // Error Callback
                    switch(error.code) {
                        case error.PERMISSION_DENIED: {
                            //console.error("User denied geolocation request");
                            resolve(false);
                            break;
                        }
                        case error.POSITION_UNAVAILABLE:{
                            console.error("Location information is unavailable");
                            resolve(false);
                            break;
                        }
                        case error.TIMEOUT: {
                            console.error("Location request timed out");
                            resolve(false);
                            break;
                        }
                        default: {
                            console.error("Unknown error");
                            resolve(false);
                            break;
                        }
                    }
                },
                options
            );
                
        }
        
    });    
};


const mapbox_forward_geocoding = function (search) {
    return new Promise((resolve)=>{
        
        console.info(`IN mapbox_forward_geocoding() search='${search}'`);
        
        let my_lng = DEFAULT_LONGITUDE;
        let my_lat = DEFAULT_LATITUDE ;
        
        get_current_location().then((position)=>{
            
            if (position !== false) {
                my_lng = position.longitude;
                my_lat = position.latitude ;
            }
            
            const proximity = `${my_lng},${my_lat}`;
            const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${search}&proximity=${proximity}&access_token=${MAPBOX_TOKEN}`;
            //console.log(url);
            
            fetch(url, { method: 'GET' }).then((response)=>{
                if (response.ok) {
                    response.json().then((data)=>{
                        
                        let result = [];
                        /*
                        console.log(data);
                        console.log(data.features[0]);
                        console.log(data.features[0].properties.coordinates.longitude);
                        console.log(data.features[0].properties.coordinates.latitude);
                        resolve(data.features[0].properties.full_address);
                        console.log(data.features.length);
                        */
                        for (let i = 0; i < data.features.length; i++) {
                            const lng = data.features[i].properties.coordinates.longitude;
                            const lat = data.features[i].properties.coordinates.latitude ;
                            const dis = geolocation_distance(lng,lat,my_lng,my_lat);
                            const adr = data.features[i].properties.full_address;
                            const arr = {
                                longitude : lng,
                                latitude  : lat,
                                distance  : dis,
                                type      : data.features[i].properties.feature_type,
                                name      : data.features[i].properties.name,
                                address   : adr
                            };
                            result.push(arr);
                        };
                        
                        //console.log(result);
                        result.sort((a,b)=>{ return (a.distance - b.distance); });
                        resolve(result);
                    });
                }
                else {
                    console.error(`${response.status}`);
                    resolve(false);
                }
            });
            
        });
        
    });
};


const mapbox_reverse_geocoding = function (lng, lat) {
    return new Promise((resolve)=>{
        const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${MAPBOX_TOKEN}`;
        //console.log(url);
        fetch(url, { method: 'GET' }).then((response)=>{
            if (response.ok) {
                response.json().then((data)=>{
                    //console.log(data);
                    //console.log(data.features[0].properties.full_address);
                    resolve(data.features[0].properties.full_address);
                });
            }
            else {
                console.error(`${response.status}`);
                resolve(false);
            }
        });
    });    
};


// End of file: geocoding.js
// ============================================================================

// ============================================================================
// Module      : camera.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : camera
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================

let cameraHTML = "";

// facingMode: one of 'environment', 'user' string values
//
const camera = function(facingMode = 'environment') {
    return new Promise((resolve)=>{
        //console.info(`IN camera()`);
        
        const initAddressTabColor = document.querySelector('meta[name="theme-color"]').getAttribute('content');
        document.querySelector('meta[name="theme-color"]').setAttribute('content',"#000000");
        
        const capture = function() {
            
            const video = document.getElementById('video');
            //console.log(video);
            
            const stopCamera = function() {
                //console.info(`IN camera()->stopCamera()`);
                if (video.srcObject) {
                    video.srcObject.getTracks().forEach((track)=>{
                        //console.log(track.readyState);
                        track.stop();
                        //console.log(track.readyState);
                    });
                    //console.log(video.srcObject?.getTracks());
                    video.srcObject = null;
                }
                //console.log("Camera stopped");
                jQuery(`#camera`).remove();
                jQuery(`#cameraCtrls`).remove();
                unreg_back_button_callback();
                document.querySelector('meta[name="theme-color"]').setAttribute('content', initAddressTabColor);
            };
            
            reg_back_button_callback(()=>{
                //console.log(`IN back_button_callback()`);
                stopCamera();
                resolve(false);
            });
            
            const snap = function() {
                //console.info(`IN camera()->snap()`);
                beep();
                
                const canvas  = document.createElement("canvas");
                canvas.width  = video.videoWidth;   // Actual video width in pixels
                canvas.height = video.videoHeight; // Actual video height in pixels
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/png');
                //console.log("Photo captured as Data URL: ");
                //console.log(dataURL.slice(0,200));
                
                stopCamera();
                resolve(dataURL);
            };
            
            let torchON = false;
            const toggleTorch = async function() {
                const track = video.srcObject.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities.torch) {
                    torchON = (!torchON);
                    track.applyConstraints({
                        advanced: [{ torch: torchON }]
                    })
                    .then(()=>{
                        let dum = (torchON) ? `flash_off` : `flash_on`;
                        jQuery(`#SPAN_LIGHT`).html(dum);
                        const st = (torchON) ? `ON` : `OFF`;
                        //console.log(`Torch is ${st}`);
                    })
                    .catch(()=>{
                        //console.error(`Rejected by track.applyConstraints()`);
                    });
                }
            };
            
            let dobeep = storage.get(`cameraBeep`);
            if (dobeep === null) {
                dobeep = true;
                storage.set(`cameraBeep`, dobeep);
            }
            let dum = (dobeep) ? `volume_off` : `volume_up`;
            jQuery(`#SPAN_SOUND`).html(dum);
            const beep = function() {
                if (dobeep) {
                    const audio = new Audio('/lib/mp3/camera-shutter.wav');
                    audio.volume = 1.0;
                    audio.play().catch(() => {});
                }
            };
            const toggleSound = async function() {
                dobeep = (!dobeep);
                storage.set(`cameraBeep`, dobeep);
                const dum = (dobeep) ? `volume_off` : `volume_up`;
                jQuery(`#SPAN_SOUND`).html(dum);
                const st = (dobeep) ? `ON` : `OFF`;
                //console.log(`Sound is ${st}`);
            };
            
            let zoomValue = 1.0;
            let zoomIncrement = 0.5;
            //let zooming = false;
            jQuery(`#SPAN_ZOOM_VALUE`).html(zoomValue.toFixed(1) + `x`);
            const zoomPlus = function() {
                const track = video.srcObject.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities.zoom) {
                    let dum = zoomValue + zoomIncrement;
                    if (dum <= capabilities.zoom.max) {
                        zoomValue = dum;
                        track.applyConstraints({ advanced: [{ zoom: zoomValue }] });
                        jQuery(`#SPAN_ZOOM_VALUE`).html(zoomValue.toFixed(1) + `x`);
                        //zooming = false;
                    }
                }
            };
            const zoomMinus = function() {
                const track = video.srcObject.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities.zoom) {
                    let dum = zoomValue - zoomIncrement;
                    if (dum >= 1.0) {
                        zoomValue = dum;
                        track.applyConstraints({ advanced: [{ zoom: zoomValue }] });
                        jQuery(`#SPAN_ZOOM_VALUE`).html(zoomValue.toFixed(1) + `x`);
                        //zooming = false;
                    }
                }
            };
            
            let options = { 
                video: {
                    facingMode: facingMode
                },
                audio: false
            };
            
            navigator.mediaDevices.getUserMedia(options).then((stream)=>{
                video.srcObject = stream;
                jQuery(`#BTN_SNAP`).off('click').on('click',function(){
                    ripple("BTN_LIGHT", function() {
                        snap();
                    });
                });
                jQuery(`#BTN_LIGHT`).off('click').on('click',function(){
                    ripple("BTN_LIGHT", function() {
                        toggleTorch();
                    });
                });
                jQuery(`#BTN_SOUND`).off('click').on('click',function(){
                    ripple("BTN_SOUND", function() {
                        toggleSound();
                    });
                });
                jQuery(`#BTN_ZOOM_MINUS`).off('click').on('click',function(){
                    //if (zooming) { return; }
                    //zooming = true;
                    ripple("BTN_ZOOM_MINUS", function() {
                        zoomMinus();
                    });
                });
                jQuery(`#BTN_ZOOM_PLUS`).off('click').on('click',function(){
                    //if (zooming) { return; }
                    //zooming = true;
                    ripple("BTN_ZOOM_PLUS", function() {
                        zoomPlus();
                    });
                });
            })
            .catch((err) => {
                //console.error("Camera error: ", err);
                resolve(false);
            });
            
        };
        
        if (!DOMExists('camera')) {
            if (cameraHTML.length > 0) {
                jQuery(document.body).append(cameraHTML);
                delay(0).then(()=>{ capture(); });
            }
            else {
                //console.log(`Loading camera.html`);
                fread('/lib/html/camera.html').then((buffer)=>{
                    if (buffer) {
                        cameraHTML = buffer;
                        jQuery(document.body).append(cameraHTML);
                        delay(0).then(()=>{ capture(); });
                    }
                });
            }
        }
        else {
            jQuery(`#camera`).show();
            delay(0).then(()=>{ capture(); });
        }
        
    });
}


// End of file: camera.js
// ============================================================================
// ============================================================================
// Module      : codescanner.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2010-2025
//               All rights reserved
//
// Application : General
// Description : scanner for QR and barcode
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 01-Jan-26 00:00 WIT   Denis  Deployment V. 2026 "Leo Malet"
//
// ============================================================================
/*
In the JavaScript ecosystem of ZXing (specifically the official @zxing/library port),
barcode formats are handled via an enum object named BarcodeFormat.
The complete list of official format codes, their internal numeric map indices, and
their descriptions include:

2D Formats (Matrix Codes)

AZTEC (0): Aztec 2D matrix barcode format
DATA_MATRIX (5): Data Matrix 2D barcode format
PDF_417 (10): PDF417 format
QR_CODE (11): QR Code 2D barcode format

1D Product Formats

EAN_8 (6): EAN-8 1D retail format
EAN_13 (7): EAN-13 1D retail format
UPC_A (14): UPC-A 1D retail format
UPC_E (15): UPC-E 1D retail format (compressed)
UPC_EAN_EXTENSION (16): UPC/EAN extension codes (add-on barcodes)

1D Industrial & Linear Formats

CODABAR (1): Codabar 1D format
CODE_39 (2): Code 39 1D industrial format
CODE_93 (3): Code 33 1D format
CODE_128 (4): Code 128 1D commercial format
ITF (8): Interleaved Two of Five 1D format
MAXICODE (9): MaxiCode 2D format
RSS_14 (12): GS1 DataBar Omindirectional/Standard format
RSS_EXPANDED (13): GS1 DataBar Expanded variant
*/
const codeformat = {
    
    formats : [
        { zxing_id: "11", zxing: "QR_CODE" , jsbarcode: "" },
        { zxing_id: "7",  zxing: "EAN_13"  , jsbarcode: "EAN13" },
        { zxing_id: "4",  zxing: "CODE_128", jsbarcode: "CODE128" },
        { zxing_id: "14", zxing: "UPC_A"   , jsbarcode: "UPC" },
        { zxing_id: "15", zxing: "UPC_E"   , jsbarcode: "UPC" },
        { zxing_id: "6",  zxing: "EAN_8"   , jsbarcode: "EAN8" },
        { zxing_id: "1",  zxing: "CODABAR" , jsbarcode: "Codabar" },
        { zxing_id: "8",  zxing: "ITF" ,     jsbarcode: "ITF" },
        { zxing_id: "-1", zxing: "" ,        jsbarcode: "ITF14" },
        { zxing_id: "0",  zxing: "AZTEC"   , jsbarcode: "" },
        { zxing_id: "2",  zxing: "CODE_39" , jsbarcode: "CODE39" },
        { zxing_id: "3",  zxing: "CODE_93" , jsbarcode: "" },
        { zxing_id: "-1", zxing: "" ,        jsbarcode: "pharmacode" }
    ],
    
    get : function(what="", scope="jsbarcode") {
        console.info(`IN codeformat.get() what='${String(what)}' scope='${scope}'`);
        if ((String(what) === "11") || strmatch(what, "QR")) {
            return "QR_CODE";
        }
        if (strlen(what) > 0) {
            for (let i =0; i < codeformat.formats.length; i++) {
                let row = codeformat.formats[i];
                console.log(row);
                if (strmatch(String(what), row["zxing_id"]) || strmatch(what, row["zxing"]) || strmatch(what, row["jsbarcode"])) {
                    return row[scope];
                }
            }
        }
        return false;
    }
    
};

/*
import { BrowserMultiFormatReader } from '@zxing/browser';

// 1. Initialize the multi-format reader
const codeReader = new BrowserMultiFormatReader();

// 2. Reference your HTML canvas element
const canvasElement = document.getElementById('your-canvas-id');

try {
  // 3. Decode directly from the canvas
  const result = await codeReader.decodeFromCanvas(canvasElement);
  
  // 4. Handle the successfully decoded text
  console.log('Decoded text:', result.getText());
} catch (error) {
  // ZXing throws an error if no barcode is found in the current frame
  console.error('No barcode found or error occurred:', error);
}


import { BrowserQRCodeReader } from '@zxing/browser';

const decodeDataUrl = async (dataUrl) => {
  const codeReader = new BrowserQRCodeReader();
  try {
    // Pass the base64 data URL directly as the source argument
    const result = await codeReader.decodeFromImageUrl(dataUrl);
    console.log('Decoded text:', result.getText());
    return result.getText();
  } catch (error) {
    console.error('Decoding failed:', error);
  }
};

// Example usage:
const myDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANS...';
decodeDataUrl(myDataUrl);


<img id="qr-code-element" src="data:image/png;base64,iVBORw0KG..." />

import { BrowserQRCodeReader } from '@zxing/browser';

const decodeFromTag = async () => {
  const codeReader = new BrowserQRCodeReader();
  const imgElement = document.getElementById('qr-code-element');
  
  try {
    const result = await codeReader.decodeFromImageElement(imgElement);
    console.log('Decoded text:', result.getText());
  } catch (error) {
    console.error('Decoding failed:', error);
  }
};
*/
 
const codescanner_testenv = function() {
    console.info(`IN codescanner_testenv()`);
    
    console.log("ZXingBrowser=", window.ZXingBrowser);
    
    const reader = new ZXingBrowser.BrowserMultiFormatReader();
    
    console.log(
        Object.getOwnPropertyNames(
            Object.getPrototypeOf(reader)
        )
    );
    
    console.log(Object.keys(reader));
    
    let proto = Object.getPrototypeOf(reader);
    while (proto) {
        console.log(
            proto.constructor.name,
            Object.getOwnPropertyNames(proto)
        );
        proto = Object.getPrototypeOf(proto);
    }
    
    console.log(Object.keys(ZXingBrowser)); 
};


let codescannerHTML = "";

const codescanner = function() {
    return new Promise((resolve)=>{
        
        //console.info(`IN codescanner()`);
        
    
        const scan = function() {
            //console.info(`IN codescanner()->scan()`);
            
            let controls = null ;
            let stopped  = false;
            let timeout  = null ;
                
            const video = document.getElementById('video');
            
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
            jQuery(`#BTN_LIGHT`).off('click').on('click',function(){
                ripple("BTN_LIGHT", function() {
                    toggleTorch();
                });
            });
            
            
            let dobeep = storage.get(`cameraBeep`);
            if (dobeep === null) {
                dobeep = true;
                storage.set(`cameraBeep`, dobeep);
            }
            let dum = (dobeep) ? `volume_off` : `volume_up`;
            jQuery(`#SPAN_SOUND`).html(dum);
            const beep = function() {
                if (dobeep) {
                    const audio = new Audio('/lib/mp3/select-click.wav');
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
            jQuery(`#BTN_SOUND`).off('click').on('click',function(){
                ripple("BTN_SOUND", function() {
                    toggleSound();
                });
            });
            
            
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
            
            
            const stopCamera = function () {
                if (stopped) {
                    return;
                }
                //console.info('IN stopCamera()');
                if (timeout) {
                    //clearTimeout(timeout);
                    clearInterval(timeout);
                    timeout = null;
                }
                stopped = true;
                if (controls && controls.stop) {
                    controls.stop();
                }
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
                jQuery(`#codescanner`).remove();
                unreg_back_button_callback();
            };
            
            
            let options = { 
                video: {
                    facingMode: 'environment'
                }
            };
            
            navigator.mediaDevices.getUserMedia(options).then((stream)=>{
                
                video.srcObject = stream;
                //console.log("Camera opened");
                
                reg_back_button_callback(()=>{
                    //console.log(`IN back_button_callback()`);
                    stopCamera();
                    resolve(false);
                    //jQuery(`#codescanner`).remove();
                });
                //console.log(`back_button_callback registered`);
                
                const reader = new ZXingBrowser.BrowserMultiFormatReader();
                controls = reader.decodeFromVideoElement(
                    video,
                    (result, err)=>{
                        //console.log(`IN decode callback stopped=${String(stopped)}`);
                        if (stopped) {
                            return;
                        }
                        if (result) {
                            //console.log("code found");
                            if (reader.reset) {
                                reader.reset();
                            }
                            beep();
                            stopCamera();
                            resolve(
                                {
                                    format: result.format,
                                    value : result.text
                                }
                            );
                        }
                    }
                );
                
                let timeval = 0;
                //console.log(document.getElementById(`DIV_TIMER_CURSOR`));
                document.getElementById("DIV_TIMER_CURSOR").style.width = '0%';
                timeout = setInterval(
                    function() {
                        timeval++;
                        if (timeval > 20) {
                            //console.info(`IN timeout callback`);
                            stopCamera();
                            resolve(false);
                        }
                        else {
                            let w = 100 * (timeval / 20);
                            //console.log(w);
                            document.getElementById(`DIV_TIMER_CURSOR`).style.width = `${String(w)}%`;
                        }
                    },
                    1000
                );
            });
        };
        
        if (!DOMExists('codescanner')) {
            if (codescannerHTML.length > 0) {
                jQuery(document.body).append(codescannerHTML);
                delay(0).then(()=>{ scan(); });
            }
            else {
                //console.log(`Loading codescanner.html`);
                fread('/lib/html/codescanner.html').then((buffer)=>{
                    if (buffer) {
                        codescannerHTML = buffer;
                        jQuery(document.body).append(codescannerHTML);
                        delay(0).then(()=>{ scan(); });
                    }
                });
            }
        }
        else {
            jQuery(`#codescanner`).show();
            delay(0).then(()=>{ scan(); });
        }
        
    });
};


class code {
    
    constructor (format = "", value = "") {
        console.info(`IN code.constructor() format='${format}' value='${value}'`);
        this.format = format;
        this.value  = value;
    }
    
    get () {
        console.info(`IN code.get()`);
        return {
            format : this.format,
            value  : this.value
        };
    }
    
    set (format = "", value = "") {
        console.info(`IN code.set() format='${format}' value='${value}'`);
        if (strlen(format) > 0) {
            this.format = format;
        }
        if (strlen(value) > 0) {
            this.value = value;
        }
    }
    
    // eltID : DOM element identifier
    //
    //         QR code: DIV (works best if square)
    //         Barcode: CANVAS
    //
    show (eltID, width=2, height=80, displayValue=true, lineColor="#000000") {
        console.info(`IN code.show(eltID='${eltID}')`);
        if (strmatch(this.format, 'QR')) {
            let size = document.getElementById(eltID).clientWidth;
            jQuery(`#${eltID}`).empty();
            jQuery(`#${eltID}`).qrcode({ width:size, height:size, text:this.value });
        }
        else {
            let options = {
                format       : codeformat.get(this.format),
                lineColor    : lineColor,
                width        : width,
                height       : height,
                displayValue : displayValue
            }
            const canvas = document.getElementById(eltID);
            const ctx = canvas.getContext('2d');
            ctx.reset();
            JsBarcode(`#${eltId}`, this.value, options);
        }
    }
    
    // relevant to QR code : qrsize, margin
    // relevant to barcode : width, height, displayValue, lineColor
    //
    toDataURL(qrsize = 400, margin = 16, width=2, height=80, displayValue=true, lineColor="#000000") {
        var that = this;
        return new Promise((resolve)=>{
            console.info(`IN code.toDataURL(eltID='${eltID}')`);
            if (strmatch(this.format, 'QR')) {
                console.log(`Generate for QR code`);
                
                var divID = "DIV_QRCODE_" + rand_num_str(4);
                var type  = "image/png";
                var size  = qrsize + (2 * margin);
                
                var dummy = size + 50;
                var posY  = "-" + dummy + "px";
                
                var html = '<div id="' + divID + '" class="absolute bg-white flex center" style="top:' + posY +'; left:0px; width:' + size + 'px; height:' + size + 'px;"></div>';
                jQuery(document.body).append(html);
                jQuery('#' + divID).qrcode({ width:qrsize, height:qrsize, text:that.value });
                var qrcode_canvas = jQuery("#" + divID + " canvas").get(0);
                var source = qrcode_canvas.toDataURL(type);
                
                var img = new Image();
                img.onload = function() {
                    let canvas = document.createElement("canvas");
                    canvas.width  = size;
                    canvas.height = size;
                    let context = canvas.getContext("2d");
                    context.fillStyle = "white";
                    context.fillRect (0, 0, size, size);
                    context.drawImage(img, margin, margin);
                    let dataURL = canvas.toDataURL(type);
                    jQuery("#" + divID).remove();
                    resolve(dataURL);
                };
                
                img.src = source;
            }
            else {
                console.log(`Generate for barcode`);
                
                let type  = "image/png";
                let dumID = rand_num_str(4);
                let html  = `<div id="DIV_BARCODE_${dumID}" class="absolute" style="top:-1000px; left:0px; width:100%; height:500px;">
                <canvas id="CANVAS_${dumID}"></>
                </div>`;
                
                jQuery(document.body).append(html);
                delay(0).then(()=>{
                    let options = {
                        format       : codeformat.get(that.format),
                        lineColor    : lineColor,
                        width        : width,
                        height       : height,
                        displayValue : displayValue
                    };
                    const canvas = document.getElementById(`#CANVAS_${dumID}`);
                    JsBarcode(`#CANVAS_${dumID}`, that.value, options);
                    delay(0).then(()=>{
                        let dataURL = canvas.toDataURL(type);
                        jQuery(`#DIV_BARCODE_${dumID}`).remove();
                        resolve(dataURL);
                    });
                });
            }
        });
    }
    
    // relevant to QR code : qrsize, margin
    // relevant to barcode : width, height, displayValue, lineColor
    //
    download(qrsize = 400, margin = 16, width=2, height=80, displayValue=true, lineColor="#000000") {
        var that = this;
        return new Promise((resolve)=>{
            that.toDataURL(qrsize, margin, width, height, displayValue, lineColor).then ((dataURL)=>{
                var filename = "code_" + datetime.now() + "_" + rand_hex_str(4) + ".png";
                var blob = blobFromDataURL(dataURL);
                var a = document.createElement('a');
                a.setAttribute('download', filename);
                a.setAttribute('href', window.URL.createObjectURL(blob));
                a.click();
                resolve();
            });
        });
    }

}


// End of file: codescanner.js
// ============================================================================
// ============================================================================
// Module      : gesture.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : Generic
// Description : Support for touch and gestures (device with touch screen only)
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 14-July-23 00:00 WIT  Denis  Deployment V. 2023 "ALEXANDRE DUMAS"
//
// ============================================================================

function gesture (gestureElement)
{
	var that = this;


	// **************************************************************************
	//
	// Utils
	//
	// **************************************************************************

	this.start = {};
	this.local = {};

	this.minMoveDistance  = 10 ; // Minimum deltaX or deltaY to acknowledge a movement 
	this.minSwipeDistance = 100; // Minimum deltaX or deltaY to acknowledge a swipe
	this.longTapDuration  = 500; // Minimum elapsed time between eventOnStart and eventOnEnd to acknowledge a long tap

	this.eventOnStart = "";
	this.eventOnMove  = "";
	this.eventOnEnd   = "";

	this.DOMelement = function()
	{
		//console.info("IN gesture.DOMelement() gestureElement='" + gestureElement + "'");
		if (typeof gestureElement === "string") {
			return document.getElementById(gestureElement);
		}
		else if (DOMElement(gestureElement)) {
			return gestureElement;
		}
	};

  this.distance = function (event) 
	{
		//console.info("IN gesture.distance()");
		if (isTouchSupported) {
	    return Math.hypot(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
		}
		else {
			return 0;
		}
  };


	// **************************************************************************
	//
	// Runtime events
	//
	// **************************************************************************

	this.callback_ontouchstart = null; // function(event, x, y, distance)
	this.callback_ontouchmove  = null  // function(event, deltaX, deltaY, distance, scaleFactor)
	this.callback_ontouchend   = null; // function(event)
	this.callback_onswipe      = null; // function(event, deltaX, deltaY)
	this.callback_onlongtap    = null; // function(event)

	this.reset = function()
	{
		//console.info("IN gesture.reset()");
		var element = that.DOMelement();
		element.removeEventListener(that.eventOnMove, that.ontouchmove);
		element.removeEventListener(that.eventOnEnd,  that.ontouchend );
		that.start = {};
		that.local = {};
	};

	this.ontouchstart = function(event)
	{
		//console.info("IN gesture.ontouchstart()");
   	//console.log("touchstart event='" + JSON.stringify(event) + "'");

		event.preventDefault();

		that.start.event_time_start = new Date().getTime();

		if (isTouchSupported) {
			if (event.touches.length === 1) {
				that.start.x = event.touches[0].pageX;
				that.start.y = event.touches[0].pageY;	
				that.start.distance = 0;
			}
			else if (event.touches.length === 2) {
				// Calculate the barycenter of the position where the fingers have started on the X and Y axis
				//
				that.start.x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
				that.start.y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
				that.start.distance = that.distance(event);
				//console.log(JSON.stringify(that.start));
			}
		}
		else {
			that.start.x = event.pageX;
			that.start.y = event.pageY;	
			that.start.distance = 0;
		}

		that.local.pageX = that.start.x;
		that.local.pageY = that.start.y;

		if (typeof that.callback_ontouchstart === "function") {
			that.callback_ontouchstart(event, that.start.x, that.start.y, that.start.distance);
		}
	};

	this.ontouchmove = function(event)
	{
		//console.info("IN gesture.ontouchmove()");
   	//console.log("touchmove event='" + JSON.stringify(event) + "'");
		event.preventDefault();

		var deltaX, deltaY, deltaDistance, scaleFactor;

		if (isTouchSupported) {
			if (event.touches.length === 1) {
				deltaDistance = 0;
				scaleFactor = 0;
				deltaX = event.touches[0].pageX - that.start.x;
				deltaY = event.touches[0].pageY - that.start.y;

				that.local.pageX = event.touches[0].pageX;
				that.local.pageY = event.touches[0].pageY;

			}
			else if (event.touches.length === 2) {
				deltaDistance = that.distance(event);
				scaleFactor = deltaDistance / that.start.distance;
				deltaX = (((event.touches[0].pageX + event.touches[1].pageX) / 2) - that.start.x) * 2; // x2 for accelarated movement
				deltaY = (((event.touches[0].pageY + event.touches[1].pageY) / 2) - that.start.y) * 2; // x2 for accelarated movement
				//console.log("deltaX=" + deltaX + ", deltaY=" + deltaY + ", deltaDistance=" + deltaDistance + ", scaleFactor=" + scaleFactor);
				that.local.pageX = that.start.x + deltaX;
				that.local.pageY = that.start.y + deltaY;
			}

			if (typeof that.callback_ontouchmove === "function") {
				that.callback_ontouchmove(event, deltaX, deltaY, deltaDistance, scaleFactor);
			}
		}
		else {
			deltaDistance = 0;
			scaleFactor = 0;
			deltaX = event.pageX - that.start.x;
			deltaY = event.pageY - that.start.y;
			that.local.pageX = event.pageX;
			that.local.pageY = event.pageY;
		}

		if (typeof that.callback_ontouchmove === "function") {
			that.callback_ontouchmove(event, deltaX, deltaY, deltaDistance, scaleFactor);
		}

	};

	this.ontouchend = function(event)
	{
		event.preventDefault();

		var elapsedTime = new Date().getTime() - that.start.event_time_start;
		//console.log(elapsedTime);

		var deltaX = that.local.pageX - that.start.x;
		var deltaY = that.local.pageY - that.start.y;

		//console.info("IN gesture.ontouchend() elapsedTime=" + String(elapsedTime) + "ms, deltaX=" + String(deltaX) + ", deltaY=" + String(deltaY) + ", minSwipeDistance=" + String(that.minSwipeDistance));
		//console.log("touchend event='" + JSON.stringify(event) + "'");

		if ((Math.abs(deltaX) >= that.minMoveDistance) || (Math.abs(deltaY) >= that.minMoveDistance)) {
			if ((typeof that.callback_onswipe === "function") && ((Math.abs(deltaX) >= that.minSwipeDistance) || (Math.abs(deltaY) >= that.minSwipeDistance))) {
				that.callback_onswipe(event, deltaX, deltaY);
			}
			else if (typeof that.callback_ontouchend === "function") {
				that.callback_ontouchend(event);
			}
		}
		else if (elapsedTime >= that.longTapDuration) {
			if (typeof that.callback_onlongtap === "function") {
				that.callback_onlongtap(event);
			}
			else if (typeof that.callback_ontouchend === "function") {
				that.callback_ontouchend(event);
			}
		}
		else if (typeof that.callback_ontouchend === "function") {
			that.callback_ontouchend(event);
		}

		that.start = {};
		that.local = {};
	};


	// **************************************************************************
	//
	// Runtime events API
	//
	// **************************************************************************

	this.off = function(eventname)
	{
		//console.info("IN gesture.off() eventname='" + eventname + "'");
		switch(eventname) {
			case "touchstart": {
				that.callback_ontouchstart = null;
				break;
			}
			case "touchmove": {
				that.callback_ontouchmove = null;
				break;
			}
			case "touchend": {
				that.callback_ontouchend = null;
				break;
			}
			case "swipe": {
				that.callback_onswipe = null;
				break;
			}
			case "longtap": {
				that.callback_onlongtap = null;
				break;
			}
		}
		return that;
	};

	this.on = function(eventname, callback)
	{
		//console.info("IN gesture.on() eventname='" + eventname + "'");
		if (typeof callback === "function") {
			switch(eventname) {
				case "touchstart": {
					that.callback_ontouchstart = callback;
					break;
				}
				case "touchmove": {
					that.callback_ontouchmove = callback;
					break;
				}
				case "touchend": {
					that.callback_ontouchend = callback;
					break;
				}
				case "swipe": {
					that.callback_onswipe = callback;
					break;
				}
				case "longtap": {
					that.callback_onlongtap = callback;
					break;
				}
			}
		}
		return that;
	};


	// **************************************************************************
	//
	// Initialization
	//
	// **************************************************************************

	this.init = function()
	{
		//console.info("IN gesture.init()");

		if (isTouchSupported) {
			that.eventOnStart = 'touchstart';
			that.eventOnMove  = 'touchmove';
			that.eventOnEnd   = 'touchend';
		}
		else {
			that.eventOnStart = 'mousedown';
			that.eventOnMove  = 'mousemove';
			that.eventOnEnd   = 'mouseup';
		}

		var element = that.DOMelement();
		//console.log(element);
		
		element.addEventListener(that.eventOnStart, that.ontouchstart);		
		element.addEventListener(that.eventOnMove,  that.ontouchmove );		
		element.addEventListener(that.eventOnEnd,   that.ontouchend  );		
	};

	this.init();
};


// End of file: gesture.js
// ============================================================================
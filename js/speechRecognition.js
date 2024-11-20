
// ============================================================================
// Module      : speechRecognition.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2022
//               All rights reserved
//
// Application : Generic
// Description : Support for speech recognition
//               Creates the speechRecognition object in window scope 
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 17-Oct-20 00:00 WIT   Denis  Deployment V. 2022 "ALEXANDRE DUMAS"
//
// ============================================================================

window["speechRecognition"] = {

	hasPermission: function()
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.hasPermission(
					function (isGranted){
						resolve(isGranted);
					}, 
					function(err){
						reject(err);
					}
				);
			}
		);
	},

	requestPermission: function()
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.requestPermission(
					function (){
						resolve();
					}, 
					function (err){
						reject();
					}
				);
			}
		);
	},

	startRecognition: function(settings)
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.startListening(
					function(result){
						resolve(result);
					}, 
					function(err){
						reject(err);
					}, 
					settings
				);
			}
		);
	},

	getSupportedLanguages: function()
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.getSupportedLanguages(
					function(result){
						resolve(result);
					}, 
					function(err){
						reject(err);
					}
				);
			}
		);
	},

	isRecognitionAvailable: function()
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.isRecognitionAvailable(
					function(available){
						resolve(available);
					}, 
					function(err){
						reject(err);
					}
				);
			}
		);
	},

	stopListening: function()
	{
		return new Promise(
			function(resolve, reject){
				window.plugins.speechRecognition.stopListening(
					function(){
						resolve();
					}, 
					function(err){
						reject(err);
					}
				);
			}
		);
	},

	text: function(lang)
	{
		if (typeof lang === "undefined") {
			lang = "en-US";
			var dumm = globalizedLang();
			switch(dumm) {
				case "ID" : { lang = "id-ID"; break; }
				case "FR" : { lang = "fr-FR"; break; }
				case "DE" : { lang = "de-DE"; break; }
			}
		}

		console.log("IN window.speechRecognition.text() lang='" + lang + "'");

		return new Promise(
			function(resolve, reject){
				window.speechRecognition.isRecognitionAvailable()
				.then ((available)=>{

					var do_the_job = function() {
						
						console.log("IN window.speechRecognition.text()->do_the_job() lang='" + lang + "'");

						var options = {
							language    : lang,
							matches     : 1,
							prompt      : "Better talk now",
							showPopup   : true,
							showPartial : false
						};

						window.speechRecognition.startRecognition(options) 
						.then ((tokens)=>{
							console.log("Resolved by window.speechRecognition.startRecognition()");
							console.log(JSON.stringify(tokens));
							resolve(tokens);
						})
						.catch(()=>{
							console.error("Rejected by window.speechRecognition.startRecognition()");
							reject();
						});
					};

					if (available) {
						window.speechRecognition.hasPermission()
						.then ((isGranted)=>{
							if (isGranted) {
								do_the_job();
							}
							else {
								window.speechRecognition.requestPermission()
								.then (()=>{
									do_the_job();
								})
								.catch((err)=>{
									console.error("Rejected by window.speechRecognition.requestPermission()");
									console.error(err);
									reject();
								});
							}
						})
						.catch((err)=>{
							console.error("Rejected by window.speechRecognition.hasPermission()");
							console.error(err);
							reject();
						});
					}
					else {
						console.error("Speech recognition is not available");
						reject();
					}

				})
				.catch((err)=>{
					console.error("Rejected by window.speechRecognition.isRecognitionAvailable()");
					console.error(err);
					reject();
				});
			}
		);
	},

	number : function(len, lang)
	{
		if (typeof lang === "undefined") {
			lang = "en-US";
			var dumm = globalizedLang();
			switch(dumm) {
				case "ID" : { lang = "id-ID"; break; }
				case "FR" : { lang = "fr-FR"; break; }
				case "DE" : { lang = "de-DE"; break; }
			}
		}

		if (typeof len === "undefined") { len = 6; }

		console.log("IN window.speechRecognition.number() lang='" + lang + "' len=" + len);

		return new Promise(
			function(resolve, reject){
				window.speechRecognition.isRecognitionAvailable()
				.then ((available)=>{

					var do_the_job = function() {
						
						var result = "";

						console.log("IN window.speechRecognition.number()->do_the_job() lang='" + lang + "' len=" + len);

						var options = {
							language    : lang,
							matches     : 5,
							prompt      : "Talk now",
							showPopup   : true,
							showPartial : true
						};

						window.speechRecognition.startRecognition(options) 
						.then ((tokens)=>{
							//console.log("Resolved by window.speechRecognition.startRecognition()");
							//console.log(JSON.stringify(tokens));
							for (var i = 0; i < tokens.length; i++) {
								//console.log(tokens[i]);
								var dumdum = str_replace(" ", "", tokens[i]);
								if (is_num(dumdum)) {
									result = dumdum;
									break;
								}
							}
							if (strlen(result) === len) {
								resolve(result);
							}
							else {
								reject();
							}
						})
						.catch(()=>{
							console.error("Rejected by window.speechRecognition.startRecognition()");
							reject();
						});

					};

					if (available) {
						window.speechRecognition.hasPermission()
						.then ((isGranted)=>{
							if (isGranted) {
								do_the_job();
							}
							else {
								window.speechRecognition.requestPermission()
								.then (()=>{
									do_the_job();
								})
								.catch((err)=>{
									console.error("Rejected by window.speechRecognition.requestPermission()");
									console.error(err);
									reject();
								});
							}
						})
						.catch((err)=>{
							console.error("Rejected by window.speechRecognition.hasPermission()");
							console.error(err);
							reject();
						});
					}

				})
				.catch((err)=>{
					console.error("Rejected by window.speechRecognition.isRecognitionAvailable()");
					console.error(err);
					reject();
				});

			}
		);
	}

};


// End of file: speechRecognition.js
// ============================================================================
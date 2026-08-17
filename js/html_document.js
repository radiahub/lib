// ============================================================================
// Module      : html_document.js
// Version     : 1.0
//
// Author      : Denis Patrice <denispatrice@yahoo.com>
// Copyright   : Copyright (c) Denis Patrice Dipl.-Ing. 2011, 2012
//               All rights reserved
//
// Application : UI
// Description : HTML document viewer and support for markdown wrapper
//
// Date+Time of change   By     Description
// --------------------- ------ ----------------------------------------------
// 25-May-25 00:00 WIT   Denis  Deployment V. 2025 "Raymond Chandler"
//
// ============================================================================

// ****************************************************************************
// ****************************************************************************
// 
// RENDERING HTML OR PLAIN TEXT DOCUMENTS
//
// ****************************************************************************
// ****************************************************************************

var html_document = {

	// stHtml : HTML source of a html_document (only HTML is supported here)
	//
	toc(stHtml="", tabSpace=1.5)
	{
		console.info("IN html_document.toc()");

        var result = "";

       	if (strlen(stHtml) > 0) {

	        const toc_template = '<div class="flex flex-row flex-left flex-middle" style="height:1.8em; padding-left:[padLeft]em;">'
						       + '  <span class="link" onclick="jQuery(\'#[item_id]\').scrollIntoView();">[caption]</span>'
						       + '</div>';

		    const start =  "<h"; 
		    const end   = "</h"; 
		    
		    let p = stHtml.indexOf(start);
		    while (p >= 0) {

			    let q = stHtml.indexOf(end, p);
			    let n = stHtml.slice(p + 2, p + 3);

			    let tagName = "h" + n;
			    let tagHtml = stHtml.slice(p, q + 4);
			    //console.log(tagName,tagHtml);

			    var arr = xmlTag(tagHtml);
			    //console.log(arr);
                var item_id = (arr.attributes?.id !== "undefined") ? arr.attributes["id"] : "";
			    //var item_id = typeof(arr.attributes["id"] !== "undefined") ? arr.attributes["id"] : "";
			    if (strlen(item_id) === 0) {
				    item_id = tagName + "_" + rand_num_str(4);
				    arr.attributes["id"] = item_id;
			    }

			    // Update original HTML for display
			    //
			    var dumAttr  = variablesArrayToString(arr.attributes, "'");
			    var asString = "<" + tagName + " " + dumAttr + ">" + arr.inline + "</" + tagName + ">";
			    console.log(asString);
			    stHtml = stHtml.slice(0, p) + asString + stHtml.slice(q + 1);

			    // Build TOC result
			    //
			    var stToc   = toc_template;
			    var padLeft = String(tabSpace * parseInt(n));
			    var caption = arr.inline;

			    stToc = str_replace("[padLeft]", padLeft, stToc);
			    stToc = str_replace("[item_id]", item_id, stToc);
			    stToc = str_replace("[caption]", caption, stToc);

			    if (strlen(result) > 0) { result += "\n"; }
			    result += stToc;

			    p = stHtml.indexOf(start, q + 4);
			    //console.log(p);
		    }

        }

        return result;
	},
    
    render : function(eltID, stHtml="", buildTOC=false)
    {
        console.info("IN html_document.show() eltID='" + eltID + "'");
        console.log ("" + strlen(stHtml) + " bytes");
        
        stHtml += "\n" + "<div style=\"height:100px;\">&nbsp;</div>";
        
        let element = (typeof eltID === "string") ? document.getElementById(eltID) : eltID;
        
        if (buildTOC) {
            let theToc = html_document.toc(stHtml);
            let p = stHtml.indexOf("<!-- TOC -->");
            if (p >= 0) {
                stHtml = str_replace("<!-- TOC -->", theToc, stHtml);
            }
            else {
                stHtml = '<div style="margin-top:2.0em;">'
                       + theToc
                       + '</div>';
                       + '<div style="margin-top:2.0em;">'
                       + stHtml
                       + '</div>';
            }
        }
        if (!isYScrollable(element)) {
            jQuery(element).addClass("overflow-y");
        }
        delay(0).then(()=>{
            jQuery(element).html(stHtml);
			if (typeof hljs !== "undefined") {
				delay(0).then(()=>{
					hljs.highlightAll();
				});
			}
        });
    },
    
    // The call to html_document.onthemechanged() is handled by the
    // onthemechanged() method of the page object containing the element
    // displayed by html_document
    //
    onthemechanged : function()
	{
		return new Promise((resolve)=>{

			console.info("IN mdviewer.onthemechanged()");

			var hljsCssDark  = "/import/highlight/styles/stackoverflow-dark.min.css" ;
			var hljsCssLight = "/import/highlight/styles/stackoverflow-light.min.css";

			var themeID   = theme.get();
			var removeCSS = (themeID === "light") ? hljsCssDark  : hljsCssLight;
			var addCSS    = (themeID === "light") ? hljsCssLight : hljsCssDark ;

			var obj = jQuery("link[href='" + addCSS + "']")[0];
			if ((typeof obj !== "undefined") && (obj !== null)) {
				console.log("Already in " + themeID + " theme");
				resolve(true);
			}
			else {
				console.log("Change to " + themeID + " theme");
				css.replace(removeCSS, addCSS)
				.then(()=>{
					console.log("Success");
					resolve(true);
				})
				.catch(()=>{
					console.warn("Failed");
					resolve(false);
				});
			}
		});
	}
	
}

if (typeof theme !== "undefined") {
    theme.themedObjects.add(html_document);
}


// ****************************************************************************
// ****************************************************************************
// 
// WRAPPING USING MARKDOWN WRAPPER INTO HTML DOCUMENTS
//
// ****************************************************************************
// ****************************************************************************

const MARKDOWN_WRAPPER = '```[language]\n[content]\n```';

var markdown_wrapper = {

    toHtml : function(filepath)
    {
        console.info("IN markdown_wrapper.toHtml() filepath='" + filepath + "'");

        var buffer = "";
        
        if (typeof showdown !== "undefined") {

            buffer = freadSync(filepath, false);
            let len = strlen(buffer);
            
            if (strlen(buffer) > 0) {

                console.log("" + len + " bytes read");
            
                let mimetype = mimeTypeFromFileName(filepath);
		        switch(mimetype.toLowerCase()) {
		        
				    case "text/java": {
					    var wrapper = MARKDOWN_WRAPPER;
					    wrapper = str_replace("[language]", "java", wrapper);
					    wrapper = str_replace("[content]", buffer, wrapper);
					    var converter = new showdown.Converter();
					    bufffer = converter.makeHtml(wrapper);
					    break;
				    }
		        
				    case "application/sql": {
					    var wrapper = MARKDOWN_WRAPPER;
					    wrapper = str_replace("[language]", "sql", wrapper);
					    wrapper = str_replace("[content]", buffer, wrapper);
					    var converter = new showdown.Converter();
					    buffer = converter.makeHtml(wrapper);
					    break;
				    }

                    case "text/javascript": {
						var wrapper = MARKDOWN_WRAPPER;
						wrapper = str_replace("[language]", "javascript", wrapper);
						wrapper = str_replace("[content]", buffer, wrapper);
						var converter = new showdown.Converter();
					    buffer = converter.makeHtml(wrapper);
						break;
					}

					case "text/css": {
						var wrapper = MARKDOWN_WRAPPER;
						wrapper = str_replace("[language]", "css", wrapper);
						wrapper = str_replace("[content]", buffer, wrapper);
						var converter = new showdown.Converter();
						buffer = converter.makeHtml(wrapper);
						break;
					}

					case "text/markdown": {
						var converter = new showdown.Converter();
						buffer = converter.makeHtml(buffer);
						buffer = str_replace('<table>','<table class="document">',buffer);
						buffer = str_replace("<pre><code", "<div style=\"overflow-x:auto;\"><pre><code", buffer);
						buffer = str_replace("</code></pre>", "</code></pre></div>\n", buffer);
						break;
					}

					case "text/html":
					case "text/plain" :
					default : {
						break;
					}
                }
                
            }
        }
        
        console.log(buffer);
        return buffer;
    },
    
    renderSourceFile: function(filepath, eltID, toc=false)
    {
	    console.info("IN markdown_wrapper.renderSourceFile() filepath='" + filepath + "' eltID='" + eltID + "'");
        var stHtml = markdown_wrapper.toHtml(filepath);
        if (strlen(stHtml) > 0) {
            html_document.render(eltID, stHtml, toc);
        }
    }
    
}


// End of file: html_document.js
// ============================================================================

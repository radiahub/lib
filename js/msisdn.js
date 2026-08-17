var msisdn = {

	is_phone_no : function()
	{
		var phone_no = msisdn.format(value);
		return (countries.split_phone_number(phone_no) !== null);
	}

	format : function(phone_no, phonecode)
	{
		if (typeof phonecode === "undefined") { phonecode = ST_PHONE_CTRY_CODE; }
		//console.info("IN msisdn.format() phone_no='" + phone_no + "' phonecode='" + phonecode + "'");

		if ((phone_no.indexOf("*") >= 0) ||
				(phone_no.indexOf("#") >= 0) ||
				(phone_no.length < 6)) {
			return phone_no;
		}

		phone_no = str_replace(" ", "", phone_no);
		phone_no = str_replace("-", "", phone_no);
		phone_no = str_replace("(", "", phone_no);
		phone_no = str_replace(")", "", phone_no);

		if (phone_no.slice (0, 1) === "+") {
			return phone_no;
		}
		else if (strmatch(phone_no, phonecode.slice(1))) {
			return "+" + phone_no;
		}
		else {
			var c = phone_no.slice(0, 1);
			switch (c) {
				case "0" : {
					phone_no = phonecode + phone_no.slice(1);
					break;
				}
				default : {
					phone_no = phonecode + phone_no;
					break;
				}
			}
		}

		return phone_no;
	},

	asText: function(phone_no)
	{
				phone_no = msisdn.format(phone_no);
				//console.info("IN msisdn.asText() phone_no='" + phone_no + "'");
				if (typeof inputmask !== "undefined") {
							
							var arr = countries.split_phone_number(phone_no);
							//console.log(JSON.stringify(arr));
							
							var html = '<div id="CONT_INP_RADIAHUB_MSISDN_AS_TEXT" class="absolute" style="top:-1000px; width:100px; height:100px; left:-1000px;">'
							         + '<input id="INP_RADIAHUB_MSISDN_AS_TEXT" type="text" value="">'
							         + '</div>';
							jQuery(document.body).append(html);
							
							var len = strlen(arr["number"]);
							//var mask = (len <= 9) ? "999-999-999[9]" : "999-9999-[99999]";
							var mask = "";
							if (len < 4) {
										mask = "999[9]"
							}
							else if (len <= 6) {
										mask = "999-[99999]"
							}
							else if (len <= 9) {
										mask = "999-999-[99999]";
							}
							else {
										mask = "999-9999-[99999]";
							}
							
							jQuery("#INP_RADIAHUB_MSISDN_AS_TEXT").val(arr["number"]);
							jQuery("#INP_RADIAHUB_MSISDN_AS_TEXT").inputmask({ mask: mask, greedy:false, placeholder:" " });
							
							var result = "+" + arr["code"] + " " + String(jQuery("#INP_RADIAHUB_MSISDN_AS_TEXT").val());
							
							jQuery("#CONT_INP_RADIAHUB_MSISDN_AS_TEXT").remove();
							return result;							
				}
				else {
							return phone_no;
				}
				
	}
	
};


// End of file: msisdn.js

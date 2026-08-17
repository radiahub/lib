/*
 *
 	datetime.js : Date and time manipulations
	version 1.0.0 2020-04-01 Denis
 *
 */

const currentYear = ()=>{ 
	   return new Date().getFullYear(); 
}

// month is zero-indexed: 0=january, 1=february, 2=march, etc.
//
const days_in_month = (year=currentYear(), month=2)=>{
	   return new Date(year, month, 0).getDate();
}


// HANDLE DATE FORMAT YYYY-DD-MMTHH:NN:SS+07:00
//
var datetime = {

	asMomentString : (sql_timestamp) => {
		var dummy = str_replace(" ", "T", sql_timestamp);
		dummy += "+07:00";
		return dummy;
	},

  moment : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result;
  },

	toDate : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate).toDate() : moment().toDate();
    return result;
	},

  now : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("YYYYMMDDHHmmss");
  },

	epoch : (objDate) => {
    var millisec = (typeof objDate !== "undefined") ? moment(objDate).valueOf() : moment().valueOf();
    return millisec;
	},

  get : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("YYYY-MM-DDTHH:mm:ssZ");
  },

  sql : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("YYYY-MM-DD HH:mm:ss");
  },

  day : (objDate) => {
		if (typeof objDate === "string") {
			objDate = new Date(objDate);
		}
		var d = String(objDate.getDay());
		//console.log(d);
    return d; // 0 = Sunday
  },

  dayname : (objDate) => {
		//console.log(objDate);
		if (typeof objDate === "string") {
			objDate = new Date(objDate);
		}
		//console.log(objDate);
		var result = "";
		var d = objDate.getDay();
		//console.log(d);
		switch(String(d)) {
			case "0": result = R.get("sunday"); break;
			case "1": result = R.get("monday"); break;
			case "2": result = R.get("tuesday"); break;
			case "3": result = R.get("wednesday"); break;
			case "4": result = R.get("thursday"); break;
			case "5": result = R.get("friday"); break;
			case "6": result = R.get("saturday"); break;
		}
		//console.log(result);
		return result;
  },

  week : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.isoWeekYear();
  },

  long : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("LLLL");
  },

  unixsecs : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("X");
  },

  timezone : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
    return result.format("Z");
  },

  cmp : (objDate1, objDate2) => {
    return (datetime.unixsecs(objDate1) - datetime.unixsecs(objDate2));
  },

  elapsedSeconds : (objDate1, objDate2) => {
    return Math.abs(datetime.cmp(objDate1,objDate2));
  },

  elapsedDays : (objDate1, objDate2) => {
    var moment1 = (typeof objDate1 === "string") ? moment(objDate1) : moment();
    var moment2 = (typeof objDate2 === "string") ? moment(objDate2) : moment();
		var date1   = moment1.format("YYYY-MM-DDT00:00:00Z");
		var date2   = moment2.format("YYYY-MM-DDT00:00:00Z");
    return parseInt((datetime.elapsedSeconds(date1, date2) / (24*60*60)));
  },

	/*
	--------------------------------------------------
	shortcuts for datetime.add(), datetime.subtract()
	Always use plurals ("months" rather than "month")

	years	      y
	quarters	  Q
	months	      M
	weeks	      w
	days	      d
	hours	      h
	minutes	      m
	seconds	      s
	milliseconds ms
	
	sample usage:
	datetime.moment(datetime.add(2,"DAYS")).toDate()
	--------------------------------------------------
	*/
	
	add : (number, what, objDate, as_sql_format)=>{
		if (typeof as_sql_format === "undefined") {
			as_sql_format = false;
		}
		number = parseInt(number);
		var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
		if (as_sql_format) {
			return result.add(number, what).format("YYYY-MM-DD HH:mm:ss");
		}
		else {
			return result.add(number, what).format("YYYY-MM-DDTHH:mm:ssZ");
		}
	},
	
	subtract : (number, what, objDate, as_sql_format)=>{
		if (typeof as_sql_format === "undefined") {
			as_sql_format = false;
		}
		number = parseInt(number);
		var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
		if (as_sql_format) {
			return result.subtract(number, what).format("YYYY-MM-DD HH:mm:ss");
		}
		else {
			return result.subtract(number, what).format("YYYY-MM-DDTHH:mm:ssZ");
		}
	},

	today : (objDate) => {
		var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
		return result.format("YYYY-MM-DDTHH:mm:ssZ");
	},

	yesterday : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
		return result.subtract(1, "DAY").format("YYYY-MM-DDTHH:mm:ssZ");
	},
	
	tomorrow : (objDate) => {
    var result = (typeof objDate !== "undefined") ? moment(objDate) : moment();
		return result.add(1, "DAY").format("YYYY-MM-DDTHH:mm:ssZ");
	}
};


// End of file: datetime.js

var express = require('express');
var app = express();
var port = 8080;
var format;
//convert unix time to natural time
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = ''+month + ' ' + date + ', ' + year;
  return time;
}
//make sure natural time keeps correct Month date, YYYY format
function naturalDate(time){
	date_arr = time.split(" ");
	var months = {'jan':'January','feb':'February','mar':'March','apr':'April','jun':'June','jul':'July','aug':'August','sep':'September','oct':'October','nov':'November','dec':'December'}
	var month = months[date_arr[0].toLowerCase().slice(0,3)];
	var day = date_arr[1].slice(0,date_arr[1].length - 1);
	var year = date_arr[2];
	var date = month + ' ' + day + ', ' + year;
	if(year.length !== 4 || day.length > 2 || month == undefined){//return null results if incorrect string input
		date = null;
	}
	return date
}
app.use(express.static('css'))//direct express to css folder
app.set('view engine', 'ejs');//start view egnine for express and sets default file extension
app.get('/',function(req,res){//homepage
	res.render('home',{port:port});
})

app.get('/:timestamp',function(req,res){
	var str = req.params.timestamp
	if(str.match(/[a-z]/i)){//its natural time
		var natural = naturalDate(str);
		if(natural){
			var unix = new Date(str).getTime()/1000//convert to unix time
		}
		else{
			var unix = null;
		}	
	}
	else {//its unix time - get natural time
		if(str.length === 10){
			var unix = str;
			var natural = timeConverter(str);
		}
		else {
			var unix = null;
			var natural = null;
		}
	}
	var results = JSON.stringify({'unix': unix, 'natural': natural});
	res.end(results);
});

app.listen(port);
console.log('Server is starting on port',port);
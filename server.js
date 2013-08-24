var express = require('express')
, url = require('url')
, app = express()
, MongoClient = require('mongodb').MongoClient;

app.configure(function(){
	//app.use("/public", express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(app.router); 
});

//require('./modules/init.js')(app); //smenul lui sabin

MongoClient.connect('mongodb://localhost:27017/raspstore', function(err,db) {
	if(err) throw err;
	
	//<modules>
	var API = require('./modules/api.js');
	//</modules>
	
	// <routes>
	require('./routes/route_static')(db,app);
	require('./routes/route_api.js')(db,app);
	require('./routes/route_test.js')(db,app);
	// </routes>
	
	app.get('/', function(req, res){
	  res.send('Hello World');
	});

	app.listen(3000);
	console.log('Listening on port 3000!');
});
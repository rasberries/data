var API = require('./../modules/api.js');
var url = require('url');

module.exports = function(db,app){
	app.get('/api/login', function(req,res){
		var url_parts = url.parse(req.url,true);
		console.log(url_parts.query);
		var params = url_parts.query;
		params.db = db;
		API.tryLogin(params,function(valid){
			if(valid){
				console.log('yeah he\'s legit! let him pass!');
			}
			else
				console.log('nope ... never seen him!');
		});
	});
	app.post('/api/register', function(req,res){
		//
	});
	app.post('/api/update_app', function(req,res){
		console.log(req.body);
		var name = req.body.input_name;
		var desc = req.body.input_desc;
		delete req.body.input_name;
		delete req.body.input_desc;
		console.log(req.body);
	});
	app.get('/api/list_apps',function(req,res){
		console.log('Get -> list_apps');
		db.collection('apps').find({},{"name":true,"id":true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) console.log(err);
				if(docs){
					console.log('docs found in list_apps!');
				}
				else {
					console.log('No apps found :(');
				}
			});
		});
	});
	app.post('/api/test', function(req,res){
		console.log('posted data to test');
		console.log(req.body);
		res.end();
	});
};
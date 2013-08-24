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
		//
	});
	app.get('/api/list_apps',function(req,res){
		console.log('Get -> list_apps');
		db.collection('apps').find({},{"name":true,"id":true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) console.log(err);
				if(docs){
					console.log('docs found in list_apps!');
					res.send(docs);
				}
				else {
					res.send(404);
					console.log('No apps found :(');
				}
			});
		});
	});
	app.get('/api/apps',function(req,res){
		console.log('Get ');
	});
	app.post('/api/test', function(req,res){
		console.log('posted data to test');
		console.log(req.body);
		res.end();
	});
};
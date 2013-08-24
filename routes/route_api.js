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
	app.post('/api/register'
	app.post('/api/test', function(req,res){
		console.log('posted data to test');
		console.log(req.body);
		res.end();
	});
};
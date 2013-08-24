var API = require('./../modules/api.js');
var url = require('url');
var crypto = require('crypto');

module.exports = function(db,app){
	app.post('/api/users/register',function(req,res){
		console.log('!! POST /api/users/register ...');
		db.collection('users').findOne({mail:req.body.mail},function(err,user_doc){
			if(err) throw err;
			if(user_doc){
				console.log('user already exists!');
				res.send(404);
			}
			else{
				var hash_pass = crypto.createHash('sha256').update(req.body.password.toString()).digest('hex');
				console.log(hash_pass);
				var user ={};
				user.mail = req.body.mail;
				user.password = hash_pass;
				console.log(user);
				db.collection('users').insert(user,function(err,result){
					if(err) throw err;
					if(result){
						console.log('POST on /api/users/register successful !');
						res.send(200);
					}
					else{
						console.log('POST on /api/users/register failed !');
						res.send(404);
					}
				});
			}
		});
	});
	app.get('/api/users/login', function(req,res){
		console.log('!! GET /api/users/login .... ');
		var url_parts = url.parse(req.url,true);
		console.log(url_parts.query);
		console.log(url_parts);
		var params = url_parts.query;
		params.db = db;
		API.tryLogin(params,function(valid){
			if(valid){
				res.send(200);
				console.log('yeah he\'s legit! let him pass!');
			}
			else
			{
				res.send(404);
				console.log('nope ... never seen him!');
			}
		});
	});
	
	app.get('/api/apps/:id',function(req,res){
		console.log('!! GET /api/apps/:id/ .... ');
		db.collection('apps').findOne({id : req.params.id},function(err,app_doc){
			if(err) throw err;
			if(app_doc){
				console.log('GET /api/apps/:id succeeded!');
				console.log(app_doc);
				res.send(app_doc);
			}
			else
			{
				console.log('GET /api/apps/:id failed!');
				res.send(404);
			}
		});
	});
	app.get('/api/devices/:uid',function(req,res){
		console.log('!! GET /api/devices/:uid/ .... ');
		db.collection('devices').find({uid:req.params.uid},{"apps_inst":true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) throw err;
				if(docs){
					console.log('GET /api/devices/:uid succeeded!');
					console.log(docs);
					res.send(docs);
				}
				else
				{ 
					console.log('GET /api/devices/:uid failed!');
					res.send(404);
				}
			});
		});
	});
	//Add device to device collection
	app.post('/api/devices/register',function(req,res){
		console.log('!! POST /api/devices/register ...');
		var devson = {};
		
		devson.user_id = req.body.username;
		devson.uid = req.body.uid;
		devson.name = req.body.name;
		
		db.collection('devices').findAndModify({uid:req.body.uid},{},devson,{upsert:true},function(err,app_doc){
			if(err)throw err;
			if(app_doc){
				console.log('POST /api/devices/register succeeded!');
				res.send(200);
			}
			else{
				console.log('POST /api/devices/register failed!');
				res.send(404);
			}
		});
	});
	
	//de verificat daca exista deja!
	app.post('/api/devices/add_app',function(req,res){
		console.log('!! POST /api/devices/add_app ...');
		db.collection('devices').findOne({uid:req.body.uid}, function(err, device_doc){
			if(err)throw err;
			if(device_doc){
				res.send(404);

			}
			else 
				db.collection('devices').update({uid:req.body.uid},{$push:{app_queue:req.body.app_id}},{safe:true},function(err,result){
					if(err) throw err;
					if(result){
						res.send(200);
						console.log('POST /api/devices/add_app succeeded!');
					}
					else{
						res.send(404);
						console.log('POST /api/devices/add_app failed!');
					}
				});
		});
		
	});
	//de intrebat daca tinem :id sau scriem in body. Nu mai intrebam nimic... scriem in body
	app.post('/api/apps/update/',function(req,res){
		console.log('!! POST api/apps/update ...');
		db.collection.findAndModify({id:req.body.id},{},req.body,{upsert:true},function(err,app_doc){
			if(err) throw err;
			if(app_doc){
				console.log('POST /api/apps/update/:id succeeded!');
				res.send(200);
			}
			else{
				console.log('POST /api/apps/update/:id failed!');
				res.send(404);
			}
		});
	});
	
	/*//insert app ... de intrebat daca pastram sau tinem doar update cu upsert. 
	app.post('/api/apps/register',function(req,res){
		
		console.log('!! GET /api/apps/register ...');
		db.collection('apps').insert(req.body,function(err,results){
			if(err) throw err;
			if(results){
				console.log('Inserted app into "apps" collection');
				console.log(results);
				res.send(200);
			}
			else{
				res.send(404);
				console.log('Nothing was inserted into "apps" database');
			}
		});
	});*/
	//
	app.get('/api/users/:id/apps',function(req,res){
		
	});
	app.get('/api/apps',function(req,res){
		console.log('!! GET /api/apps ...');
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
	app.post('/api/test', function(req,res){
		console.log('!! posted data to test');
		console.log(req.body);
		res.end();
	});
};
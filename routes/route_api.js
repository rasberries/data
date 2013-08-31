var API = require('./../modules/api.js');
var url = require('url');
var crypto = require('crypto');

module.exports = function(db,app){
	//
	//API / USERS
	//
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
	
	app.get('/api/users/:mail/apps',function(req,res){
		console.log('!! GET /api/users/:mail/apps ...');
		db.collection('apps').find({author:req.params.mail},{"name":true,"id":true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) console.log(err);
				if(docs){
					console.log('GET /api/users/:id/apps succeeded!');
					res.send(docs);	
				}
				else{
					console.log('GET /api/users/:id/apps failed!');
					res.send(404);
				}
			});
		});
	});
	
	app.get('/api/users/devices/:mail',function(req,res){
		console.log('!! POST /api/users/devices ...');
		db.collection('users').find({mail:req.params.mail},{user_devices:true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) throw err;
				if(docs){
					console.log('GET /api/users/devices/:mail suceeded!');
					res.send(docs);
				}
				else{
					console.log('GET /api/users/devices/:mail failed!');
					res.send(404);
				}
			});
		});
	});
	
	
	//
	//API / APPS
	//
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
	app.get('/api/apps/:id',function(req,res){
		console.log('!! GET /api/apps/:id/ .... ');
		db.collection('apps').findOne({id : req.params.id},function(err,app_doc){
			if(err) throw err;
			if(app_doc){
				console.log('GET /api/apps/:id succeeded!');
				res.send(app_doc);
			}
			else{
				console.log('GET /api/apps/:id failed!');
				res.send(404);
			}
		});
	});
	
	app.post('/api/apps/update',function(req,res){
		console.log('!! POST api/apps/update ...');
		db.collection('apps').findAndModify({id:req.body.id},{},req.body,{upsert:true},function(err,app_doc){
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
	
	app.post('/api/apps/remove',function(req,res){
		console.log('!! POST api/apps/update ...');
		db.collection('apps').remove({id:req.body.id},function(err,removed){
			if(err)	throw error;
			if(removed){
				console.log('POST /api/apps/remove succeeded! ');
				res.send(200);
			}
			else{
				console.log('POST /api/apps/remove failed');
				res.send(404);
			}
		});
	});
	
	//
	// API / DEVICES
	//
	
	
	//get device info
	/*app.get('/api/devices/:uuid',function(req,res){
		console.log('!! GET /api/devices/:uuid .... ');
		db.collection('devices').find({uuid:req.params.uuid},{"apps_installed":true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) throw err;
				if(docs){
					console.log('GET /api/devices/:uuid succeeded!');
					console.log(docs);
					res.send(docs);
				}
				else{ 
					console.log('GET /api/devices/:uuid failed!');
					res.send(404);
				}
			});
		});
	});*/
	
	app.post('/api/devices/remove',function(req,res){
		console.log('!!! POST /api/devices/remove...');
		db.collection('devices').remove({uuid:req.body.uuid},function(err,removed){
			if(err) throw err;
			if(removed){
				console.log('POST /api/devices/remove successfull!');
				res.send(200);
			}else{
				console.log('POST /api/devices/remove successful!');
				res.send(404);
			}
		});
	});
	
	//return entire object
	app.get('/api/devices/:uuid',function(req,res){
		console.log('!! GET appi/devices ...');
		db.collection('devices').findOne({uuid:req.params.uuid},function(err,device_doc){
			if(err) throw err;
			if(device_doc){
				console.log('!! GET appi/devices/:uuid succeeded!');
				res.send(device_doc);
			}
			else{
				console.log('!! GET appi/devices/:uuid failed!');
				res.send(404);
			}
		});
	});
	//Add device to device collection
	app.post('/api/devices/register',function(req,res){
		console.log('!! POST /api/devices/register ...');
		var devson = {};
		
		devson.mail = req.body.mail;
		devson.uuid = req.body.uuid;
		devson.name = req.body.name;
		//
		devson.app_stack=[];
		devson.installed_apps=[];
		console.log(req.body);
		/*db.collection('devices').findOne({uuid:req.body.uuid},function(err,device_doc){
			if(err) throw err;
			if(device_doc){
				console.log('Device already registered!');
				res.send(404);
			}
			else{*/
		db.collection('devices').findAndModify({uuid:devson.uuid},{},devson,{upsert:true},function(err,app_doc){
			if(err)throw err;
			if(app_doc){
				db.collection('users').update({mail:devson.mail},{$push:{user_devices:devson.uuid}},{safe:true},function(err,result){
					if(err) throw err;
					if(result){
						console.log('POST /api/devices/register succeeded!');
						res.send(200);
					}
					else{
						console.log('POST /api/devices/register failed inside collection users update!');
						res.send(404);
					}
				});
			}
			else{
				console.log('POST /api/devices/register failed!');
				res.send(404);
			}
		});
		/*	}
		});	*/
	});
	

	
	app.get('/api/devices/:uuid/apps',function(req,res){
		console.log('!! GET /api/devices/:uuid/apps');
		db.collection('devices').find({uuid:req.params.uuid},{app_stack:true},{},function(err,cursor){
			if(err) throw err;
			cursor.toArray(function(err,docs){
				if(err) throw err;
				if(docs){
					console.log('GET /api/devices/:uuid/apps succeeded!');
					res.send(docs);
				}
				else{
					console.log('GET /api/devices/:uuid/apps failed!');
					res.send(404);
				}
			});
		});
	});

	
	app.post('/api/devices/stack_app',function(req,res){
		console.log('!! POST /api/devices/stack_app ...');
		db.collection('devices').update({uuid:req.body.uuid},{$push:{app_stack:req.body.app_id}},{safe:true},function(err,result){
			if(err) throw err;
			if(result){
				res.send(200);
				console.log('POST /api/devices/stack_app succeeded!');
			}
			else{
				res.send(404);
				console.log('POST /api/devices/stack_app failed!');
			}
		});
	});
	
	app.put('/api/devices/move_app',function(req,res){
		console.log('!! PUT /api/devices/move_app ...');
		db.collection('devices').findOne({uuid:req.body.uuid},function(err,device_doc){
			if(err) throw err;
			if(device_doc){
				console.log('Found device .... length: ' + device_doc.app_stack.length);
				for(var i = 0 , maxi = device_doc.app_stack.length; i < maxi; i++ ){
					console.log('Inside for ; i= '+ i);
					if (device_doc.app_stack[i] == req.body.app_id){
						console.log('found app!');
						device_doc.app_stack.splice(i,1);
						break;
					}
				}
				device_doc.installed_apps.push(req.body.app_id);
				db.collection('devices').update({uuid:req.body.uuid},device_doc,{safe:true},function(err,result){
					if(err) throw err;
					if(result){
						res.send(200);
						console.log('PUT /api/devices/move_app succeeded!');
					}
					else{
						res.send(404);
						console.log('PUT api/devices/move_app failed');
					}
				});
			}else{
				console.log('PUT /api/devices/move_app :  No device found!');
				res.send(404);
			}
		});
	});
	
	//de intrebat daca tinem :id sau scriem in body. Nu mai intrebam nimic... scriem in body
	
	
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

};
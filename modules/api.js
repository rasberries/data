var crypto = require('crypto');

var app;



exports.tryLogin = function(params,cb){
	console.log('inside tryLogin!');
	console.log('mail: '+params.mail);
	console.log('pass: '+params.password);
    var hash_pass = crypto.createHash('sha256').update(params.password).digest('hex');
	console.log('hash pass: ' + hash_pass);
	db = params.db;
	db.collection('users').findOne({mail:params.mail,password:hash_pass},function(err,user_doc){
		if(err)throw err;
		if(user_doc){
			console.log('Found user! Yay');
			if (cb && typeof(cb) === "function") cb(true); 
		}else
			if (cb && typeof(cb) === "function") cb(false);
	});
};
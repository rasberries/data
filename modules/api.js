var crypto = require('crypto');

var app;

exports.tryLogin = function(params,cb){
    var hash_pass = crypto.createHash('sha256').update(params.password).digest('hex');
	db = params.db;
	db.collection('users').findOne({username:params.mail,password:hash_pass},function(err,user_doc){
		if(err)throw err;
		if(user_doc){
			if(typeof cb === 'function') cb(true)
			else cb(false);
		}
	});
};
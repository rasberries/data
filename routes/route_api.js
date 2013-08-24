module.exports = function(db,app){
	app.get('/api/login?:mail&.:password', function(req,res){
		var params ={};
		params.mail = req.params.username;
		params.password = req.params.password;
		params.db = db;
		API.tryLogin(params,function(valid){
			if(valid){ 
				console.log('yeah it works!');
				res.send(200);
			}
			else
			{
				console.log('nope not today!');
				res.send(300);
			}
		});
	});
	app.post('/api/test', function(req,res){
		console.log('posted data to test');
		console.log(req.body);
		res.end();
	});
};
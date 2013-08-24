module.exports = function(db,app){
	app.get('/dev_dash_create',function(req,res){
		res.sendfile(__dirname + '/dev_dash_create.html');
	});
};
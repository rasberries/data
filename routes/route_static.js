module.exports = function(db,app){
	app.get('/dev_dash_create',function(req,res){
		res.sendfile('dev_dash_create.html');
	});
};
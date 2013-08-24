module.exports = function(db,app){
	app.get('/test',function(req,res){
		console.log('fired test event!');
		db.collection('users').findOne({password:'testpass'},function(err,doc){
			if(err) throw err;
			if(doc) console.log(doc);
			else console.log('No user found!');
			res.end();
		});
	});
};
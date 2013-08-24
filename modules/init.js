var express = require('express');

module.exports = function(app){
	if(!app) {
		app = express();
		app.configure(function(){
			app.use("/public", express.static(__dirname + '/public'));
			app.use(express.bodyParser());
			app.use(app.router); 
		});
	}
};
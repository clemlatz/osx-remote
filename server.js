var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var applescript = require('applescript');

var config = require('./config.json');

if (typeof config.server.password === 'undefined' || config.server.password == '') 
{
	console.log('Error : you need to set a password in config.json. Exiting...');
	process.exit(1);
}

// Client page
app.get('/', function(req, res){
	config.server.hostname = req.headers.host;
	res.render(__dirname+'/client.ejs', {
	  	"config": config
	});
});

// HTTP Server
http.listen(config.server.port, function(){
  	console.log('Listening on port '+config.server.port);
});
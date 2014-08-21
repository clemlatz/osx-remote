// Load modules
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var applescript = require('applescript');

// Load config
if (fs.existsSync('./config.json'))
{
	var config = require('./config.json');
}
else
{
	console.log('Error : config.json not found. Exiting...');
	process.exit(1);
}

// Check if password is set
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

// Socket server
io.on('connection', function(socket){
	console.log('a user connected');
	
	// On user login
	socket.on('login', function(password){
    	if (password == config.server.password)
    	{
	    	socket.emit('connected', 'xxx');
    	}
    	else
    	{
    		console.log('login failed with password: '+password);
	    	socket.emit('alert', 'Wrong password !');
    	}
	});
	
	// User disconnect
	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});
	
});

// HTTP Server
http.listen(config.server.port, function(){
  	console.log('Listening on port '+config.server.port);
});
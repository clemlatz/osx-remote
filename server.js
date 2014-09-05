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
	socket.auth = false;
	
	// On user login
	socket.on('login', function(password){
    	if (password == config.server.password)
    	{
	    	socket.emit('connected', true);
	    	socket.auth = true;
    	}
    	else
    	{
    		console.log('login failed with password: '+password);
	    	socket.emit('alert', 'Wrong password !');
    	}
	});
	
	// Say something
	socket.on('say', function(msg) {
		if (!socket.auth) socket.emit('alert', 'Authentification error, reload the page.');
		else if (!config.modules.say.active) socket.emit('alert', 'Say module is not active.');
		else
		{
			console.log('User making me say: '+msg);
			var script = 'say "'+msg+'"';
			applescript.execString(script, function(err, rtn) {
				if (err) socket.emit('alert', err);
			});
		}
	});
	
	// Launch app
	socket.on('launch', function(launch) {
		if (!socket.auth) socket.emit('alert', 'Authentification error, reload the page.');
		else if (!config.modules.launcher.active) socket.emit('alert', 'Launcher module is not active.');
		else
		{
			console.log('User launching an app: '+launch);
			
			var script = 'tell application "'+launch+'" to launch';
			applescript.execString(script, function(err, rtn) {
				if (err)
				{
					err.forEach( function(msg) {
						console.log('Error:'+msg);
						socket.emit('alert', err);
					});
				}
			});
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
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var applescript = require('applescript');

var server = {
	"name": "My OSX-Remote Server",
	"port": 80,
	"modules": {
		"computer": true,
		"applescript": true
	}
}

// Client page
app.get('/', function(req, res){
	server.hostname = req.headers.host;
  res.render(__dirname+'/client.ejs', {
	  "server": server
  });
});

// Socket server
io.sockets.on('connection', function (socket) {
	
	socket.on('message', function (message) {
	        console.log('Un client me parle ! Il me dit : ' + message);
	    });
	
    console.log('User connected');
	
	    // Quand le serveur reçoit un signal de type "message" du client    
	    socket.on('launch', function (apptolaunch) {
	        console.log('User asked to launch ' + apptolaunch);
	    });	
		
});

// HTTP Server
http.listen(server.port, function(){
  console.log('Listening on port '+server.port);
});
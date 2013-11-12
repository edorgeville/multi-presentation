var heroku = false;

var express = require("express");
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server)
	, fs = require('fs')
	, url = require('url')
	, os = require('os');

app.use(express.logger());

app.use(express.static(__dirname + '/public'));

io.configure(function () { 
  if(heroku){
  	io.set("transports", ["xhr-polling"]); 
  	io.set("polling duration", 10);
  } 
});

var currentIndex=1;

io.sockets.on('connection', function (socket) {
	socket.emit('connection', { connected:true, id: socket.id });
	socket.on('device', function (data) {
		if(data.type == "desktop"){
			socket.join('room');
			socket.emit('room', { joined: true });
		}
		else if(data.type == "mobile"){
			socket.join('room');
			socket.emit('room', { joined: true });
            socket.emit('slide', { index: currentIndex })
		}
	});
	socket.on('action', function(data){
		io.sockets.in('room').emit('action', { value: data.value, pipe: data.pipe });
	});
    socket.on('slide', function(data){
        currentIndex = data.index;
        console.log(socket.id);
        socket.broadcast.to('room').emit('slide', { index: currentIndex, senderId:data.senderId});
    })
});

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log("Listening on " + port);
});
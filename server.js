var express = require('express')
var app = express();

var server = require('http').Server(app);

var io = require('socket.io')(server);

var users = [];
var connections = [];

var port = process.env.PORT || 8000;

app.use('/', express.static('client/'));

app.route('/*').get(function(req, res) {
	res.sendFile('index.html', {root:"client/"});
});


server.listen(port);


//socket.io stuff


io.on('connection', function(socket){

	connections.push(socket);

	console.log('Connected: %s sockets connected', connections.length);

	socket.on('disconnect', function(data) {

		users.splice(users.indexOf(socket.username), 1);
		
		connections.splice(connections.indexOf(socket), 1);

		updateUsernames();

		console.log('Disconnect: %s sockets connected', connections.length);


	});

	socket.on('send message', function(data){

		console.log(data);

		io.sockets.emit('new message', {msg: data, user: socket.username});

	});

	socket.on('new user', function(data, callback){
		
		console.log(data + ' has connected!');
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){

		io.sockets.emit('get users', users);

	};


});
"use strict";

var restify = require("restify");
var socketio = require("socket.io");
var bunyan = require("bunyan");


var server = restify.createServer();
var io = socketio.listen(server);

server.on('after', restify.auditLogger({
	log: bunyan.createLogger({
		name: 'audit',
		stream: process.stdout
	})
}));

server.listen(process.env.PORT || 3000, function() {
	console.log("Server running at %s", server.url);
});

module.exports = exports = server;
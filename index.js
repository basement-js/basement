"use strict";

// require npm modules
var restify = require("restify");
var socketio = require("socket.io");
var bunyan = require("bunyan");

// set up http services
var server = restify.createServer();
var io = socketio.listen(server);

// bunyan logging for restify
server.on("after", restify.auditLogger({
	log: bunyan.createLogger({
		name: "audit",
		stream: process.stdout
	})
}));

// restify routing
require("./routes")(server);

// helper to start up the http server
server.listen(process.env.PORT || 3000, function () {
	console.log("Server running at %s", server.url);
});

module.exports = exports = server;
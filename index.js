"use strict";

// require Node.js modules
var path			= require("path");

// require npm modules
var restify			= require("restify");
var socketio		= require("socket.io");
var bunyan			= require("bunyan");
var config			= require("nconf");

// require basement libraries
var HookInstance	= require("./lib/hook");
var hook			= new HookInstance();

// set up config helper
config.argv()
.env()
.file({
	file: path.resolve("config.json")
});

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
require("./routes")({
	server: server,
	config: config,
	hook: hook
});

// helper to start up the http server
server.listen(config.get("port") || 3000, function () {
	console.log("Server running at %s", server.url);
});

module.exports = exports = server;
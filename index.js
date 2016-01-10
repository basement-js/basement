"use strict";

// TODO: optionally use knex instance or socket.io instance or server passed to this function
function Basement() {
    // require Node.js modules
    var path        = require("path");

    // require npm modules
    var restify     = require("restify");
    var socket      = require("socket.io");
    var bunyan      = require("bunyan");

    var config      = require("nconf");
    this.config     = config;
   
    // set up config
    config.argv()
    .env()
    .file({
        file: path.resolve("config.json")
    });

    // require hook library
    var HookCollection  = require("./lib/hook");
    var hook            = new HookCollection();
    this.hook           = hook;
    
    // require plugin manager
    var PluginManager   = require("./lib/plugin");
    var plugin          = new PluginManager(this);
    this.plugin         plugin;

    // require log library
    var Log     = require("./lib/log");
    var log     = new Log(this);
    this.log    = log;

    // require database loader
    require("./lib/database").call(this);

    // set up http services
    var server  = restify.createServer();
    this.server = server;

    var io      = socket.listen(server);
    this.io     = io;

    // bunyan logging for restify
    server.on("after", restify.auditLogger({
        log: bunyan.createLogger({
            name: "audit",
            stream: process.stdout
        })
    }));

    // restify routing
    require("./routes").call(this);

    return this;
}

module.exports = Basement;
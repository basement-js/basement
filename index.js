"use strict";

// TODO: optionally use knex instance or socket.io instance or server passed to this function
module.exports = function Basement() {
    // require Node.js modules
    var path                    = require("path");

    // require npm modules
    var restify                 = require("restify");
    var socketio                = require("socket.io");
    var bunyan                  = require("bunyan");
    var config = this.config    = require("nconf");
   
    // set up config
    config.argv()
    .env()
    .file({
        file: path.resolve("config.json")
    });

    // require hook library
    var HookCollection          = require("./lib/hook");
    var hook = this.hook        = new HookCollection();
    
    // require plugin manager
    var PluginManager           = require("./lib/plugin");
    var plugin = this.plugin    = new PluginManager(this);

    // require log library
    var Log                     = require("./lib/log");
    var log = this.log          = new Log(this);

    // require language library
    var Language                = require("./lib/lang");
    var lang = this.lang        = new Language(this);

    // require database loader
    require("./lib/database").call(this);

    // set up http services
    var server = this.server = restify.createServer();
    var io = this.io = socketio.listen(server);

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
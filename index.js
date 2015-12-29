"use strict";

// TODO: optionally use knex instance or socket.io instance or server passed to this function
module.exports = function () {
    // require Node.js modules
    var path                    = require("path");

    // require npm modules
    var restify                 = require("restify");
    var socketio                = require("socket.io");
    var bunyan                  = require("bunyan");
    var config = this.config    = require("nconf");

    // require basement libraries
    var HookInstance            = require("./lib/hook");
    var hook = this.hook        = new HookInstance();
    var PluginManager           = require("./lib/plugin");
    var plugin = this.plugin    = new PluginManager(this);

    // set up config helper
    config.argv()
    .env()
    .file({
        file: path.resolve("config.json")
    });

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
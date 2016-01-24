"use strict";

// TODO: optionally use knex instance or socket.io instance or server passed to this function
module.exports = function Basement() {
    // require Node.js modules
    var path        = require("path");

    // require npm modules
    var restify     = require("restify");
    var socketio    = require("socket.io");
    var bunyan      = require("bunyan");

    var config      = require("nconf");
    this.config     = config;

    var passport    = require("passport-restify");
    this.passport   = passport;
   
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
    this.plugin         = plugin;

    // require log library
    var Log     = require("./lib/log");
    var log     = new Log(this);
    this.log    = log;

    // require database loader
    require("./lib/database").call(this);

    // TODO: move to /lib/user/login.js
    // set up passport
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    var User = this.bookshelf.model("User");
    passport.deserializeUser(function (id, done) {
        return new User({id: id})
        .then(function (user) {
            return done(user.toJSON());
        })
        .catch(function (err) {
            return done(err, null);
        });
    });

    // set up http services
    var server  = restify.createServer();
    this.server = server;

    var io  = socketio.listen(server);
    this.io = io;

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
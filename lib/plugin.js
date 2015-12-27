"use strict";

// include Node.js modules
var path        = require("path");
var fs          = require("fs");

// include 3rd party modules
var requireDir  = require("require-dir");

function PluginManager(type, vars) {
    this.type = {};
    this.plugins = {};
    this.vars = vars;

    var pluginDir = vars.config.get("pluginmanager:plugindir") || path.resolve("plugins");
    pluginDir = path.join(pluginDir, type);

    try {
        fs.statSync(pluginDir);

        this.plugins = requireDir(pluginDir);
        var pluginNames = Object.keys(this.plugins);
        console.log("Found %d plugins:", pluginNames.length);
        pluginNames.forEach(function (name) {
            console.log("\t'%s'", name);
        });
    } catch (err) {
        console.error(err);
    }
    
}

PluginManager.prototype.list = function () {
    var returnInfo = {};
    Object.keys(this.plugins).forEach(function (name) {
        returnInfo[name] = this.plugins[name].getInfo();
    });

    return returnInfo;
}





/*
    Plugin Instance is the instance that holds all the plugin managers
*/
function PluginInstance(vars) {
    this.pluginManagers = {};
    this.vars = vars;
}

PluginInstance.prototype.get = function (type) {
    if (this.pluginManagers.hasOwnProperty(type)) {
        return this.pluginManagers[type];
    } else {
        this.pluginManagers[type] = new PluginManager(type, this.vars);

        var pluginManager = this.pluginManagers[type];

        pluginManager.delete = function () {
            delete this.pluginManagers[type];
        }.bind(this);

        return pluginManager;
    }
}

PluginInstance.prototype.list = function () {
    var plugins = {};
    Object.keys(this.pluginManagers).forEach(function (key) {
        plugins[key] = this.pluginManagers[key].list();
    });
    return plugins;
}

module.exports = PluginInstance;
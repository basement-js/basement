"use strict";

// include Node.js modules
var path        = require("path");
var fs          = require("fs");

// include 3rd party modules
var requireDir  = require("require-dir");

function PluginType(type, vars) {
    this.type = {};
    this.plugins = {};
    this.vars = vars;

    var pluginDir = vars.config.get("pluginmanager:plugindir") || path.resolve("plugins");
    pluginDir = path.join(pluginDir, type);

    try {
        fs.statSync(pluginDir);

        var foundPlugins = requireDir(pluginDir);
        var pluginNames = Object.keys(foundPlugins);

        console.log("Found %d plugins:", pluginNames.length);

        pluginNames.forEach(function (name) {
            this.plugins[name] = foundPlugins[name](this.vars);
            console.log("\t'%s'", name);
        });
    } catch (err) {
        console.trace(err);
    }
    
}

PluginType.prototype.list = function () {
    var returnInfo = {};
    Object.keys(this.plugins).forEach(function (name) {
        returnInfo[name] = this.plugins[name].info;
    });

    return returnInfo;
}


/*
    Plugin Manager is the manager that holds all the plugin types
*/
function PluginManager(vars) {
    this.pluginTypes = {};
    this.vars = vars;
}

PluginManager.prototype.get = function (type) {
    if (this.pluginTypes.hasOwnProperty(type)) {
        return this.pluginTypes[type];
    } else {
        this.pluginTypes[type] = new PluginType(type, this.vars);

        var pluginType = this.pluginTypes[type];

        pluginType.delete = function () {
            delete this.pluginTypes[type];
        }.bind(this);

        return pluginType;
    }
}

PluginManager.prototype.list = function () {
    var plugins = {};
    Object.keys(this.pluginTypes).forEach(function (key) {
        plugins[key] = this.pluginTypes[key].list();
    });
    return plugins;
}

module.exports = PluginManager;
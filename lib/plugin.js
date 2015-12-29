"use strict";

// include Node.js modules
var path        = require("path");

// include 3rd party modules
var requireDir  = require("require-dir");
var fs          = require("fs-extra");

function PluginType(type, vars) {
    this.type = {};
    this.plugins = {};
    this.vars = vars;

    var pluginDir = vars.config.get("pluginmanager:plugindir") || path.resolve("plugins");
    pluginDir = path.join(pluginDir, type);

    try {
        fs.statSync(pluginDir);

        var foundPlugins = requireDir(pluginDir);
        var fileNames = Object.keys(foundPlugins);

        console.log("[Core/Plugin] Found %d plugins of type '%s'"+(fileNames.length > 0 ? ":" : ""), fileNames.length, type);

        fileNames.forEach(function (name) {
            if(name.substr(0, 1) != "_") {
                var newPlugin = new foundPlugins[name](this.vars);
                this.plugins[newPlugin.info.name] = newPlugin;
                console.log("[Core/Plugin] - '%s' (Enabled)", name);
            }else{
                console.log("[Core/Plugin] - '%s' (Disabled)", name.substr(1));
            }
        }.bind(this));
    } catch (err) {
        if(err.code == "ENOENT") {
            console.error("[Core/Plugin] The plugin directory '%s' can not be found", err.path);
            console.log("[Core/Plugin] Attempting to create plugin directory '%s'", err.path);
            fs.mkdirsSync(err.path);
        }else{
            console.error("[Core/Plugin] ", err);
        }
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
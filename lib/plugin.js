"use strict";

// include Node.js modules
var path	= require("path");
var fs		= require("fs");

function PluginManager(config) {
	this.plugins = {};

	var pluginDir = config.get("pluginmanager:plugindir") || path.resolve("plugins");

	try {
		fs.statSync(pluginDir);
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
function PluginInstance(config) {
	this.pluginManagers = {};
	this.config = config;
}

PluginInstance.prototype.get = function (type) {
	if (this.pluginManagers.hasOwnProperty(type)) {
		return this.pluginManagers[type];
	} else {
		this.pluginManagers[type] = new PluginManager(this.config);

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
"use strict";

function PluginManager() {
	this.plugins = {};
}

PluginManager.prototype.list = function () {
	var returnInfo = {};
	Object.keys(this.plugins).forEach(function (name) {
		returnInfo[name] = this.plugins[name].getInfo();
	});

	return returnInfo;
}

function PluginInstance() {
	this.pluginManagers = {};
}

PluginInstance.prototype.get = function (type) {
	if (this.pluginManagers.hasOwnProperty(type)) {
		return this.pluginManagers[type];
	} else {
		this.pluginManagers[type] = new PluginManager();

		var pluginManager = this.pluginManagers[type];

		pluginManager.delete = function () {
			delete this.pluginManagers[type];
		}.bind(this);

		return pluginManager;
	}
}

module.exports = PluginInstance;

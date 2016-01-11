"use strict";

// include Node.js modules
var util    = require("util");

module.exports = function (vars) {
    this.info = {
        name: "console",
        prettyName: "Console transport"
    }

    vars.hook.get("Log").on("call", function(logData) {
        util.log("["+logData.level.toUpperCase()+"] "+logData.data.message);
    });
};
"use strict";

// include Node.js modules
var path            = require("path");

// include 3rd party modules
var requireDir      = require("require-dir");

// include data
var languageList    = require("../lang/languages.json");

function LanguageHandler(vars) {
    this.vars = vars;
    this.languages = {};

    console.log(languageList);
}

LanguageHandler.prototype.get = function (string, language) {

}

module.exports = LanguageHandler;
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

    var defaultLanguages = requireDir("../lang/");
    var fileNames = Object.keys(defaultLanguages);

    fileNames.forEach(function (fileName) {
        if(fileName == "languages" || Object.keys(languageList).indexOf(fileName) == -1) {
            vars.log.error(new Error("[Core/Lang] Invalid language '"+fileName+"' found"));
            return;
        }

        vars.log.info({message: "[Core/Lang] Loaded language '"+fileName+"'"});
    });
}

LanguageHandler.prototype.get = function (string, language) {

}

module.exports = LanguageHandler;
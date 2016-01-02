"use strict";

// require Node.js modules
var fs          = require("fs");
var path        = require("path");
var util        = require("util");
var knex        = require("knex");
var bookshelf   = require("bookshelf");
var requireDir  = require("require-dir");

// helper functions for log formatting
function plural(length) {
    return length === 0 ? "s" : length > 1 ? "s:" : ":";
}

function filenameToName(filename) {
    return filename.substr(0, filename.length - 3);;
}

function DatabaseLoader() {
    this.knex       = knex(this.config.get("knex"));
    this.bookshelf  = bookshelf(this.knex);
    var hook        = this.hook;
    var modelProto  = this.bookshelf.Model.prototype;
    
    // extend bookshelf model to call hooks on saving model
    // this could be used for caching
    this.bookshelf.Model = this.bookshelf.Model.extend({
        constructor: function () {
            modelProto.constructor.apply(this, arguments);

            this.on("saving", function(model, attrs, options) {
                hook.get("DatabaseSaving")
                .call(this, model, attrs, options);
            });
        }
    });

    // use the registry plugin
    this.bookshelf.plugin("registry");
    
    var modelsDir           = path.resolve(path.join("bookshelf", "models"));
    var collectionsDir      = path.resolve(path.join("bookshelf", "collections"));
    var modelIndexes        = fs.readdirSync(modelsDir);
    var collectionIndexes   = fs.readdirSync(collectionsDir);

    console.log("[Core/Database] Found %s model%s", modelIndexes.length, plural(modelIndexes.length));

    modelIndexes.forEach(function (filename) {
        console.log("[Core/Database] - '%s'", filenameToName(filename));

        require(path.join(modelsDir, filename)).call(this);
    }.bind(this));

    console.log("[Core/Database] Found %s collection%s", collectionIndexes.length, plural(collectionIndexes.length));
    
    collectionIndexes.forEach(function (filename) {
        console.log("[Core/Database] - '%s'", filenameToName(filename));

        require(path.join(collectionsDir, filename)).call(this);
    }.bind(this));
}

module.exports = DatabaseLoader;
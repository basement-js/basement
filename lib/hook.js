"use strict";

// require Node.js modules
var EventEmitter    = require("events");
var util            = require("util");

// if the input isn't an array, it wraps the input in an array
// this is needed because an EventEmitter sets keys in this._events to either
// an array of functions or a single function
function array(array) {
    if (!Array.isArray(array) && typeof array !== "undefined") {
        array = [array];
    }
    
    return array || [];
}

function Hook() {
    EventEmitter.call(this);
}

// inherit functions from EventEmitter's prototype
util.inherits(Hook, EventEmitter);

// remove .emit function
delete Hook.prototype.emit;

// custom caller for the eventemitter
Hook.prototype.call = function (thisArg) {
    // get all arguments after thisArg
    var args = Array.prototype.slice.call(arguments, 1);

    var progress = 0;
    var listeners = array(this._events["call"]);
    var listenerCount = listeners.length;
    var toRemove = [];
    var errors = [];
    var results = [];

    // call all listeners for the "call" event
    listeners.forEach(function (listener) {
        var res = null;
        var err = null;

        // handle .once listeners
        if (listener.hasOwnProperty("listener")) {
            toRemove.push(listeners.indexOf(listener));
            listener = listener.listener;
        }

        try {
            // try calling the listener with the arguments provided
            res = listener.apply(thisArg, args);
        } catch (e) {
            // catch the thrown error and push it to the array
            err = e;
            errors.push(err);

            // emit an error event
            array(this._events["error"])
            .forEach(function (errorListener) {
                // call the listener with:
                // - the error thrown
                // - the listener that threw the error
                errorListener(e, listener);
            });
        }

        results.push(res);
        progress++;

        // emit a progress event
        array(this._events["progress"])
        .forEach(function (progressListener) {
            // call the listener with:
            // - any errors from the last ran listener
            // - the return value of the last ran listener
            // - the progress of the hook being called
            progressListener(err, res, {
                count: listenerCount,
                finished: progress,
                remaining: listenerCount - progress,
                percentage: progress / listenerCount * 100
            });
        });
    }.bind(this));

    // remove all .once listeners that have been ran
    toRemove.forEach(function (index) {
        listeners.splice(index, 1);
    });

    // emit a finished event
    array(this._events["finished"])
    .forEach(function (finishedListener) {
        // call the listener with:
        // - any errors thrown calling the listeners
        // - all return values of the listeners
        finishedListener(errors, results);
    });

    return this;
}

function HookCollection() {
    this.hooks = {};
}

HookCollection.prototype.get = function (name) {
    if (this.hooks.hasOwnProperty(name)) {
        return this.hooks[name];
    } else {
        this.hooks[name] = new Hook();

        var hook = this.hooks[name];

        // extend the hook with a function to delete it from the HookCollection
        hook.delete = function () {
            delete this.hooks[name];
        }.bind(this);

        return hook;
    }
}

module.exports = HookCollection;

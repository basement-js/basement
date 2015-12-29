function Log(vars) {
    this.vars = vars;
    this.hooks = {
        all:        vars.hook.get("Log"),
        debug:      vars.hook.get("LogDebug"),
        info:       vars.hook.get("LogInfo"),
        notice:     vars.hook.get("LogNotice"),
        warning:    vars.hook.get("LogWarning"),
        error:      vars.hook.get("LogError")
    };
    
    vars.plugin.get("log");

    this.info({message: "Module 'Log' has been loaded"});
}

Log.prototype._ = function (data) {
    this.hooks.all.call(null, data);
}

Log.prototype.debug = function (data) {
    this.hooks.all.call(null, {
        level: "debug",
        data: data
    });

    this.hooks.debug.call(null, data);
}

Log.prototype.info = function (data) {
    this.hooks.all.call(null, {
        level: "info",
        data: data
    });

    this.hooks.info.call(null, data);
}

Log.prototype.notice = function (data) {
    this.hooks.all.call(null, {
        level: "notice",
        data: data
    });

    this.hooks.notice.call(null, data);
}

Log.prototype.warning = function (data) {
    this.hooks.all.call(null, {
        level: "warning",
        data: data
    });

    this.hooks.warning.call(null, data);
}

Log.prototype.error = function (data) {
    this.hooks.all.call(null, {
        level: "error",
        data: data
    });

    this.hooks.error.call(null, data);
}

module.exports = Log;
/*!
 * arduinodk
 * Copyright(c) 2016-2017 Francesco Bianco
 * MIT Licensed
 */

var fs = require("fs"),
    path = require("path"),
    util = require("./util"),
    dk = require("./dk");

module.exports = {

    /**
     * Command line entry-point.
     *
     * @param {array} args a list of arguments
     * @returns {string}
     */
    run: function(args, callback) {
        var param = -1;
        var flags = {};

        if (typeof args == "undefined" || !args) { args = []; }
        if (param = args.indexOf("--info") > -1) { flags['showInfo'] = true; args.splice(param, 1); }
        if (param = args.indexOf("--help") > -1) { return this.getHelp(args); }
        if (param = args.indexOf("--version") > -1) { return this.getVersion(args); }

        var cmd = util.getCmd(args, null);
        if (!cmd) { return util.err("Missing command, type 'arduinodk --help'."); }

        var fnc = "cmd" + cmd.charAt(0).toUpperCase() + cmd.slice(1).toLowerCase();
        if (typeof dk[fnc] !== "function") {
            return util.err("Undefined command '" + cmd + "', type 'arduinodk --help");
        }

        var cfg = this.loadConfig(process.cwd());

        return dk[fnc](cfg, args, flags, callback);
    },

    /**
     * Get sotware help.
     *
     * @param args
     */
    getHelp: function (args) {
        var help = path.join(__dirname, "../help/help.txt");
        if (!args[0]) { return console.log(fs.readFileSync(help)+""); }
        help = path.join(__dirname, "../help/" + args[0] + ".txt");
        if (fs.existsSync(help)) { return console.log(fs.readFileSync(help)); }
        return util.err("&cmd-undefined", { cmd: args[0] });
    },

    /**
     * Get software version.
     *
     * @param args
     */
    getVersion: function () {
        var info = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")), "utf8");
        return info.name + "@" + info.version;
    },

    /**
     *
     */
    loadConfig: function () {

    }
};

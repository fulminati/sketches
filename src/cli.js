/*!
 * arduinodk
 * Copyright(c) 2016-2017 Francesco Bianco
 * MIT Licensed
 */

var fs = require("fs"),
    path = require("path"),
    yaml = require("yamljs"),
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

        var sketch = this.loadSketch(process.cwd());

        return dk[fnc](sketch, args, flags, callback);
    },

    /**
     * Get sotware help.
     *
     * @param args
     */
    getHelp: function (args) {
        var cmd = util.getCmd(args, null);
        if (!cmd) { return console.log(fs.readFileSync(path.join(__dirname, "../help/help.txt"))+""); }
        var help = path.join(__dirname, "../help/" + cmd + ".txt");
        if (!fs.existsSync(help)) { return util.err("Undefined command '" + cmd + "', type 'arduinodk --help"); }
        return console.log(fs.readFileSync(help) + "");
    },

    /**
     * Get software version.
     *
     * @param args
     */
    getVersion: function () {
        var info = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json")), "utf8");
        return console.log(info.name + "@" + info.version);
    },

    /**
     *
     */
    loadSketch: function () {
        var file = path.join(process.cwd(), "./sketch.yml");

        if (!fs.existsSync(file)) {
            return util.err("Missing sketch file, type 'arduinodk init");
        }

        sketch = yaml.load(file);

        if (typeof sketch["name"] !== "string" ) {
            sketch.name = path.basename(process.cwd());
        }

        if (typeof sketch["entrypoint"] !== "string" ) {
            sketch.entrypoint = "src/" + sketch.name + "/" + sketch.name + ".ino";
        }

        return sketch;
    }
};

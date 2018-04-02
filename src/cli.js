/*!
 * arduinodk
 * Copyright(c) 2016-2017 Francesco Bianco
 * MIT Licensed
 */

const fs = require("fs")
    , path = require("path")
    , cliz = require('cliz')
    , util = require("./util")
    , adk = require("./adk")

module.exports = {

    /**
     *
     */
    options: {
        info: false
    },

    /**
     * Command line entry-point.
     *
     * @param {array} args a list of arguments
     * @returns {string}
     */
    run: function(args, cb) {
        args = args || []

        this.options.info = cliz.option(args, '--info')

        if (cliz.has(args, '--help')) { return this.help(args, cb) }
        if (cliz.has(args, '--version')) { return this.version(cb) }

        var cmd = cliz.command(args);

        if (!cmd) {
            return cliz.error("Missing command, type: 'arduinodk --help'", cb)
        }

        if (!adk.commands.hasOwnProperty(cmd)) {
            return cliz.error("Undefinend command: '" + cmd + "'", cb)
        }

        return adk[adk.commands[cmd]](cmd, args, cb)
    },

    /**
     * Get sotware help.
     *
     * @param args
     */
    help: function (args, cb) {
        return cliz.help(__dirname + '/../help/', args, cb);
    },

    /**
     * Get software version.
     *
     * @param args
     */
    version: function () {
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

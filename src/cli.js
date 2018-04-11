/*!
 * arduinodk
 * Copyright(c) 2016-2017 Francesco Bianco
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , util = require('./util')
    , adk = require('./adk')

module.exports = {

    /**
     * Command line entry-point.
     *
     * @param {array} args a list of arguments
     * @returns {string}
     */
    run: function(args, cb) {
        args = args || []
        cb = cb || function () {}

        adk.options.info = cliz.option(args, '--info')

        if (cliz.has(args, '--help')) { return this.help(args, cb) }
        if (cliz.has(args, '--version')) { return this.version(cb) }

        var cmd = cliz.command(args);

        if (!cmd) {
            return cliz.error("Missing command, type: 'arduinodk --help'", cb)
        }

        if (!adk.commands.hasOwnProperty(cmd)) {
            return cliz.error("Undefinend command: '" + cmd + "'", cb)
        }

        if (!fu.fileExists(adk.options.configFile)) {
            return cliz.error("Sketches file '" + adk.options.configFile + "' not found", cb)
        }
        
        return adk.run(cmd, args, cb)
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
    version: function (cb) {
        return cliz.version(__dirname + '/../package.json', cb)
    }
}

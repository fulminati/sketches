/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , join = require('path')
    , cliz = require('cliz')
    , task = require('./task')
    , util = require('./util')

require('dotenv').config()

cliz.debugTag = '(DEBUG)'
cliz.errorTag = '(ERROR)'
cliz.fatalTag = '(ERROR)'

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

        task.options.info = cliz.option(args, '--info')

        if (cliz.has(args, '--help')) { return this.help(args, cb) }
        if (cliz.has(args, '--version')) { return this.version(cb) }

        let cmd = cliz.command(args);

        if (!cmd) {
            return cliz.error("Missing task name. See more: 'sketches --help'", cb)
        }

        return task.run(cliz, cmd, args, cb)
    },

    /**
     * Get software version.
     *
     * @param args
     */
    version: function (cb) {
        return cliz.version(join(__dirname, '../package.json'), cb)
    }

    /**
     * Get sotware help.
     *
     * @param args
     */
    help: function (args, cb) {
        return cliz.help(join(__dirname, 'help'), args, cb);
    }
}

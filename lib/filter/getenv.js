/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const quote = require('sketces-filter').quote
    , applyTag = require('sketces-filter').applyTag
    , resetTag = require('sketces-filter').resetTag

module.exports = {

    /**
     * Define GetEnv filter token @getenv(...).
     */
    tag: 'getenv',

    /**
     * Process before verify.
     *
     * @param sketch
     */
    apply: function(sketch) {
        return applyTag({
            tag: this.tag,
            path: sketch.path,
            processer: this.processor
        })
    },

    /**
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    reset: function(sketch) {
        return resetTag({
            tag: this.tag,
            path: sketch.path
        })
    },

    /**
     * Process selector script.
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (args, trace) {
        return quote(process.env[args[0]] || '')
    }
}

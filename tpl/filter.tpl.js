/*
 File: {{FILE}}
 <write description here>

 ArduinoDK
 https://git.io/fAF8y
 */

const quote = require('sketces-filter').quote
    , applyTag = require('sketces-filter').applyTag
    , resetTag = require('sketces-filter').resetTag

module.exports = {

    /**
     * Define custom filter token @myFilter(...).
     */
    tag: 'tag',

    /**
     *
     * @param sketch
     */
    apply: function (sketch) {
        return applyTag({
            tag: this.tag,
            path: sketch.path,
            processor: this.processor
        })
    },

    /**
     *
     * @param sketch
     * @returns {*}
     */
    reset: function (sketch) {
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
    processor: function (args) {
        return quote(args[0].toUpperCase())
    }
}

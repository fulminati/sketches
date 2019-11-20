/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const applyTag = require('sketces-filter').applyTag
    , resetTag = require('sketces-filter').resetTag

module.exports = {

    /**
     * Define tag.
     */
    tag: 'param',

    /**
     * Process before verify.
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
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    reset: function (sketch) {
        return resetTag({
            tag: this.tag,
            path: sketch.path
        })
    }

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (args, trace) {
        return 9600
    }
}

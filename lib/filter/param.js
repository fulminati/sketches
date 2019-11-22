/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const quote = require('sketches-filter').quote
    , applyTag = require('sketches-filter').applyTag
    , resetTag = require('sketches-filter').resetTag

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
        this.sketch = sketch
        return applyTag({
            tag: this.tag,
            path: sketch.path,
            processor: this.processor,
            payload: sketch
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
    },

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (args, trace, sketch) {
        return quote(sketch[args[0]] || '')
    }
}

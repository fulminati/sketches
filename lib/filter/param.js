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
        return applyTag(this.tag, (args) => {
            return 9600
        })
    },

    /**
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    reset: function (sketch) {
        return resetTag(this.tag)
    }
}

/*
 File: ArduinoProject.js
 <write description here>

 Sketches
 https://git.io/fAF8y
 */

const filter = require('sketches-filter')

module.exports = {

    /**
     * Define custom filter token @myFilter(...).
     */
    filter: 'filter',

    /**
     * Process before verify.
     *
     * @param sketch
     */
    onBeforeVerify: function (sketch) {
        return filter.onBefore(sketch, this.filter, this.processor)
    },

    /**
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    onAfterVerify: function (sketch) {
        return filter.onAfter(sketch, this.filter)
    },

    /**
     * Process selector script.
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (file, args) {
        return filter.quote(args[0].toUpperCase())
    }
};

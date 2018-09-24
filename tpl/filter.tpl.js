/*
 File: {{FILE_NAME}}
 <write description here>

 ArduinoDK
 https://git.io/fAF8y
 */

const filter = require('arduinodk-filter')

module.exports = {

    /**
     * Define custom filter token @myFilter(...).
     */
    filter: 'myFilter',

    /**
     * Process before verify.
     *
     * @param sketch
     */
    onBeforeVerify: function (sketch) {
        filter.onBefore(sketch, this.filter, this.processor)
    },

    /**
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    onAfterVerify: function (sketch) {
        filter.onAfter(sketch, this.filter)
    },

    /**
     * Process selector script.
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (variable) {
        return filter.quote(variable.toUpperCase())
    }
};

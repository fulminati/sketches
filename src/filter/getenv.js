/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const filter = require('arduinodk-filter')

module.exports = {

    /**
     * Define GetEnv filter token @getenv(...).
     */
    filter: 'getenv',

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
        console.log('PE', arguments);
        return '"' + (process.env[variable] || '') + '"'
    }
};

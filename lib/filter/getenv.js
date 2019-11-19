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
    onBefore: function (sketch) {
        return filter.onBefore(sketch, this.filter, this.processor)
    },

    /**
     * Process after verify
     *
     * @param sketch
     * @returns {*}
     */
    onAfter: function (sketch) {
        return filter.onAfter(sketch, this.filter)
    },

    /**
     * Process selector script.
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (args) {
        console.log('args', args);
        return '"' + (process.env[args[0]] || '') + '"'
    }
};

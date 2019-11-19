/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const filter = require('arduinodk-filter')

module.exports = {

    /**
     *
     */
    filter: 'loadcss',

    /**
     *
     * @param sketch
     */
    onBefore: function (sketch) {
        return filter.onBefore(sketch, this.filter, this.processor)
    },

    /**
     *
     * @param sketch
     * @returns {*}
     */
    onAfter: function (sketch) {
        return filter.onAfter(sketch, this.filter)
    },

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (file, args) {
        return '""'
    }
}

/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , glob = require('glob')
    , minify = require('html-minifier').minify
    , dirname = require('path').dirname
    , foreach = require('boor').foreach
    , filter = require('arduinodk-filter')

module.exports = {

    /**
     *
     */
    filter: 'yoctocss',

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
     * Process filter token by file and arguments.
     *
     * @param file
     * @param args
     * @returns {string}
     */
    processor: function (file, args) {
        return '""'
    }
}

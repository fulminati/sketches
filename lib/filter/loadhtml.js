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
    filter: 'loadhtml',

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
        file = path + '/' + file;
        if (fu.fileExists(file)) {
            return '"' + minify(fu.readFile(file), {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: false,
                collapseInlineTagWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeTagWhitespace: true,
                processScripts: ['text/ng-template'],
                minifyCSS: true,
                minifyJS: { mangle: false }
            }).replace(/"/, '\\"') + '"'
        }
    }
}

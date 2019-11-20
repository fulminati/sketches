/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const quote require('sketces-filter').quote
    , applyTag = require('sketces-filter').applyTag
    , resetTag = require('sketces-filter').resetTag

module.exports = {

    /**
     *
     */
    tag: 'loadhtml',

    /**
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
    processor: function (args, trace) {
        file = path + '/' + file;
        if (fu.fileExists(file)) {
            return quote(
                minify(fu.readFile(file), {
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
                })
            )
        }
    }
}

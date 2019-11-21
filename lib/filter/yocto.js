/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const quote = require('sketces-filter').quote
    , applyTag = require('sketces-filter').applyTag
    , resetTag = require('sketces-filter').resetTag

const fu = require('nodejs-fu')
    , glob = require('glob')
    , minify = require('html-minifier').minify
    , dirname = require('path').dirname
    , foreach = require('boor').foreach
    , filter = require('Sketches-filter')

module.exports = {

    /**
     *
     */
    tags: [
        'yoctojs',
        'yoctocss',
    ],

    /**
     *
     * @param sketch
     */
    apply: function (sketch) {
        for (let i in this.tags) {
            applyTag({
                tag: this.tags[i],
                path: sketch.path,
                processor: this.processors[this.tags[i]],
                payload: sketch
            })
        }
    },

    /**
     *
     * @param sketch
     * @returns {*}
     */
    reset: function (sketch) {
        for (let i in this.tags) {
            resetTag({
                tag: this.tags[i],
                path: sketch.path
            })
        }
    },

    /**
     * Process filter token by file and arguments.
     *
     * @param file
     * @param args
     * @returns {string}
     */
    processors: {

        /**
         * Process filter token by file and arguments.
         *
         * @param file
         * @param args
         * @returns {string}
         */
        yoctojs: function(args, trace) {
            return '""'
        },

        /**
         * Process filter token by file and arguments.
         *
         * @param file
         * @param args
         * @returns {string}
         */
        yoctocss: function(args, trace) {
            return '""'
        }
    }
}

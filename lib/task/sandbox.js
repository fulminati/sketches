/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , basename = require('path').basename
    , exec = require('child_process').execSync
    , foreach = require('boor').foreach
    , nodemon = require('nodemon')
    , preferencesApi = require('../api/preferences-api')
    , indexApi = require('../api/index-api')
    , util = require('../util')

module.exports = {

    /**
     * Install sketches dependencies.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        console.log(`Sketches start sandbox...`)

        let sketch = adk.requireSketch(cmd, args, cb)

        nodemon({
            ignoreRoot: [".git"],
            watch: [adk.options.cwd],
            script: sketch.sandbox,
            ext: 'js json css html'
        });
    },
};

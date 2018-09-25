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
    filter: 'yoctojs',

    /**
     *
     * @param sketch
     */
    onBefore: function (sketch) {
        return this.processBefore(sketch)
    },

    /**
     *
     * @param sketch
     * @returns {*}
     */
    onAfterVerify: function (sketch) {
        return this.processAfter(sketch)
    },

    /**
     *
     * @param sketch
     */
    processBefore: function (sketch) {
        var files = glob.sync('**/*.{ino,h}', { cwd: sketch.path, absolute: true })

        foreach(files, (file) => {
            var code = fu.readFile(file)
            if (code.match(this.selector)) {
                fu.writeFile(file + '.yoctojs', code)
                fu.writeFile(file, this.processSelectors(dirname(file), code))
            }
        })
    },

    /**
     *
     * @param sketch
     */
    processAfter: function (sketch) {
        var files = glob.sync('**/*.yoctojs', { cwd: sketch.path, absolute: true })

        foreach(files, function(file) {
            var code = fu.readFile(file)
            fu.writeFile(file.slice(0, -8), code)
            fu.unlink(file)
        });
    },

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processor: function (file, args) {
        return code.replace(this.selector, function (token, file) {
            return '""'
        })
    }
}

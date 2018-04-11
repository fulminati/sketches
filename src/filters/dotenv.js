
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
    selector: filter.selector('dotenv'),

    /**
     *
     * @param sketch
     */
    onBeforeVerify: function (sketch) {
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
                fu.writeFile(file + '.dotenv', code)
                fu.writeFile(file, this.processSelectors(code))
            }
        })
    },

    /**
     *
     * @param sketch
     */
    processAfter: function (sketch) {
        var loadhtml = this
        var files = glob.sync('**/*.dotenv', { cwd: sketch.path, absolute: true })

        foreach(files, function(file) {
            fu.writeFile(file.slice(0, -7), fu.readFile(file))
            fu.unlink(file)
        });
    },

    /**
     *
     * @param path
     * @param code
     * @returns {string | void}
     */
    processSelectors: function (code) {
        return code.replace(this.selector, function (token, variable) {
            return 'HELLO'
        })
    }
}

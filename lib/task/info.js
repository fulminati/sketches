/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , join = require('path').join
    , basename = require('path').basename
    , realpath = require('fs').realpathSync
    , exec = require('child_process').execSync
    , foreach = require('boor').foreach
    , preferencesApi = require('../api/preferences-api')
    , indexApi = require('../api/index-api')
    , util = require('../util')

module.exports = {

    /**
     * Install sketches dependencies.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        const version = cliz.version(join(__dirname, '../../package.json'))

        console.log(`Sketches (v${version})`)

        task.initEnvironment()

        const workdir = process.cwd()
            , arduino = task.configData.arduino
            , configfile = fu.fileExists(task.options.configFile) ? realpath(task.options.configFile) : '(not found)'

        util.title(`Information`)
        console.log(`Arduino:     ${arduino}`)
        console.log(`Working dir: ${workdir}`)
        console.log(`Config file: ${configfile}`)
    }
};

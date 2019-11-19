/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , basename = require('path').basename
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
    run: function (adk, cmd, args, cb) {
        console.log(`ArduinoDK initializing project...`)

        let project = cliz.command(args)
        let projectPath = adk.options.cwd

        if (project) {
            projectPath = join(adk.options.cwd, project)
            fu.mkdir(projectPath)
        } else {
            project = basename(adk.options.cwd)
        }

        util.info('Generate directories')
        fu.mkdir(join(projectPath, 'build'))
        fu.mkdir(join(projectPath, 'filters'))
        fu.mkdir(join(projectPath, 'includes'))
        fu.mkdir(join(projectPath, 'libraries'))
        fu.mkdir(join(projectPath, 'sketches', project))

        util.info('Generate project files')
        util.createFile(join(projectPath, 'sketches', project, project + '.ino'), 'sketch.tpl.ino', project)
        util.createFile(join(projectPath, 'sketches', project, project + '.h'), 'sketch.tpl.h', project)
        util.createFile(join(projectPath, 'filters', project + '.js'), 'filter.tpl.js', project)
        util.createFile(join(projectPath, '.gitignore'), '.gitignore.tpl', project, true)

        console.log('Process done.')
    }
};

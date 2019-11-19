/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
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
        console.log(`Initializing project...`)

        let project = cliz.command(args)
        let projectPath = task.options.cwd

        if (!project) {
            project = basename(realpath(task.options.cwd))
        } else {
            projectPath = join(task.options.cwd, project)
            fu.mkdir(projectPath)
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

        console.log('Done.')
    }
};

/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , join = require('path').join
    , filtersApi = require('../api/filters-api')
    , util = require('../util')

module.exports = {

    /**
     * Verify sketches codebase.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        let sketch = cliz.command(args)
        if (!sketch) {
            cliz.fatal(`Missing sketch name. See more: 'sketches --help create-sketch'.`)
        }

        task.initConfigData();

        console.log(`Create sketch on '${task.configData.name}' project...`)

        let projectPath = task.options.cwd

        util.title(`Create '${sketch}' sketch`)
        fu.mkdir(join(projectPath, 'sketches', sketch))
        util.createFile(join(projectPath, 'sketches', sketch, sketch + '.ino'), 'sketch.tpl.ino', sketch)
        util.createFile(join(projectPath, 'sketches', sketch, sketch + '.h'), 'sketch.tpl.h', sketch)
        util.createFile(join(projectPath, 'filters', sketch + '.js'), 'filter.tpl.js', sketch)

        console.debug(`Update '${task.options.configFile}' file`)
        //cliz.debug(`Update '${task.options.configFile}' file`)

        let configData = cliz.configRaw(task.options.configFile)
        if (!configData.sketches.hasOwnProperty(sketch)) {
            configData.sketches[sketch] = {
                board: 'uno',
            }
            cliz.configSave(task.options.configFile, configData)
        }

        cliz.debug(`Done.`)
    }
};

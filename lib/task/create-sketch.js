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
            cliz.fatal(`Missing sketch name. Try 'arduinodk --help create-sketch'.`)
        }

        console.log(`ArduinoDK create sketch on '${adk.configData.name}' project...`)

        let projectPath = adk.options.cwd

        util.title(`Create '${sketch}' sketch`)
        fu.mkdir(join(projectPath, 'sketches', sketch))
        util.createFile(join(projectPath, 'sketches', sketch, sketch + '.ino'), 'sketch.tpl.ino', sketch)
        util.createFile(join(projectPath, 'sketches', sketch, sketch + '.h'), 'sketch.tpl.h', sketch)
        util.createFile(join(projectPath, 'filters', sketch + '.js'), 'filter.tpl.js', sketch)

        cliz.debug(`Update '${adk.options.configFile}' file`)
        let configData = cliz.configRaw(adk.options.configFile)
        if (!configData.sketches.hasOwnProperty(sketch)) {
            configData.sketches[sketch] = {
                board: 'uno',
            }
            cliz.configSave(adk.options.configFile, configData)
        }

        cliz.debug(`Done.`)
    }
};

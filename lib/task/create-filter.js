/*!
 * Sketchs
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

        console.log(`Create filter on '${task.configData.name}' project...`)

        let projectPath = task.options.cwd

        fu.mkdir(join(projectPath, 'filters', sketch))
        util.createFile(join(projectPath, 'filters', sketch + '.js'), 'filter.tpl.js', sketch)

        cliz.debug(`Done.`)
    }
}

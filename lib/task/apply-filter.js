/*!
 * Sketches
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const filterApi = require('../api/filter')
    , util = require('../util')

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        task.initConfigData();
        task.initEnvironment();
        task.initSketches(cliz);

        let sketch = adk.requireSketch('apply-filter', args, cb)
        let all = cliz.option(args, '--all')
        let noReset = cliz.option(args, '--no-reset')

        console.log(`Sketches apply verify filters on '${task.configData.name}' project...`)

        filterApi.applyFilters(adk, 'onBefore', 'apply-filters', sketch)

        if (!noReset) {
            filterApi.reset(adk, 'onAfter', 'apply-filters', sketch)
        }

        return cb()
    },
};

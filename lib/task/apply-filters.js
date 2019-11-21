/*!
 * Sketches
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , filtersApi = require('../api/filters-api')
    , util = require('../util')

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        let sketch = adk.requireSketch(cmd, args, cb)
        let inspect = cliz.option(args, '--inspect')

        console.log(`Sketches apply verify filters on '${adk.configData.name}' project...`)

        filtersApi.applyFilters(adk, 'onBefore', 'apply-filters', sketch)

        if (!inspect) {
            filtersApi.applyFilters(adk, 'onAfter', 'apply-filters', sketch)
        }

        return cb()
    },
};

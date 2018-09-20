/*!
 * arduinodk
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
        let sketch = adk.requireSketch(cmd, args, cb);

        console.log(`ArduinoDK apply verify filters on '${adk.configData.name}' project...`)

        filtersApi.applyFilters(adk, 'onBeforeVerify', sketch, true);

        return
    },
};

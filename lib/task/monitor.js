/*!
 * Sketches
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , systemApi = require('../api/system-api')
    , monitorApi = require('../api/monitor-api')
    , filtersApi = require('../api/filters-api')
    , serialport = require('serialport')
    , util = require('../util')

module.exports = {

    /**
     * Verify sketches codebase.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        systemApi.requireDialout(cmd, args, cb);

        console.log(`Sketches monitoring '${adk.configData.name}' project...`)
        let sketch = adk.requireSketch(cmd, args, cb)

        monitorApi.monitor(adk, sketch, cb);
    },
};

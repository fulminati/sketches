/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , systemApi = require('../api/system-api')
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

        console.log(`ArduinoDK monitoring '${adk.configData.name}' project...`)
        let sketch = adk.requireSketch(cmd, args, cb)

        this.monitor(adk, sketch, cb);
    },

    /**
     * Start monitor a specific port.
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    monitor: function (adk, sketch, cb) {
        console.log('monitor on port:', sketch.port);

        let port = new serialport(sketch.port, {
            baudRate: 9600
        });

        port.on('data', function (data) {
            process.stdout.write(data.toString())
        });
    }
};

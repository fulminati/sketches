/*!
 * arduinodk
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
     * Start monitor a specific port.
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    parse: function (adk, sketch, input) {
        input = input.replace(/\$\[file\]/gm, sketch.firmware.file)
        input = input.replace(/\$\[port\]/gm, sketch.port)

        return input
    }
};

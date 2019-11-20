/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const systemApi = require('../api/system-api')
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
    parse: function (sketch, input) {
        input = input.replace(/\$\[firmware\.file\]/gm, sketch.firmware.file)
        input = input.replace(/\$\[port\]/gm, sketch.port)

        return input
    }
};

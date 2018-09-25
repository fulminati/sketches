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
    monitor: function (adk, sketch, cb) {
        console.log('monitor on port:', sketch.port);

        var stdin = process.openStdin();

        stdin.addListener("data", function(d) {
            console.log("you entered: [" +
                d.toString().trim() + "]");

            port.write(d.toString().trim(), function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
                console.log('message written');
            });

        });

        let port = new serialport(sketch.port, {
            baudRate: 9600
        });

        port.on('data', function (data) {
            process.stdout.write(data.toString())
        });
    }
};

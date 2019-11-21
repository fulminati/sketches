/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const systemApi = require('../api/system-api')
    , monitorApi = require('../api/monitor-api')
    , filterApi = require('../api/filter')
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
    monitor: function (cliz, task, sketch, cb) {
        console.log('Monitor on port:', sketch.port);

        var stdin = process.openStdin()

        stdin.addListener("data", function(d) {
            console.log("you entered: [" +
                d.toString().trim() + "]");

            port.write(d.toString().trim(), function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message)
                }
                console.log('message written')
            })
        })

        let port = new serialport(sketch.port, {
            baudRate: sketch.boudRate
        })

        port.on('data', function (data) {
            process.stdout.write(data.toString())
        })
    }
};

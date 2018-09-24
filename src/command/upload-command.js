/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , join = require('path').join
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

        console.log(`ArduinoDK uploading '${adk.configData.name}' project...`)

        return this.uploadSketch(adk, sketch, cb);
    },

    /**
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    uploadSketch: function (adk, sketch, cb) {
        util.title(`Upload '${sketch}' sketch`)

        var params = [
            '--board', sketch.board,
            '--upload', sketch.entrypoint,
            '--pref', 'build.path=' + join(sketch.build, 'upload')
        ]

        filtersApi.applyFilters(adk, 'onBefore', 'verify', sketch)

        return adk.arduino(params, (info) => {
            filtersApi.applyFilters(adk, 'onAfter', 'verify', sketch)
            return cb(info)
        });
    },

};

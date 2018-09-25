/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , join = require('path').join
    , filtersApi = require('../api/filters-api')
    , monitorApi = require('../api/monitor-api')
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
        util.title(`Upload '${sketch.name}' sketch`)

        var params = [
            '--board', sketch.board,
            '--upload', sketch.entrypoint,
            '--pref', 'build.path=' + join(sketch.build, 'upload')
        ]

        filtersApi.applyFilters(adk, 'onBefore', 'upload', sketch)

        return adk.arduino(params, (info) => {
            filtersApi.applyFilters(adk, 'onAfter', 'upload', sketch)
            this.handleUploadExitCode(info);
            return monitorApi.monitor(adk, sketch, cb)
        });
    },

    /**
     *
     * @param info
     */
    handleUploadExitCode: function (info) {
        console.log(info.exitCode);
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            case 1: cliz.fatal(`Upload failed.`, info.exitCode); break;
            default: cliz.fatal(info.lastLine, info.exitCode);
        }
    }
};

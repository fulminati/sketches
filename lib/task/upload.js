/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const join = require('path').join
    , filtersApi = require('../api/filters-api')
    , monitorApi = require('../api/monitor-api')
    , util = require('../util')

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        task.initConfigData();
        task.initEnvironment();
        task.initSketches(cliz);

        let sketch = task.requireSketch('upload', args, cb)

        console.log(`Uploading '${task.configData.name}' project...`)

        return this.uploadSketch(cliz, task, sketch, cb);
    },

    /**
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    uploadSketch: function (cliz, task, sketch, cb) {
        util.title(`Upload '${sketch.name}' sketch`)

        let params = [
            '--board', sketch.board.board,
            '--upload', sketch.entrypoint,
            '--pref', 'build.path=' + join(sketch.build, 'upload')
        ]

        filtersApi.applyFilters(task, 'onBefore', 'upload', sketch)

        return task.arduino(cliz, params, (info) => {
            filtersApi.applyFilters(task, 'onAfter', 'upload', sketch)
            this.handleUploadExitCode(cliz, info);
            return monitorApi.monitor(task, sketch, cb)
        });
    },

    /**
     *
     * @param info
     */
    handleUploadExitCode: function (cliz, info) {
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            case 1: cliz.fatal(`Upload failed.`, info.exitCode); break;
            default: cliz.fatal(info.lastLine + ` (exit: ${info.exitCode})`, info.exitCode);
        }
    }
};

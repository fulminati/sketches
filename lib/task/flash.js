/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , stringArgv = require('string-argv')
    , placeholderApi = require('../api/placeholder-api')
    , systemApi = require('../api/system-api')
    , util = require('../util')

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        let sketch = task.requireSketch(cliz, args, cb)

        if (!sketch.hasOwnProperty('firmware')) {
            cliz.fatal(`Required 'firmware' section in '${sketch.name}' sketch.`)
        }

        console.log(`Flashing '${task.configData.name}' project...`)

        return this.flashBoard(cliz, task, sketch, cb);
    },

    /**
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    flashBoard: function (adk, sketch, cb) {
        util.title(`Flash '${sketch.board}' board associated to '${sketch.name}' sketch`)

        let file = join(sketch.firmware.path, sketch.firmware.file)

        fu.mkdir(sketch.firmware.path)
        systemApi.download(sketch.firmware.download, file, () => {
            let params = stringArgv(placeholderApi.parse(adk, sketch, sketch.firmware.flash))
            let cmd = params.shift()

            return systemApi.spawn(cmd, params, sketch.firmware.path, (info) => {
                return cb(info)
            });
        })
    },

    /**
     *
     * @param info
     */
    handleFlashExitCode: function (info) {
        console.log(info.exitCode);
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            case 1: cliz.fatal(`Upload failed.`, info.exitCode); break;
            default: cliz.fatal(info.lastLine, info.exitCode);
        }
    }
};

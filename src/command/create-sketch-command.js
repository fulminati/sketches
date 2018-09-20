/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , filtersApi = require('../api/filters-api')
    , util = require('../util')

module.exports = {

    /**
     * Verify sketches codebase.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        console.log(`ArduinoDK verifing '${adk.configData.name}' project...`)

        let sketch = adk.getSketch(args)

        if (sketch) {
            return this.verifySketch(adk, sketch, cb);
        }

        let sketches = Object.keys(adk.configData.sketches);

        let verifySketchLoop = (index) => {
            if (index < sketches.length) {
                this.verifySketch(adk, adk.configData.sketches[sketches[index]], (info) => {
                    this.handleVerifyExitCode(info);
                    verifySketchLoop(index+1);
                });
            }
        };

        return verifySketchLoop(0);
    },

    /**
     *
     * @param adk
     * @param sketch
     * @returns {*}
     */
    verifySketch: function (adk, sketch, cb) {
        util.title(`Verify '${sketch.name}' sketch`);

        var params = [
            '--board', sketch.board,
            '--verify', sketch.entrypoint
        ]

        filtersApi.applyFilters(adk, 'onBefore', sketch)

        return adk.arduino(params, (info) => {
            filtersApi.applyFilters(adk, 'onAfterVerify', sketch)
            return cb(info)
        });
    },

    /**
     *
     * @param info
     */
    handleVerifyExitCode: function (info) {
        //console.log(info.exitCode);
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            default: cliz.fatal(info.lastLine);
        }
    }
};

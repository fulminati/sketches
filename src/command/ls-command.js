/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const cliz = require('cliz')
    , foreach = require('boor').foreach
    , filtersApi = require('../api/filters-api')
    , util = require('../util')

module.exports = {

    /**
     * Verify sketches codebase.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        console.log(`ArduinoDK listing '${adk.configData.name}' project...`)

        util.title(`Sketches`)
        foreach(adk.configData.sketches, (name, sketch) => {
            console.log(name)
        })
    },
};

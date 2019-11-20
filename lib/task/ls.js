/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const foreach = require('boor').foreach
    , filtersApi = require('../api/filters-api')
    , util = require('../util')

module.exports = {

    /**
     * Verify sketches codebase.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        task.requireConfigFile()
        task.initConfigData()

        console.log(`Listing '${task.configData.name}' project...`)

        util.title(`Sketches`)
        foreach(task.configData.sketches, (name, sketch) => {
            console.log(name)
        })
    },
};

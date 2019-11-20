/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')

module.exports = {

    /**
     * Init filters for specific sketch.
     *
     * @param adk
     * @param sketch
     */
    initFilters: function (cliz, task, sketch, filters) {
        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i];
                if (!task.filters.hasOwnProperty(filter)) {
                    if (fu.fileExists(__dirname + '/../filter/' + filter + '.js')) {
                        adk.filters[filter] = require('./../filter/' + filter);
                    } else {
                        cliz.fatal(
                            "Unknown filter '" + filters[i] + "' inside sketch '" +
                            sketch + "' at file '" + adk.options.configFile + "'."
                        )
                    }
                }
            }
        }

        return filters
    },

    /**
     * Apply filters attached to specific sketch by event.
     */
    applyFilters: function (adk, event, cmd, sketch) {
        console.log('apply filter', event)
        var filters = sketch.filters;

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i]
                if (adk.filters.hasOwnProperty(filter)) {
                    if (typeof adk.filters[filter][event] === 'function') {
                        adk.filters[filter][event](sketch)
                    }
                }
            }
        }
    }
};

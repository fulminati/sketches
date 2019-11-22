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
                        task.filters[filter] = require('./../filter/' + filter);
                    } else {
                        cliz.fatal(
                            "Unknown filter '" + filters[i] + "' inside sketch '" +
                            sketch + "' at file '" + task.options.configFile + "'."
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
    loopFilters: function (event, cliz, task, args, sketch, cb) {
        const filters = sketch.filters;
        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i]
                if (task.filters.hasOwnProperty(filter)) {
                    if (typeof task.filters[filter][event] === 'function') {
                        task.filters[filter][event](sketch)
                    }
                }
            }
        }
    },

    /**
     *
     * @param cliz
     * @param task
     * @param args
     * @param sketch
     * @param cb
     */
    apply: function (cliz, task, args, sketch, cb) {
        return this.loopFilters('apply', cliz, task, args, sketch, cb)
    },

    /**
     *
     * @param cliz
     * @param task
     * @param args
     * @param sketch
     * @param cb
     */
    reset: function (cliz, task, args, sketch, cb) {
        return this.loopFilters('reset', cliz, task, args, sketch, cb)
    }
};

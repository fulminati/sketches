/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')

module.exports = {

    /**
     * Init filters for specific sketch.
     *
     * @param adk
     * @param sketch
     */
    initFilters: function (adk, sketch) {
        var filters = adk.configData.sketches[sketch]['filters'] || []

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i];
                if (!adk.filters.hasOwnProperty(filter)) {
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
     *
     */
    applyFilters: function (event, sketch) {
        var filters = sketch.filters;

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i]
                if (this.filters.hasOwnProperty(filter)) {
                    if (typeof this.filters[filter][event] === 'function') {
                        this.filters[filter][event](sketch)
                    }
                }
            }
        }
    }
};

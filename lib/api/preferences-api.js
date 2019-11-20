/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , foreach = require('boor').foreach

module.exports = {

    /**
     * Command line entry-point.
     *
     * @param {array} args a list of arguments
     * @returns {string}
     */
    load: function(file) {
        data = fu.readFile(file)
        preferences = {}

        foreach(data.split('\n'), (line) => {
            if (line) {
                line = line.split('=', 2)
                preferences[line[0]] = line[1].match(',') ? line[1].split(',') : line[1]
            }
        })

        if (!preferences['boardsmanager.additional.urls']) {
            preferences['boardsmanager.additional.urls'] = []
        }

        return preferences
    },

    /**
     * Get sotware help.
     *
     * @param args
     */
    save: function (preferences) {
        let data = ''
        foreach(preferences, function (key, value) {
            data += key + '=' + (Array.isArray(value) ? value.join(',') : value) + '\n'
        })
        return fu.writeFile(file, data);
    }
}

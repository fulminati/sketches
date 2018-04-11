/*!
 * arduinodk
 * Copyright(c) 2016-2017 Francesco Bianco
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , foreach = require('boor').foreach
    , util = require('./util')
    , adk = require('./adk')

const file = require('os').homedir() + '/.arduino15/preferences.txt'

module.exports = {

    /**
     * Command line entry-point.
     *
     * @param {array} args a list of arguments
     * @returns {string}
     */
    load: function() {
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

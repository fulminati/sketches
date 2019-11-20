/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , https = require('https')
    , systemApi = require('./system-api')

module.exports = {

    /**
     * @TODO: convert this to use systemApi.download
     * @param cb
     */
    load: function (task, cb) {
        let url = 'https://fulminati.github.io/sketches-index/sketches-index.json';
        systemApi.download(url, 'a');
    },

    /**
     *
     */
    detectPort: function(port) {
        if (!port) {
            return port
        }

        if (typeof port === "string" && port.indexOf('|') !== -1) {
            let ports = port.split('|')
            for (let i in ports) {
                ports[i] = ports[i].trim();
            }
            return this.detectPort(ports)
        }

        if (Array.isArray(port)) {
            for (let i in port) {
                if (systemApi.isWin() && this.isWinPort(port[i])) {
                    return port[i]
                }
                if (systemApi.isLinux() && this.isLinuxPort(port[i])) {
                    return port[i]
                }
            }
            return port[0]
        }
    },

    /**
     *
     * @param port
     * @returns {Array|{index: number, input: string}}
     */
    isWinPort: function(port) {
        return !!port.match(/^COM[0-9]+$/)
    },

    /**
     *
     * @param port
     * @returns {Array|{index: number, input: string}}
     */
    isLinuxPort: function(port) {
        return !!port.match(/^\/dev\/tty.+$/)
    }
}

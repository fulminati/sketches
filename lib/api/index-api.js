/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , https = require('https')

module.exports = {

    /**
     * @TODO: convert this to use systemApi.download
     * @param cb
     */
    load: function (task, cb) {
        let url = 'https://fulminati.github.io/sketches-index/sketches-index.json';
        systemApi.download(url, 'a');
    }
}

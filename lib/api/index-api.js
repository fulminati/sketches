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

    index: {
        "version": 1,
        "index": {
            "board": {
                "[default]":       { "board": "arduino:avr:uno", "install": "arduino:avr" },
                "uno":             { "board": "arduino:avr:uno", "install": "arduino:avr" },
                "nano":            { "board": "arduino:avr:nano", "install": "arduino:avr" },
                "esp8266":         { "board": "esp8266:esp8266:generic", "install": "esp8266:esp8266" },
                "esp8266:esp8266": { "board": "esp8266:esp8266:generic", "install": "esp8266:esp8266" }
            }
        }
    },

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
    resolveBoard: function(board) {
        if (!board) {
            return this.index.index.board['[default]'];
        }

        if (typeof this.index.index.board[board] !== 'undefined') {
            return this.index.index.board[board];
        }

        return {
            board: board,
            install: board
        };
    }
}

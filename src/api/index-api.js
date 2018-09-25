/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
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
    load: function (adk, cb) {
        let url = 'https://raw.githubusercontent.com/fulminati/arduinodk-index/master/arduinodk-index.json';
        https.get(url, (resp) => {
            let rawData = '';
            resp.on('data', (chunk) => { rawData += chunk; });
            resp.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    //console.log(parsedData);
                    cb()
                } catch (e) {
                    console.error(e.message);
                }
            })
        });
    }

};
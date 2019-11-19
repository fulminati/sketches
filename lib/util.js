/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , basename = require('path').basename
    , spawn = require('child_process').spawn
    , exec = require('child_process').execSync
    , user = require('username')
    , col = require('colors')

module.exports = {

    /**
     * Print info message.
     *
     * @param msg
     */
    log: function (msg, tokens) {
        return this.indent('(ndev)  ', this.applyTokens(msg, tokens));
    },


    /**
     *
     * @param key
     * @param msg
     */
    info: function (info) {
        console.log('   --->', info);
    },

    /**
     *
     * @param key
     * @param msg
     */
    title: function (title) {
        console.log(col.bold(`\n======= ${title} =======`));
    },

    /**
     *
     * @param opts
     * @param key
     */
    isEnabled: function (opts, key) {
        return typeof opts[key] != 'undefined' && opts[key]
    },

    /**
     *
     * @param token
     */
    applyTokens: function (msg, tokens) {
        for (token in tokens) {
            if (tokens.hasOwnProperty(token)) {
                msg = msg.replace('${'+token+'}', tokens[token]);
            }
        }
        return msg;
    },

    /**
     *
     */
    indent: function (msg, offset) {
        return msg.split('\n').join('\n' + this.pad(offset));
    },

    /**
     *
     */
    pad: function (len) {
        var str = '';
        for (var i = 0; i < len; i++) { str += ' '; }
        return str;
    },

    /**
     *
     */
    trim: function (str) {
        return str.trim();
    },

    /**
     *
     * @param file
     */
    loadJson: function (file) {
        return require(file);
    },

    /**
     *
     * @param file
     * @param info
     */
    saveJson: function (file, info) {
        fs.writeFileSync(file, JSON.stringify(info, null, 4));
    },

    /**
     *
     */
    getGroup: function () {
        return exec('id -g -n');
    },

    /**
     * Create file by tempalte.
     *
     * @param file
     * @param tpl
     * @param project
     */
    createFile: function (file, tpl, project, append) {
        if (!append && fu.fileExists(file)) { return; }
        let code = fu.readFile(join(__dirname, '../tpl/', tpl))
            .replace(/\{\{SKETCH_NAME\}\}/g, project)
            .replace(/\{\{SKETCH_PREFIX\}\}/g, project.toUpperCase())
            .replace(/\{\{FILE_NAME\}\}/g, basename(file))
        if (!append) {
            cliz.debug(`Create file '${file}'`)
            fu.writeFile(file, code)
        } else {
            cliz.debug(`Update file '${file}'`)
            fu.appendFile(file, code)
        }
    }
};



/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , spawn = require('child_process').spawn
    , EOL = require('os').EOL
    , util = require('../util')

module.exports = {

    /**
     * Exec command with spawn.
     */
    spawn: function (cmd, params, cb) {
        var raw = cmd + ' ' + params.join(' ');

        if (true) {
            cliz.debug(raw);
        }

        let wrapper = spawn(cmd, params);
        let stdoutLastLine = '';
        let stderrLastLine = '';
        let lastLine = '';
        let newline = '';

        // Attach stdout handler
        wrapper.stdout.on('data', function (data) {
            let line = data.toString().trim();
            if (line.length == 0) { return; }
            if (line.length > 30 && stdoutLastLine.length > 30
                && line.substr(0, 30) == stdoutLastLine.substr(0, 30)) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                newline = '';
            }
            process.stdout.write(newline + line)
            stdoutLastLine = line
            lastLine = line
            newline = EOL
        });

        // Attach stderr handler
        wrapper.stderr.on('data', function (data) {
            let line = data.toString().trim();
            if (line.length == 0) { return; }
            process.stderr.write(newline + line);
            stderrLastLine = line;
            lastLine = line
            newline = EOL
        });

        // Attach exit handler
        wrapper.on('exit', (code) => {
            process.stdout.write(EOL);
            cb({exitCode: code, lastLine: lastLine})
        });

        return raw;
    }
};

/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , spawn = require('child_process').spawn
    , https = require('https')
    , EOL = require('os').EOL
    , util = require('../util')
    , isRoot = require('is-root')

module.exports = {

    /**
     *
     */
    isWin: function() {
        return process.platform === 'win32';
    },

    /**
     *
     */
    isLinux: function() {
        return process.platform === 'linux';
    },

    /**
     * Exec command with spawn.
     */
    spawn: function (cmd, params, cwd, cb) {
        var raw = cmd + ' ' + params.join(' ');

        if (true) {
            cliz.debug(raw);
        }

        let wrapper = spawn(cmd, params, { cwd: cwd });
        let stdoutLastLine = '';
        let stderrLastLine = '';
        let lastLine = '';
        let newline = '';

        // Attach stdout handler
        wrapper.stdout.on('data', function (data) {
            let line = data.toString().trim();
            if (line.length == 0) { return; }
            else if (line == '.') { newline = ''; }
            else if (line.length > 30 && stdoutLastLine.length > 30
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
            else if (line == '.') { newline = ''; }
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
    },

    /**
     *
     */
    requireDialout: function (cmd, args) {
        console.log(`Detected platform '${process.platform}'`)
        switch (process.platform) {
            case 'linux':
                if (isRoot()) { return; }
                console.log(
                    `The command '${cmd}' require 'dialout' privileges\nplease use one of the follow solutions:\n\n`+
                    `    1. Execute as root with 'sudo arduinodk ${cmd} ${args.join(' ')}'\n`+
                    `    2. add your user on dialout group\n`
                )
                break;
            case 'aix':
            case 'darwin':
            case 'freebsd':
            case 'openbsd':
            case 'sunos':
            case 'win32':
                console.log("Contact for problem: bianco@javanile.org");
                break;
        }
        process.exit()
    },

    /**
     *
     * @param url
     * @param file
     * @param cb
     */
    download: function (url, file, cb) {
        https.get(url, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk; });
            resp.on('end', () => {
                try {
                    fu.writeFile(file, data)
                    cb()
                } catch (e) {
                    cliz.fatal(e.message);
                }
            })
        });
    }
};

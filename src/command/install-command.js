/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , exec = require('child_process').execSync
    , foreach = require('boor').foreach
    , preferencesApi = require('../api/preferences-api')
    , indexApi = require('../api/index-api')
    , util = require('../util')

module.exports = {

    /**
     * Install sketches dependencies.
     *
     * @param args
     */
    run: function (adk, cmd, args, cb) {
        console.log(`ArduinoDK installing '${adk.configData.name}' dependencies...`)

        indexApi.load(adk, () => {
            this.processInstall(adk, cmd, args, cb)
        })
    },

    /**
     *
     */
    processInstall: function (adk, cmd, args, cb) {
        // Adding boards manager
        let updatePreferences = false;
        foreach(adk.configData.packages, function (packageUrl) {
            if (adk.preferences['boardsmanager.additional.urls'].indexOf(packageUrl) === -1) {
                adk.preferences['boardsmanager.additional.urls'].push(packageUrl)
                updatePreferences = true
            }
        })

        // Install includes repository
        fu.mkdir('includes')
        foreach(adk.configData.includes, function (include) {
            if (!fu.exists('includes/' + include.name)) {
                exec('cd includes && git clone ' + include.link + ' ' + include.name);
            }
        })

        //
        if (updatePreferences) {
            preferencesApi.save(adk.preferences)
        }

        //
        let boards = []
        foreach(adk.configData.sketches, (sketch) => {
            if (boards.indexOf(sketch.board) === -1) {
                boards.push(sketch.board)
            }
        })

        //
        let libraries = []
        foreach(adk.configData.sketches, (sketch) => {
            foreach(sketch.require, (library) => {
                if (libraries.indexOf(library) === -1) {
                    libraries.push(library)
                }
            })
        })

        //
        let installBoardsLoop = (boards, info) => {
            if (boards.length > 0) {
                let board = boards.shift()
                util.title(`Install board '${board}' from internet`);
                return adk.arduino(['--install-boards', board], (info) => {
                    this.handleInstallBoardExitCode(info)
                    return installBoardsLoop(boards, info)
                })
            } else if (libraries.length > 0) {
                return adk.arduino(['--install-library', libraries.join(',')], cb)
            } else {
                return cb(info)
            }
        }

        return installBoardsLoop(boards)
    },

    /**
     *
     * @param info
     */
    handleInstallBoardExitCode: function (info) {
        if (info.exitCode == 255) {
            cliz.debug('Board is already installed.')
        } else {
            cliz.fatal(info.lastLine)
        }
    }

};

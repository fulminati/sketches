/*!
 * Sketches
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , exec = require('child_process').execSync
    , foreach = require('boor').foreach
    , preferencesApi = require('../api/preferences-api')
    , resolverApi = require('../api/resolver')
    , util = require('../util')

module.exports = {

    /**
     * Install sketches dependencies.
     *
     * @param args
     */
    run: function (cliz, task, args, cb) {
        task.initConfigData();
        task.initEnvironment();
        task.initSketches();

        console.log(`Installing '${task.configData.name}' dependencies...`)

        //indexApi.load(adk, () => {
            this.processInstall(cliz, task, args, cb)
        //})
    },

    /**
     * Install script.
     */
    processInstall: function (cliz, task, args, cb) {
        // Adding boards manager
        let updatePreferences = false;
        foreach(task.configData.packages, function (packageUrl) {
            if (task.preferences['boardsmanager.additional.urls'].indexOf(packageUrl) === -1) {
                task.preferences['boardsmanager.additional.urls'].push(packageUrl)
                updatePreferences = true
            }
        })

        // Install includes repository
        fu.mkdir('includes')
        foreach(task.configData.includes, function (include) {
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
        foreach(task.configData.sketches, (sketch) => {
            if (boards.indexOf(sketch.board) === -1) {
                boards.push(sketch.board)
            }
        })

        //
        let libraries = []
        foreach(task.configData.sketches, (sketch) => {
            foreach(sketch.require, (library) => {
                if (libraries.indexOf(library) === -1) {
                    libraries.push(library)
                }
            })
        })

        //
        let installBoardsLoop = (info) => {
            if (boards.length > 0) {
                let board = boards.shift()
                util.title(`Install board '${board.install}' from internet`);
                return task.arduino(cliz, ['--install-boards', board.install], (info) => {
                    this.handleInstallBoardExitCode(cliz, info)
                    return installBoardsLoop(info)
                })
            } else if (libraries.length > 0) {
                let library = libraries.shift()
                util.title(`Install library '${library}' from internet`);
                return adk.arduino(['--install-library', library], (info) => {
                    this.handleInstallLibrariesExitCode(info);
                    return installBoardsLoop(info)
                });
            } else {
                return cb(info)
            }
        }

        return installBoardsLoop(boards)
    },

    /**
     * Handle exit code of board installation.
     *
     * @param info
     */
    handleInstallBoardExitCode: function (cliz, info) {
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            case 255: cliz.debug('Board is already installed.'); break;
            default: cliz.fatal(info.lastLine + ` (exit: ${info.exitCode})`, info.exitCode);
        }
    },

    /**
     * Handle exit code of library installation.
     *
     * @param info
     */
    handleInstallLibrariesExitCode: function (info) {
        switch (info.exitCode) {
            case 0: cliz.debug(info.lastLine); break;
            default: cliz.fatal(info.lastLine + ` (exit: ${info.exitCode})`, info.exitCode);
        }
    }
}

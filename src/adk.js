/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require("path").join
    , spawn = require("child_process").spawn
    , exec = require("child_process").execSync
    , user = require('username')
    , base = require("path").basename
    , foreach = require('boor').foreach
    , prefs = require("./prefs")
    , util = require("./util")

module.exports = {

    /**
     *
     */
    options: {
        configFile: 'sketches.yml',
        info: false
    },

    /**
     *
     */
    config: {
        version: 1,
        sketches: {},
        includes: {},
        packages: []
    },

    /**
     *
     */
    commands: {
        sketch: 'commandSketch',
        verify: 'commandVerify',
        install: 'commandInstall'
    },

    /**
     *
     */
    filters: {},

    /**
     *
     */
    preferences: {},

    /**
     *
     */
    env: {
        ARDUINO: ''
    },

    /**
     *
     */
    run: function (cmd, args, cb) {
        this.register();
        this[this.commands[cmd]](cmd, args, cb)
    },

    /**
     *
     */
    register: function () {
        this.registerPreferences()
        this.registerEnvironment()
        this.registerConfig()
        this.registerSketches()
        this.registerIncludes()
    },

    /**
     *
     */
    registerEnvironment: function () {
        //
    },

    /**
     *
     */
    registerPreferences: function () {
        this.preferences = prefs.load()
    },

    /**
     *
     */
    registerConfig: function () {
        this.config = cliz.config(this.options.configFile, this.config)
    },

    /**
     *
     */
    registerSketches: function () {
        foreach(this.config.sketches, 'keys', (sketch) => {
            this.registerSketch(sketch)
        })
    },

    /**
     *
     */
    registerIncludes: function () {
        foreach(this.config.includes, (name, include) => {
            include.name = include.name || name
            if (!include.link) {
                console.log('!! missing include link:', name)
            }
        })
    },

    /**
     *
     */
    registerSketch: function (sketch) {
        var name = sketch

        this.config.sketches[sketch]['entrypoint'] = 'sketches/' + name + '/' + name + '.ino'
        this.config.sketches[sketch]['path'] = process.cwd() + '/sketches/' + name
        this.config.sketches[sketch]['name'] = name
        this.config.sketches[sketch]['filters'] = this.registerFilters(sketch)
    },

    /**
     *
     * @param sketch
     */
    registerFilters: function (sketch) {
        var filters = this.config.sketches[sketch]['filters'] || []

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i];
                if (!this.filters.hasOwnProperty(filter)) {
                    if (fu.fileExists(__dirname + '/filters/' + filter + '.js')) {
                        this.filters[filter] = require('./filters/' + filter);
                    } else {
                        cliz.error("Undefined filter '" + filters[i] + "' in '" + sketch + "' sketch")
                    }
                }
            }
        }

        return filters
    },

    /**
     *
     */
    requireSketch: function (cmd, args, cb) {
        var sketch = cliz.command(args)
        return this.config.sketches[sketch]
    },

    /**
     *
     */
    applyFilters: function (event, sketch) {
        var filters = sketch.filters;

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i]
                if (this.filters.hasOwnProperty(filter)) {
                    if (typeof this.filters[filter][event] === 'function') {
                        this.filters[filter][event](sketch)
                    }
                }
            }
        }
    },

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    commandDeploy: function (cmd, args, cb) {
        var params = [];

        params.push("--verify");
        params.push(sketch.entrypoint);

        return this.arduino(sketch, params, opts, callback);
    },

    /**
     * Perform "docker-compose ps" base command.
     *
     * @param args
     */
    commandVerify: function (cmd, args, cb) {
        let sketch = this.requireSketch(cmd, args, cb)

        if (sketch) {
            var params = [
                '--board', sketch.board,
                '--verify', sketch.entrypoint
            ]

            this.applyFilters('onBeforeVerify', sketch)

            return this.arduino(params, (exitCode) => {
                this.applyFilters('onAfterVerify', sketch)
                return cb(exitCode)
            });
        }
    },

    /**
     * Perform "docker-compose ps" base command.
     *
     * @param args
     */
    commandInstall: function (cmd, args, cb) {
        // Adding boards manager
        let updatePreferences = false;
        foreach(this.config.packages, function (packageUrl) {
            if (this.preferences['boardsmanager.additional.urls'].indexOf(packageUrl) === -1) {
                this.preferences['boardsmanager.additional.urls'].push(packageUrl)
                updatePreferences = true
            }
        })

        // Install includes repository
        fu.mkdir('includes')
        foreach(this.config.includes, function (include) {
            if (!fu.exists('includes/' + include.name)) {
                exec('cd includes && git clone ' + include.link + ' ' + include.name);
            }
        })

        //
        if (updatePreferences) {
            prefs.save(this.preferences)
        }

        //
        let boards = []
        foreach(this.config.sketches, (sketch) => {
            if (boards.indexOf(sketch.board) === -1) {
                boards.push(sketch.board)
            }
        })

        //
        let libraries = []
        foreach(this.config.sketches, (sketch) => {
            foreach(sketch.require, (library) => {
                if (libraries.indexOf(library) === -1) {
                    libraries.push(library)
                }
            })
        })

        //
        let installBoardsLoop = (boards, exitCode) => {
            if (boards.length > 0) {
                let board = boards.shift()
                return this.arduino(['--install-boards', board], (exitCode) => {
                    return installBoardsLoop(boards, exitCode)
                })
            } else if (libraries.length > 0) {
                return this.arduino(['--install-library', libraries.join(',')], cb)
            } else {
                return cb(exitCode)
            }
        }

        return installBoardsLoop(boards)
    },

    /**
     * Perform arduino command.
     *
     * @param args
     */
    arduino: function (params, cb) {
        return this.spawn(this.config.arduino, params, function (out) { cb(out) });
    },

    /**
     * Exec command with spawn.
     */
    spawn: function (cmd, params, cb) {
        var raw = cmd + ' ' + params.join(' ');

        if (true) {
            util.info('spawn', raw);
        }

        var wrapper = spawn(cmd, params);

        // Attach stdout handler
        wrapper.stdout.on('data', function (data) {
            let line = data.toString()
            process.stdout.write(line);
        });

        // Attach stderr handler
        wrapper.stderr.on('data', function (data) {
            process.stdout.write(data.toString());
        });

        // Attach exit handler
        wrapper.on('exit', function (code) {
            var code = code.toString();
            cb(code)
        });

        return raw;
    }
};

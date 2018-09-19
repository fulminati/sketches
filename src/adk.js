/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , spawn = require('child_process').spawn
    , exec = require('child_process').execSync
    , homedir = require('os').homedir()
    , user = require('username')
    , base = require('path').basename
    , foreach = require('boor').foreach
    , systemApi = require('./api/system-api')
    , preferencesApi = require('./api/preferences-api')
    , filtersApi = require('./api/filters-api')
    , installCommand = require('./command/install-command')
    , util = require('./util')

module.exports = {

    /**
     * Runtime options.
     */
    options: {
        info: false,
        configFile: 'sketches.yml'
    },

    /**
     * Config data provided by sketches.yml file.
     */
    configData: {
        version: 1,
        sketches: {},
        includes: {},
        packages: []
    },

    /**
     * Available commands.
     */
    commands: {
        sketch: 'commandSketch',
        verify: 'commandVerify',
        install: installCommand
    },

    /**
     * Loaded filters.
     */
    filters: {},

    /**
     * Loaded preferences.
     */
    preferences: {},

    /**
     * Loaded environments variables.
     */
    env: {},

    /**
     * Run adk command.
     */
    run: function (cmd, args, cb) {
        this.init();
        this.commands[cmd].run(this, cmd, args, cb)
    },

    /**
     * Init at runtime.
     */
    init: function () {
        this.initPreferences()
        this.initEnvironment()
        this.initConfigData()
        this.initSketches()
        this.initIncludes()
    },

    /**
     * Init the environment.
     */
    initEnvironment: function () {
        // ARDUINO: ''
    },

    /**
     * Init preferences.
     */
    initPreferences: function () {
        let file = join(homedir, '/.arduino15/preferences.txt')
        this.preferences = preferencesApi.load(file)
    },

    /**
     * Init config data from sketchs.yml file.
     */
    initConfigData: function () {
        this.configData = cliz.config(this.options.configFile, this.configData)
    },

    /**
     * Init includes dependencies.
     */
    initIncludes: function () {
        foreach(this.configData.includes, (name, include) => {
            include.name = include.name || name
            if (!include.link) {
                console.log('!! missing include link:', name)
            }
        })
    },

    /**
     * Init all sketches.
     */
    initSketches: function () {
        foreach(this.configData.sketches, 'keys', (sketch) => {
            this.initSketch(sketch)
        })
    },

    /**
     * Init single sketch.
     */
    initSketch: function (sketch) {
        var name = sketch

        this.configData.sketches[sketch]['entrypoint'] = 'sketches/' + name + '/' + name + '.ino'
        this.configData.sketches[sketch]['path'] = process.cwd() + '/sketches/' + name
        this.configData.sketches[sketch]['name'] = name
        this.configData.sketches[sketch]['filters'] = filtersApi.initFilters(this, sketch)
    },

    /**
     *
     */
    requireSketch: function (cmd, args, cb) {
        let sketch = cliz.command(args)
        return this.configData.sketches[sketch]
    },

    /**
     * Execute arduino console command.
     *
     * @param args
     */
    arduino: function (params, cb) {
        return systemApi.spawn(this.configData.arduino, params, (out) => { cb(out) })
    }
};

/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , homedir = require('os').homedir()
    , foreach = require('boor').foreach
    , merge = require('deepmerge')
    , systemApi = require('./api/system-api')
    , filtersApi = require('./api/filters-api')
    , preferencesApi = require('./api/preferences-api')

module.exports = {

    /**
     * Runtime options.
     */
    options: {
        cwd: '',
        info: false,
        configFile: 'Sketches.yml'
    },

    /**
     * Config data provided by sketches.yml file.
     */
    configData: {
        version: '0.0.0',
        sketches: {},
        includes: {},
        packages: []
    },

    /**
     * Available commands.
     */
    tasks: [
        'ls',
        'init',
        'flash',
        'verify',
        'upload',
        'install',
        'monitor',
        'sandbox',
        'rename-sketch',
        'create-sketch',
        'apply-filters'
    ],

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
    environment: {},

    /**
     * Run adk command.
     */
    run: function (cliz, task, args, cb) {
        if (this.tasks.indexOf(task) === -1) {
            return cliz.error("Unknown task name '" + cmd + "'. See more: 'sketches --help'", cb)
        }

        this.init()
        this.load(task).run(cliz, this, args, cb)
    },

    /**
     * Init at runtime.
     */
    init: function () {
        //this.initPreferences()
        //this.initEnvironment()
        //this.initConfigData()
        //this.initSketches()
        //this.initIncludes()
    },

    /**
     *
     * @param task
     * @returns {*}
     */
    load: function(task) {
        return require(join(__dirname, 'task', task));
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
    initSketch: function (name) {
        let sketch = this.configData.sketches[name];

        if (sketch.extends) {
            if (sketch.extends == name) {
                cliz.fatal(`The sketch '${name}' can not extends itself.`)
            }

            if (!this.configData.sketches.hasOwnProperty(sketch.extends)) {
                cliz.fatal(`The sketch '${name}' can not extends a not defined '${sketch.extends}' sketch.`)
            }

            sketch = merge(this.configData.sketches[sketch.extends], sketch)

            delete sketch.extends
        }

        sketch['entrypoint'] = 'sketches/' + name + '/' + name + '.ino'
        sketch['path'] = this.options.cwd + '/sketches/' + name
        sketch['name'] = name
        sketch['filters'] = filtersApi.initFilters(this, name, sketch['filters'] || [])
        sketch['build'] = this.options.cwd + '/build/' + name
        sketch['sandbox'] = this.options.cwd + '/sketches/' + name + '/_sandbox.js'

        if (sketch.hasOwnProperty('firmware') && sketch['firmware'].hasOwnProperty('file')) {
            sketch['firmware']['path'] = this.options.cwd + '/build/' + name + '/flash'
        }

        this.configData.sketches[name] = sketch

        //console.log(sketch)
        //process.exit();
    },

    /**
     * Retrieve sketch into cli arguments.
     */
    getSketch: function (args) {
        let sketch = cliz.command(args)
        return this.configData.sketches[sketch]
    },

    /**
     * Retrive and assert as fatal a sketch name inside args.
     */
    requireSketch: function (cmd, args, cb) {
        let sketch = cliz.command(args)

        if (!sketch) {
            let sketches = Object.keys(this.configData.sketches);
            if (sketches.length > 1) {
                cliz.fatal(`Syntax error '${cmd}' require valid sketch`);
            }
            sketch = sketches[0];
        }

        if (!this.configData.sketches.hasOwnProperty(sketch)) {
            cliz.fatal(`The '${sketch}' sketch not found in '${this.options.configFile}'.`)
        }

        return this.configData.sketches[sketch]
    },

    /**
     * Execute arduino console command.
     *
     * @param args
     */
    arduino: function (params, cb) {
        return systemApi.spawn(this.configData.arduino, params, this.options.cwd, (info) => { cb(info) })
    }
};
/*!
 * Sketches
 *
 * Copyright(c) 2016-2019 Fulminati
 * MIT Licensed
 */

const fu = require('nodejs-fu')
    , cliz = require('cliz')
    , join = require('path').join
    , homedir = require('os').homedir()
    , realpath = require('fs').realpathSync
    , foreach = require('boor').foreach
    , merge = require('deepmerge')
    , resolverApi = require('./api/resolver')
    , serialApi = require('./api/serial-api')
    , systemApi = require('./api/system-api')
    , filterApi = require('./api/filter')
    , preferencesApi = require('./api/preferences-api')

module.exports = {

    /**
     * Runtime options.
     */
    options: {
        cwd: '.',
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
        'info',
        'init',
        'flash',
        'verify',
        'upload',
        'install',
        'monitor',
        'sandbox',
        'rename-sketch',
        'create-sketch',
        'create-filter',
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
     * Run task.
     */
    run: function (cliz, task, args, cb) {
        if (this.tasks.indexOf(task) === -1) {
            return cliz.fatal("Unknown task name '" + cmd + "'. See more: 'sketches --help'", cb)
        }

        this.load(task).run(cliz, this, args, cb)
    },

    /**
     * Load task module.
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
        this.environment['ARDUINO'] = process.env.ARDUINO
        if (!this.configData.arduino) {
            this.configData.arduino = this.environment['ARDUINO']
        }
    },

    /**
     * Init preferences.
     */
    initPreferences: function () {
        const file = join(homedir, '/.arduino15/preferences.txt')
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
     * Init config data from sketchs.yml file.
     */
    initIndex: function () {
        //this.configData = cliz.config(this.options.configFile, this.configData)
    },

    /**
     * Init all sketches.
     */
    initSketches: function (cliz) {
        foreach(this.configData.sketches, 'keys', (sketch) => {
            this.initSketch(cliz, sketch)
        })
    },

    /**
     * Init single sketch.
     */
    initSketch: function (cliz, name) {
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

        sketch['entrypoint'] = join('sketches', name, name + '.ino')
        sketch['path'] = this.options.cwd + '/sketches/' + name
        sketch['name'] = name
        sketch['filters'] = filterApi.initFilters(cliz, this, name, sketch['filters'] || [])
        sketch['build'] = join(realpath(this.options.cwd), 'build', name)
        sketch['sandbox'] = join(realpath(this.options.cwd), 'sketches', name, '_sandbox.js')

        sketch['board'] = resolverApi.resolveBoard(sketch['board'])
        if (sketch['cpu'] && !sketch['board'].board.match(/:cpu=[^:]+/)) {
            sketch['board'].board = sketch['board'].board.trim(':').replace(/:cpu=/, '') + ':cpu=' + sketch['cpu']
        }

        sketch['boudRate'] = sketch['boudRate'] || 9600
        sketch['port'] = serialApi.detectPort(sketch['port'])

        if (sketch.hasOwnProperty('firmware') && sketch['firmware'].hasOwnProperty('file')) {
            sketch['firmware']['path'] = join(realpath(this.options.cwd), 'build', name, 'flash')
        }

        this.configData.sketches[name] = sketch
    },

    /**
     * Retrieve sketch into cli arguments.
     */
    getSketch: function (args) {
        let sketch = cliz.command(args)
        return this.configData.sketches[sketch]
    },

    /**
     *
     * @returns {*}
     */
    requireConfigFile: function() {
        if (!fu.fileExists(this.options.configFile)) {
            return cliz.fatal("Sketches file '" + task.options.configFile + "' not found.", cb)
        }
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
    arduino: function (cliz, params, cb) {
        if (!this.configData.arduino) {
            cliz.fatal("Arduino executable missing. See more: https://github.com/fulminati/sketches/wiki/arduino-path")
        }

        return systemApi.spawn(this.configData.arduino, params, this.options.cwd, (info) => { cb(info) })
    }
};

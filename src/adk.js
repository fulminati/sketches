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
    registerConfig: function () {
        this.config = cliz.config(this.options.configFile, this.config)

        foreach(this.config.sketches, (sketch) => {
            this.registerSketch(sketch.name)
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

        return sketch
    },

    /**
     *
     */
    applyFilters: function (event, sketch) {
        var filters = this.config.sketches[sketch].filters;

        for (var i in filters) {
            if (filters.hasOwnProperty(i)) {
                var filter = filters[i]
                if (this.filters.hasOwnProperty(filter)) {
                    if (typeof this.filters[filter][event] === 'function') {
                        this.filters[filter][event](this.config.sketches[sketch])
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
        var adk = this;
        var sketch = adk.requireSketch(cmd, args, cb)

        if (sketch) {
            var params = ['--verify', this.config.sketches[sketch].entrypoint]

            this.applyFilters('onBeforeVerify', sketch)

            return adk.arduino(params, function () {
                adk.applyFilters('onAfterVerify', sketch)
            });
        }
    },

    /**
     * Perform "docker-compose ps" base command.
     *
     * @param args
     */
    commandInstall: function (cmd, args, cb) {
        foreach(this.config.packages, function (package) {
            console.log(package)
        });


        var includes = this.config.includes

        for (var include in includes) {
            if (includes.hasOwnProperty(include)) {
                exec('cd includes && git clone ' + includes[include].repository + ' ' + include);
            }
        }
    },

    /**
     * Perform arduino command.
     *
     * @param args
     */
    arduino: function (params, cb) {
        var arduino = this.config.arduino;

        return this.spawn(arduino, params, function (out) { cb(out) });
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
            process.stdout.write(data.toString());
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

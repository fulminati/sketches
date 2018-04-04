/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fs = require("fs")
    , cliz = require('cliz')
    , join = require("path").join
    , spawn = require("child_process").spawn
    , exec = require("child_process").execSync
    , user = require('username')
    , base = require("path").basename
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
        sketches: {}
    },

    /**
     *
     */
    commands: {
        sketch: 'commandSketch',
        verify: 'commandVerify'
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

        for (var sketch in this.config.sketches) {
            if (this.config.sketches.hasOwnProperty(sketch)) {
                this.registerSketch(sketch)
            }
        }
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
                    if (cliz.fileExists(__dirname + '/filters/' + filter + '.js')) {
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
     * Perform "docker-compose run" base command.
     *
     * @param args
     */
    cmdStop: function (args, opts, callback) {
        if (args && args.indexOf("--all") > -1) {
            return this.dockerStopAll(args, opts, callback)
        }

        var params = [];
        if (this.hasEnvironment(args)) {
            params = params.concat(this.getEnvironmentParams(args));
            args = this.removeEnvironment(args);
        }

        params.push("stop");
        params = params.concat(args);

        return this.compose(params, opts, callback);
    },

    /**
     * Perform "docker-compose run" base command.
     *
     * @param args
     */
    cmdRun: function (args, opts, callback) {
        var params = [];
        if (this.hasEnvironment(args)) {
            params = params.concat(this.getEnvironmentParams(args));
            args = this.removeEnvironment(args);
        }

        params.push("run");

        if (args) { params = params.concat(args); }

        return this.compose(params, opts, callback);
    },

    /**
     * Perform "docker-compose exec" base command.
     *
     * @param args
     */
    cmdExec: function (args, opts, callback) {
        var params = [];
        if (this.hasEnvironment(args)) {
            params = params.concat(this.getEnvironmentParams(args));
            args = this.removeEnvironment(args);
        }

        params.push("exec");

        for (var i in args) {
            if (!args.hasOwnProperty(i)) { continue; }
            if (args[i] == "--mysql-import") {
                var next = parseInt(i) + 1;
                if (!args[next]) {
                    return util.err("File to import missing, type filename after --mysql-import");
                }
                if (args.indexOf("bash") == -1) { params.push("bash"); }
                params.push("-c");
                params.push('"mysql -h127.0.0.1 -uroot -p\\$MYSQL_ROOT_PASSWORD \\$MYSQL_DATABASE < '+args[next]+'"');
            }
            params.push(args[i]);
        }

        return this.compose(params, opts, callback);
    },

    /**
     * Perform "docker-compose exec" base command.
     *
     * @param args
     */
    cmdDebug: function (args, opts, callback) {
        var params = [];
        if (this.hasEnvironment(args)) {
            params = params.concat(this.getEnvironmentParams(args));
            args = this.removeEnvironment(args);
        }

        params.push("up");

        if (args) { params = params.concat(args); }

        return this.compose(params, opts, callback);
    },

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    runDefault: function (args, opts, callback) {
        var params = [];
        if (this.hasEnvironment(args)) {
            params = params.concat(this.getEnvironmentParams(args));
            args = this.removeEnvironment(args);
        }

        if (args) { params = params.concat(args); }

        return this.compose(params, opts, callback);
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
     * Check if args contain envrironment specification.
     *
     */
    hasEnvironment: function (args) {
        for (var i in this.environments) {
            if (args.indexOf(this.environments[i]) > -1) {
                return true;
            }
        }
        return false;
    },

    /**
     * Get docker-compose argument based on environment.
     *
     */
    getEnvironmentParams: function (args) {
        var params = []

        if (fs.existsSync(join(this.cwd, "docker-compose.yml"))) {
            params = params.concat(["-f", "docker-compose.yml"]);
        }

        for (var i in args) {
            var env = args[i];
            if (this.environments.indexOf(env) > -1) {
                var file = "docker-compose."+env.substr(2)+".yml";
                if (fs.existsSync(join(this.cwd, file))) {
                    params = params.concat(["-f", file]);
                }
            }
        }

        return params;
    },

    /**
     * Remove environmnent argument on a list of args.
     *
     */
    removeEnvironment: function (args) {
        for (var i in this.environments) {
            var env = args.indexOf(this.environments[i]);
            if (env > -1) { args.splice(env, 1); }
        }
        return args;
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

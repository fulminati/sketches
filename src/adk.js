/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

const fs = require("fs")
    , sudo = require("sudo")
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
    applyConfig: function () {
        this.config = cliz.config(this.options.configFile, this.config)

        for (var sketch in this.config.sketches) {
            if (this.config.sketches.hasOwnProperty(sketch)) {
                var name = sketch
                this.config.sketches[sketch]['entrypoint'] = 'sketches/' + name + '/' + name + '.ino'
                this.config.sketches[sketch]['name'] = name
            }
        }
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
    loadSketch: function () {
        var file = path.join(process.cwd(), "./sketch.yml");

        if (!fs.existsSync(file)) {
            return util.err("Missing sketch file, type 'arduinodk init");
        }

        sketch = yaml.load(file);

        if (typeof sketch["name"] !== "string" ) {
            sketch.name = path.basename(process.cwd());
        }


        return sketch;
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
        var sketch = this.requireSketch(cmd, args, cb)

        if (sketch) {
            var params = ['--verify', this.config.sketches[sketch].entrypoint]

            this.applyFilters(sketch)

            return this.arduino(params, function () {

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

        return this.exec(arduino, params, function (out) { cb(out) });
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
    exec: function (cmd, params, cb) {
        var rawCommand = cmd + " " + params.join(" ");

        if (true) {
            util.info("exec", rawCommand);
        }

        // Running command
        var wrapper = util.isEnabled(opts, "sudo")
            ? sudo([cmd].concat(params)) : spawn(cmd, params);

        // Attach stdout handler
        wrapper.stdout.on("data", function (data) {
            if (util.isEnabled(opts, 'hideStdOut')) { return; }
            process.stdout.write(data.toString());
        });

        // Attach stderr handler
        wrapper.stderr.on("data", function (data) {
            if (util.isEnabled(opts, 'hideStdErr')) { return; }
            process.stdout.write(data.toString());
        });

        // Attach exit handler
        wrapper.on("exit", function (code) {
            var code = code.toString();
            var info = util.isEnabled(opts, 'showInfo');
            if (!info && code != "0") {
                info = true
                util.info("exec", rawCommand);
            }
            if (info) {
                var msg = "sounds like success.";
                if (code != "0") { msg = "some error occurred."; }
                util.info("done",  "(exit="+code+") " + msg);
            }
        });

        return rawCommand;
    }
};

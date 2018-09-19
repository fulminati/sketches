/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

module.exports = {

    /**
     * Perform "docker-compose up" base command.
     *
     * @param args
     */
    commandDeploy: function (cmd, args, cb) {
        var params = [];

        params.push("--deploy");
        params.push(sketch.entrypoint);

        return this.arduino(sketch, params, opts, callback);
    },

};

/*!
 * arduinodk
 * Copyright(c) 2016-2017 Javanile.org
 * MIT Licensed
 */

module.exports = {


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


};

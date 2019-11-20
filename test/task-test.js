"use strict";

var cli = require("../src/cli");
var ops = require("../src/ops");
var util = require("../src/util");
var chai = require("chai");

chai.use(require("chai-fs"));

describe("Testing command-line interface", function () {

    it("dockerops", function () {
        var exec = cli.run();
        chai.assert.equal(exec, "docker-compose ps");
        var exec = cli.run([]);
        chai.assert.equal(exec, "docker-compose ps");
    });

    it("dockerops unknown", function () {
        var exec = cli.run(['unknown']);
        chai.assert.equal(exec, "docker-compose run unknown bash");
    });

    it("dockerops --help", function () {
        //chai.assert.match(cli.run(["--help"]), /Usage:/, "Help not match");
    });

    it("dockerops --help up", function () {
        //var help = cli.run(["--help", "clone"]);
        //chai.assert.match(help, /Usage: ndev clone/, "Command help not match");
    });

    it("dockerops --help unknown", function () {
        //var message = cli.run(["--help", "unknown"]);
        //chai.assert.match(message, /Undefined command/, "Command help not match");
    });

    it("dockerops --version", function () {
        //var version = cli.run(["--version"]);
        //chai.assert.match(version, /[0-9]+\.[0-9]+\.[0-9]+/, "Version not match");
    });

    it("dockerops up", function () {
        var exec = cli.run(["up"]);
        chai.assert.equal(exec, "docker-compose up -d --remove-orphans");
    });

});
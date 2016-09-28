var path = require('path')
var Jasmine = require('jasmine')
var SpecReporter = require('jasmine-spec-reporter')
var noop = function(){}

var jrunner = new Jasmine()
jrunner.env.clearReporters()
jrunner.addReporter(new SpecReporter());
jrunner.projectBaseDir = '';
jrunner.specDir = '';
jrunner.randomizeTests(false);
jrunner.addSpecFiles([path.resolve('tests/*.js')]);
jrunner.execute();
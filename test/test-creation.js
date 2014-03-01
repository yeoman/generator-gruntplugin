/*global describe, before, it*/
'use strict';

var assert  = require('assert');
var glob = require('glob');
var helpers = require('yeoman-generator').test;
var jshint = require('jshint/src/cli').run;
var reporter = require('jshint-stylish').reporter;
var path = require('path');

describe('gruntplugin generator', function () {
  before(function (done) {
    var app = helpers.createGenerator('gruntplugin:app', ['./app']);
    var tempDir = path.join(__dirname, 'temp');
    app.options['skip-install'] = true;
    helpers.mockPrompt(app, {
      'name': 'mytask',
      'description': 'awesome grunt plugin',
      'homepage': 'http://google.com',
      'license': 'MIT',
      'githubUsername': 'octocat',
      'authorName': 'Octo Cat',
      'authorEmail': 'octo@example.com'
    });
    var runApp = function (err) {
      if (err) {
        return done(err);
      }
      app.run(done);
    };
    helpers.testDirectory(tempDir, runApp);
  });

  it('creates expected files', function () {
    var expected = [
      'tasks/mytask.js',
      'test/mytask_test.js',
      'test/expected/default_options',
      '.gitignore',
      '.jshintrc',
      'Gruntfile.js',
      'package.json',
    ];
    helpers.assertFile(expected);
  });

  it('creates valid package.json', function() {
    helpers.assertFileContent('package.json', RegExp(/"name": "mytask"/));
  });

  it('creates a stylish plugin', function () {
    var options = {
      'show-non-errors': true,
      'reporter': reporter,
    };
    glob('**/*.js', function (err, files) {
      options.args = files;
      var valid = jshint(options);
      assert.ok(valid);
    });
  });

});

/*global describe, before, it*/
'use strict';

var helpers = require('yeoman-generator').test;
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
      ['package.json', /"name": "mytask"/],
    ];
    helpers.assertFiles(expected);
  });
});

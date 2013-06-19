/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;

describe('gruntplugin generator', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.app = helpers.createGenerator('gruntplugin:app', [
        '../../app'
      ]);
      this.app.options['skip-install'] = true;
      done();
    }.bind(this));
  });

  it('creates expected files', function (done) {
    var expected = [
      'tasks/mytask.js',
      'test/mytask_test.js',
      'test/expected/default_options',
      '.gitignore',
      '.jshintrc',
      'Gruntfile.js',
      ['package.json', /"name": "mytask"/],
    ];

    helpers.mockPrompt(this.app, {
      'name': 'mytask',
      'description': 'awesome grunt plugin',
      'homepage': 'http://google.com',
      'license': 'MIT',
      'githubUsername': 'octocat',
      'authorName': 'Octo Cat',
      'authorEmail': 'octo@example.com'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});

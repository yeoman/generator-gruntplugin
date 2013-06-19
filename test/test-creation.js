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
      '.jshintrc',
      'LICENSE-MIT',
      'tasks/mytask.js',
      'test/mytask_test.js',
      'test/expected/default_options',
      ['package.json', /"name": "mytask"/],
    ];

    helpers.mockPrompt(this.app, {
      'name': 'mytask',
      'description': 'awesome grunt plugin',
      'version': '0.1.0',
      'repository': 'http://github.com/user/module',
      'homepage': 'http://google.com',
      'bugs': 'http://jira.com',
      'licenses': 'MIT',
      'github_username': 'octocat',
      'author_name': 'Octo Cat',
      'author_email': 'octo@example.com',
      'grunt_version': '~0.4.1',
      'node_version': '~0.10.5'
    });

    this.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });
});

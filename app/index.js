'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var GruntpluginGenerator = module.exports = function GruntpluginGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};
util.inherits(GruntpluginGenerator, yeoman.generators.NamedBase);

GruntpluginGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log(
    this.yeoman
    + '\nFor more information about Grunt plugin best practices,'
    + '\nplease see the docs at http://gruntjs.com/creating-plugins');

  var prompts = [{
    name: 'name',
    message: 'Plugin Name',
    filter: function (value) {
      var contribRegex = /^grunt-contrib/;

      if (contribRegex.test(value)) {
        console.log((
          'Removing "contrib" from your project\'s name. The grunt-contrib' +
          '\nnamespace would like to be reserved for tasks maintained by the grunt team.'
        ).red);
        value = value.replace(contribRegex, 'grunt');
      }

      return value;
    }
  }, {
    name: 'description',
    message: 'Description',
    default: 'The best plugin ever.'
  }, {
    name: 'homepage',
    message: 'Homepage'
  }, {
    name: 'license',
    message: 'License',
    default: 'MIT'
  }, {
    name: 'githubUsername',
    message: 'GitHub username'
  }, {
    name: 'authorName',
    message: 'Author\'s Name'
  }, {
    name: 'authorEmail',
    message: 'Author\'s Email'
  }, {
    name: 'authorUrl',
    message: 'Author\'s Homepage'
  }];

  this.currentYear = (new Date()).getFullYear();

  this.prompt(prompts, function (props) {
    this.slugname = this._.slugify(props.name);

    this.shortname = props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');

    this.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;

    if (!props.homepage) {
      props.homepage = this.repoUrl;
    }

    this.props = props;

    cb();
  }.bind(this));
};

GruntpluginGenerator.prototype.tasks = function tasks() {
  this.mkdir('tasks');
  this.template('tasks/name.js', 'tasks/' + this.shortname + '.js');
};

GruntpluginGenerator.prototype.test = function test() {
  this.directory('test/expected');
  this.directory('test/fixtures');
  this.template('test/name_test.js', 'test/' + this.shortname + '_test.js');
};

GruntpluginGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');

  this.template('README.md');
  this.template('Gruntfile.js');
  this.template('_package.json', 'package.json');
};

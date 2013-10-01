'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var gruntprompts = require('grunt-prompts');

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
    default: 'The best Grunt plugin ever.'
  }, {
    name: 'version',
    message: 'Version',
    default: '0.0.1'
  }, {
    name: 'repository',
    message: 'Project git repository'
  }, {
    name: 'homepage',
    message: 'Project homepage'
  }, {
    name: 'license',
    message: 'License',
    default: 'MIT'
  }, {
    name: 'author_name',
    message: 'Author name'
  }, {
    name: 'author_email',
    message: 'Author email'
  }, {
    name: 'author_url',
    message: 'Author url'
  },{
    name: 'node_version',
    message: 'What versions of node does it run on?',
    default: '>= 0.8.0'
  },{
    name: 'grunt_version',
    message: 'What version of grunt does it need?',
    default: '~0.4.0rc2'
  }];

  this.currentYear = (new Date()).getFullYear();

  this.prompt(prompts, function (props) {
    this.slugname = this._.slugify(props.name);

    this.shortname = props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
    this.author_name = props.author_name.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');

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
  //this.write('package.json', gruntprompts.packageJSON(this.props));
};

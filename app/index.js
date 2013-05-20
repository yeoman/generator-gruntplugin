'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var prompts = require('grunt-prompts');
var async = require('async');

var GruntpluginGenerator = module.exports = function GruntpluginGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({
      bower: false,
      skipInstall: options['skip-install']
    });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
  this.currentYear = (new Date()).getFullYear();
  this.props = Object.create(null);
};
util.inherits(GruntpluginGenerator, yeoman.generators.NamedBase);

GruntpluginGenerator.prototype.askFor = function askFor() {
  var self = this;
  var done = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n' +
  '\n' +
  '\nFor more information about Grunt plugin best practices,' +
  '\nplease see the docs at http://gruntjs.com/creating-plugins' +
  '\n' +
  '\nYou should now install project dependencies with _npm install_.' +
  '\nAfter that, you may execute project tasks with _grunt_. For' +
  '\nmore information about installing and configuring Grunt, please see' +
  '\nthe Getting Started guide:' +
  '\n' +
  '\nhttp://gruntjs.com/getting-started\n';

  console.log(welcome);

  var nameToMessage = function(name) {
    return name.split('_').map(
      function(x) { return self._.capitalize(x); }
    ).join(' ') + ':';
  };

  var queue = async.queue(function(rawPrompt, next) {
    prompts.default(rawPrompt, self.props, function(prompt) {
      if (!prompt.message) {
        prompt.message = nameToMessage(prompt.name);
      }
      prompt.message = String(prompt.message).grey;

      function validate(valid, value) {
        if (!valid) {
          // Print warning and requeue the current prompt
          var warning = (prompt.warning) ? prompt.warning : 'Invalid input for ' + prompt.name;
          console.log('error'.red + ': ' + warning);
          queue.unshift(rawPrompt);
          return next();
        }

        switch (prompt.name) {
          case 'name':
            self.props.slugname = self.slugname = self._.slugify(value);
            break;
          case 'author_name':
            self.authorName = value;
            break;
        }

        // Looks good, set the property
        self.props[prompt.name] = value;
        next();
      }

      // Prompt user for input and validate
      self.prompt(prompt, function(err, props) {
        if (err) { return self.emit('error', err); }
        prompts.validate(prompt, props[prompt.name], self.props, validate);
      });
    });
  }, 1);

  // Call this when the queue is done
  queue.drain = function() {
    // Set a few grunt-plugin-specific properties.
    self.props.short_name = self.props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
    self.props.main = 'Gruntfile.js';
    self.props.npm_test = 'grunt nodeunit -v';
    self.props.keywords = ['gruntplugin'];
    self.props.devDependencies = {
      'grunt': self.props.grunt_version,
      'grunt-contrib-jshint': '~0.5.1',
      'grunt-contrib-clean': '~0.4.1',
      'grunt-contrib-nodeunit': '~0.1.2'
    };
    self.props.peerDependencies = {
      'grunt': self.props.grunt_version
    };
    done();
  };

  // Prompt for these values
  queue.push(prompts.defaults([
    'name',
    'description',
    'version',
    'repository',
    'homepage',
    'bugs',
    'licenses',
    'author_name',
    'author_email',
    'author_url',
    'grunt_version',
    'node_version',
  ]).map(function(prompt) {
    if (prompt.name === 'name') {
      prompt['default'] = function(value, data, done) {
        // Prepend grunt- to default name.
        done(null, 'grunt-' + value);
      };
      prompt.sanitize = function(value, data, done) {
        // Replace 'grunt-contrib' with 'grunt' and give a warning
        var contribRe = /^grunt-contrib/;
        if (contribRe.test(value)) {
          console.log((
            'Removing "contrib" from your project\'s name. The grunt-contrib\n' +
            'namespace would like to be reserved for tasks maintained by the grunt team.'
          ).red);
          value = value.replace(contribRe, 'grunt');
        }
        done(null, value);
      };
    }

    if (prompt.name === 'description') {
      prompt['default'] = 'The best Grunt plugin ever.';
    }

    return prompt;
  }));
};

GruntpluginGenerator.prototype.tasks = function tasks() {
  this.mkdir('tasks');
  this.template('tasks/name.js', 'tasks/' + this.props.short_name + '.js');
};

GruntpluginGenerator.prototype.test = function test() {
  var self = this;
  this.mkdir('test');
  this.template('test/name_test.js', 'test/' + this.props.short_name + '_test.js');
  [
    'test/expected/custom_options',
    'test/expected/default_options',
    'test/fixtures/123',
    'test/fixtures/testing'
  ].forEach(function(file) {
    self.copy(file, file);
  });
};

GruntpluginGenerator.prototype.licenses = function licenses() {
  var self = this;
  this.props.licenses.forEach(function(license) {
    var licensePath = prompts.availableLicenses(license);
    self.template(licensePath, 'LICENSE-' + license);
  });
};

GruntpluginGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('jshintrc', '.jshintrc');
  this.copy('gitignore', '.gitignore');

  this.template('README.md');
  this.template('Gruntfile.js');
  this.write('package.json', prompts.packageJSON(this.props));
};

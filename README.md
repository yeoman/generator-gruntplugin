# Grunt Plugin Generator [![Build Status](https://secure.travis-ci.org/yeoman/generator-gruntplugin.svg?branch=master)](https://travis-ci.org/yeoman/generator-gruntplugin)

> Create a Grunt plugin with [Yeoman][], including nodeunit unit tests.

This generator is based of
[grunt-init-gruntplugin](https://github.com/gruntjs/grunt-init-gruntplugin), authored by the
magnificient GruntJS team.

Maintained by Addy Osmani and Stephen Sawchuck

[Yeoman]: http://yeoman.io/


## Installation

Install this generator by running: `npm install -g generator-gruntplugin`.


## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
yo gruntplugin
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._

## Transcript

```shell
$ yo gruntplugin

     _-----_
    |       |
    |--(o)--|   .--------------------------.
   `---------´  |    Welcome to Yeoman,    |
    ( _´U`_ )   |   ladies and gentlemen!  |
    /___A___\   '__________________________'
     |  ~  |
   __'.___.'__
 ´   `  |° ´ Y `

For more information about Grunt plugin best practices,
please see the docs at http://gruntjs.com/creating-plugins
[?] Plugin Name: grunt-init-gruntplugin-sample
[?] Description: The best Grunt plugin ever.
[?] Version: 0.1.0
[?] Project git repository: git://github.com/gruntjs/grunt-init-gruntplugin-sample.git
[?] Project homepage: https://github.com/gruntjs/grunt-init-gruntplugin-sample
[?] License: MIT
[?] Author name: "Cowboy" Ben Alman
[?] Author email:
[?] Author url: http://benalman.com/
[?] What versions of node does it run on? >= 0.8.0
[?] What version of grunt does it need? ~0.4.0rc2
   create tasks/init_gruntplugin_sample.js
   create test/expected/custom_options
   create test/expected/default_options
   create test/fixtures/123
   create test/fixtures/testing
   create test/init_gruntplugin_sample_test.js
   create .jshintrc
   create .gitignore
   create README.md
   create Gruntfile.js
   create package.json


I'm all done. Running npm install for you to install the required dependencies. If this fails, try running the command yourself.

....

$ ls
Gruntfile.js    node_modules    tasks           
README.md       package.json    test


$ grunt
Running "jshint:all" (jshint) task
>> 3 files lint free.

Running "clean:tests" (clean) task

Running "init_gruntplugin_sample:default_options" (init_gruntplugin_sample) task
File "tmp/default_options" created.

Running "init_gruntplugin_sample:custom_options" (init_gruntplugin_sample) task
File "tmp/custom_options" created.

Running "nodeunit:tests" (nodeunit) task
Testing init_gruntplugin_sample_test.js..OK
>> 2 assertions passed (9ms)

Done, without errors.
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

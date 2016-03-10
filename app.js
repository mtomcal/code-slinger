#!/usr/bin/env node
var Rx = require('rxjs');
var lib = require('./lib');

// Use yargs to build as a CLI interface with documentation
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('bootstrap', 'Generate files for running a React project')
    .demand(1)
    .command('react-server', 'Run the hot reloading development server for your project on localhost:8000')
    .demand(1)
    .command('build', 'Bundle and export your React app to dist/bundle.js')
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .epilog('MIT License. Lead Maintainer: Michael A Tomcal @matomcal 2016')
    .argv;

// Create a stream from argv._ commands array
var argStream = Rx.Observable.fromArray(argv._);

var serverStream = argStream
    // Filter out commands with react-server
    .filter(function (arg) {
        return arg === 'react-server';
    })
    .take(1);

lib.reactServer(serverStream);

var buildStream = argStream
    // Filter out commands with react-server
    .filter(function (arg) {
        return arg === 'build';
    })
    .take(1);

lib.build(buildStream);

var bootstrapStream = argStream
    // Filter out commands with bootstrap
    .filter(function (arg) {
        return arg === 'bootstrap';
    })
    .take(1);

lib.bootstrap(bootstrapStream);

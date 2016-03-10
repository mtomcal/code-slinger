#!/usr/bin/env node
var Rx = require('rxjs');
var lib = require('./lib');

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('react-server')
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .epilog('MIT License. Lead Maintainer: Michael A Tomcal @matomcal 2016')
    .argv;

var argStream = Rx.Observable.fromArray(argv._);

var serverStream = argStream
    .filter(function (arg) {
        return arg === 'react-server';
    })
    .take(1);

lib.reactServer(serverStream);

var bootstrapStream = argStream
    .filter(function (arg) {
        return arg === 'bootstrap';
    })
    .take(1);

lib.bootstrap(bootstrapStream);

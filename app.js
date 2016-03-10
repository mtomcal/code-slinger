#!/usr/bin/env node
var Rx = require('rxjs');
var fs = require('fs-extra');
var devServer = require('./devServer');
var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('react-server')
    .demand(1)
    .help('h')
    .alias('h', 'help')
    .epilog('MIT License. Lead Maintainer: Michael A Tomcal @matomcal 2016')
    .argv;

var argStream = Rx.Observable.fromArray(argv._);

argStream
    .filter(function (arg) {
        return arg === 'react-server';
    })
    .take(1)
    .subscribe(function (arg) {
        console.log('Starting react-server...');
        console.log('Using directory: ' + process.cwd());
        devServer();
    });


function copyStream(source, target) {
    return Rx.Observable.create(function (observable) {
        fs.copy(source, target, function (err) {
            if (err) {
                return observable.error(err);
            }
            observable.next();
            observable.complete();
        })
    });
}

function createDir(target) {
    return Rx.Observable.create(function (observable) {
        fs.mkdir(target, function (err) {
            if (err) {
                return observable.error(err);
            }
            observable.next();
            observable.complete();
        })
    });
}

var fileManifest = [
    '.eslintrc',
    '.babelrc',
    '.gitignore',
    'index.html'
];

var demoFiles = [
    'App.js',
    'colors.js',
    'index.js'
];

var createDirs = [
    'src',
    'dist'
];

var bootstrapStream = argStream
    .filter(function (arg) {
        return arg === 'bootstrap';
    })

bootstrapStream
    .flatMap(function () {
        return createDirs;
    })
    .do(console.log.bind(console, 'Creating '))
    .flatMap(function (dir) {
        return createDir(process.cwd() + '/' + dir)
            .catch(function (err) {
                console.warn(dir + ' already exists.');
                return Rx.Observable.of(true);
            });
    })
    .reduce(function (acc, x) {
        return x;
    })
    .flatMap(function () {
        return fileManifest;
    })
    .do(console.log.bind(console, 'Creating '))
    .flatMap(function (file) {
        return copyStream(__dirname + '/bootstrap/' + file, process.cwd() + '/' + file)
    })
    .reduce(function (acc, x) {
        return x;
    })
    .flatMap(function () {
        return demoFiles;
    })
    .do(console.log.bind(console, 'Creating '))
    .flatMap(function (file) {
        return copyStream(__dirname + '/demo/' + file, process.cwd() + '/src/' + file)
    })
    .reduce(function (acc, x) {
        return x;
    })
    .subscribe(null, function (err) { console.error(err.stack)})

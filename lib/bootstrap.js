var Rx = require('rxjs');
var fs = require('fs-extra');
var path = require('path');

// TODO Move this to a config file eventually

// List of files in the project root for bootstrap generator
var fileManifest = [
    '.eslintrc',
    '.babelrc',
    '.gitignore',
    'index.html'
];

// src/ Files
var srcManifest = [
    'App.js',
    'colors.js',
    'index.js'
];

// Directories to be created
var createDirs = [
    'src',
    'dist'
];

// This Package's root folder
var PACKAGE_ROOT = path.join(__dirname, '../');

// FILESYSTEM METHODS

// Check if a file exists. If it does throw an observable error.
// Returns an observable
function existsStream(source) {
    return Rx.Observable.create(function (observable) {
        fs.access(source, fs.F_OK, function (err) {
            if (!err) {
                return observable.error('Already Exists');
            }
            observable.next();
            observable.complete();
        })
    });
}

// Copy file stream function.
// Returns an Observable.
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

// Combine existsStream and copyStream to make a check if file exists
// copy the file if it doesn't exist.
// returns an observable
function checkCopyStream(source, target) {
    return Rx.Observable.of(true)
        .flatMap(function () {
            return existsStream(target);
        })
        .flatMap(function () {
            return copyStream(source, target);
        })
}

// Create a directory at the target path.
// Returns an observable
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

// EXECUTION CHAIN

// Takes a bootstrapStream. It doesn't contain any values.
// Returns void.
module.exports = function (bootstrapStream) {
    return bootstrapStream
        // Bootstrap the directories
        .flatMap(function () {
            return createDirs;
        })
        // Logger
        .do(console.log.bind(console, 'Creating '))
        // Run the async createDir stream with logging
        .flatMap(function (dir) {
            return createDir(path.join(process.cwd(), dir))
                // Catch an error if exists, log and pass a fresh observable
                .catch(function (err) {
                    console.warn(dir + ' already exists.');
                    return Rx.Observable.of(dir);
                });
        })
        // Reduce the resolved async jobs
        // to a single observable
        .reduce(function (acc, x) {
            return x;
        })
        // Flatten and map files for root project files
        .flatMap(function () {
            return fileManifest;
        })
        // Logger
        .do(console.log.bind(console, 'Creating '))
        .flatMap(function (file) {
            // Create paths
            var _sourcePath = path.join(PACKAGE_ROOT, '/bootstrap/', file);
            var _targetPath = path.join(process.cwd(), file);

            // Copy root project files asynchronously
            return checkCopyStream(_sourcePath, _targetPath)
                // Catch an error if exists, log and pass a fresh observable
                .catch(function (err) {
                    console.warn(file + ' already exists.');
                    return Rx.Observable.of(file);
                })
        })
        // Reduce the resolved async jobs
        // to a single observable
        .reduce(function (acc, x) {
            return x;
        })
        // Flatten and map on src/ files
        .flatMap(function () {
            return srcManifest;
        })
        // Logger
        .do(console.log.bind(console, 'Creating '))
        .flatMap(function (file) {
            var _sourcePath = path.join(PACKAGE_ROOT, '/bootstrap/src/', file);
            var _targetPath = path.join(process.cwd(), '/src/', file);
            // Copy src/ files asynchronously
            return checkCopyStream(_sourcePath, _targetPath)
                .catch(function (err) {
                    // Catch an error if exists, log and pass a fresh observable
                    console.warn(file + ' already exists.');
                    return Rx.Observable.of(file);
                })
        })
        // Reduce the resolved async jobs
        // to a single observable
        .reduce(function (acc, x) {
            return x;
        })
        .subscribe(null, function (err) { console.error(err.stack)});
};

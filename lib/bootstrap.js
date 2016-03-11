var Rx = require('rxjs');
var fs = require('fs-extra');
var path = require('path');
var fileutil = require('./fileutil');

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

var PACKAGE_ROOT = fileutil.PACKAGE_ROOT;

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
      return fileutil.createDir(path.join(process.cwd(), dir))
        // Catch an error if exists, log and pass a fresh observable
        .catch(function (err) {
          console.warn(dir + ' already exists.');
          return Rx.Observable.of(dir);
        });
    })
    .take(1)
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
      return fileutil.checkCopyStream(_sourcePath, _targetPath)
        // Catch an error if exists, log and pass a fresh observable
        .catch(function (err) {
          console.warn(file + ' already exists.');
          return Rx.Observable.of(file);
        })
    })
    .take(1)
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
      return fileutil.checkCopyStream(_sourcePath, _targetPath)
        .catch(function (err) {
            // Catch an error if exists, log and pass a fresh observable
          console.warn(file + ' already exists.');
          return Rx.Observable.of(file);
        })
    })
    .take(1)
    .subscribe(null, function (err) { console.error(err.stack)});
};

var Rx = require('rxjs');
var fs = require('fs-extra');
var path = require('path');

// FILESYSTEM METHODS

// This Package's root folder
var PACKAGE_ROOT = path.join(__dirname, '../');

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

module.exports = {
  createDir: createDir,
  checkCopyStream: checkCopyStream,
  copyStream: copyStream,
  existsStream: existsStream,
  PACKAGE_ROOT: PACKAGE_ROOT
};

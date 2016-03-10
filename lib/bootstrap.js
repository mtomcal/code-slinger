var Rx = require('rxjs');
var fs = require('fs-extra');
var path = require('path');

var fileManifest = [
    '.eslintrc',
    '.babelrc',
    '.gitignore',
    'index.html'
];

var srcManifest = [
    'App.js',
    'colors.js',
    'index.js'
];

var createDirs = [
    'src',
    'dist'
];

var PACKAGE_ROOT = path.join(__dirname, '../');

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

function checkCopyStream(source, target) {
    return Rx.Observable.of(true)
        .flatMap(function () {
            return existsStream(target);
        })
        .flatMap(function () {
            return copyStream(source, target);
        })
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

module.exports = function (bootstrapStream) {
    return bootstrapStream
        .flatMap(function () {
            return createDirs;
        })
        .do(console.log.bind(console, 'Creating '))
        .flatMap(function (dir) {
            return createDir(path.join(process.cwd(), dir))
                .catch(function (err) {
                    console.warn(dir + ' already exists.');
                    return Rx.Observable.of(dir);
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
            var _sourcePath = path.join(PACKAGE_ROOT, '/bootstrap/', file);
            var _targetPath = path.join(process.cwd(), file);
            return checkCopyStream(_sourcePath, _targetPath)
                .catch(function (err) {
                    console.warn(file + ' already exists.');
                    return Rx.Observable.of(file);
                })
        })
        .reduce(function (acc, x) {
            return x;
        })
        .flatMap(function () {
            return srcManifest;
        })
        .do(console.log.bind(console, 'Creating '))
        .flatMap(function (file) {
            var _sourcePath = path.join(PACKAGE_ROOT, '/bootstrap/src/', file);
            var _targetPath = path.join(process.cwd(), '/src/', file);
            return checkCopyStream(_sourcePath, _targetPath)
                .catch(function (err) {
                    console.warn(file + ' already exists.');
                    return Rx.Observable.of(file);
                })
        })
        .reduce(function (acc, x) {
            return x;
        })
        .subscribe(null, function (err) { console.error(err.stack)});
};

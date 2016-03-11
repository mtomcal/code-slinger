var Rx = require('rxjs');
var path = require('path');
var fileutil = require('./fileutil');

var BOOTSTRAP_WEBPACK_FILE = 'config.webpack.js';

module.exports = function (genWebpackStream) {
  return genWebpackStream
  .mapTo(BOOTSTRAP_WEBPACK_FILE)
  .do(console.log.bind(console, 'Creating'))
  .flatMap(function (file) {
    var _source = path.join(fileutil.PACKAGE_ROOT, '/bootstrap/', file);
    var _target = path.join(process.cwd(), file);
    return fileutil.checkCopyStream(_source, _target)
      // Catch an error if exists, log and pass a fresh observable
      .catch(function (err) {
        console.warn(file + ' already exists.');
        return Rx.Observable.of(file);
      });
  })
  .reduce(function (acc, x) {
    return x;
  })
  .subscribe(null, function (err) { console.log(err.stack); })

}

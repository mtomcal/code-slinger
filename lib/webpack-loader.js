var Rx = require('rxjs');
var path = require('path');
var express = require('express');
var fileutil = require('./fileutil');
var defaultConfig = require('../webpack/webpack.config.dev');

module.exports = function () {
  var _source = path.join(process.cwd(), fileutil.BOOTSTRAP_WEBPACK_FILE);
  return fileutil.existsStream(_source)
    // If user supplied webpack config not exist then
    // use defaultConfig
    .catch(function (err) {
      console.log('Using supplied ' + fileutil.BOOTSTRAP_WEBPACK_FILE);
      return Rx.Observable.of(require(_source));
    })
    // If file exists then require the user supplied webpack file
    .map(function (config) {
      if (typeof config === 'object') {
        return config;
      }
      console.log('Using default webpack config');
      return defaultConfig;
    })
}

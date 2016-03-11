var Rx = require('rxjs');
var path = require('path');
var express = require('express');
var webpack = require('webpack');
var fileutil = require('./fileutil');
var defaultConfig = require('../webpack/webpack.config.dev');

// Create the hot reloading webpack dev server
// Based on https://github.com/gaearon/react-transform-boilerplate
function _server(config) {
  console.log('Starting react-server...');
  console.log('Using directory: ' + process.cwd());
  var app = express();
  console.log('Running webpack...');
  var compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.use('/public', express.static('public'));

  app.get('*', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'index.html'));
  });

  console.log('Starting server...');
  app.listen(8000, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Listening at http://localhost:8000');
  });
}

// Run the server
module.exports = function (serverStream) {
  serverStream
    .take(1)
    .flatMap(function () {
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

    })
    .map(_server)
    .subscribe(null, function (err) { console.error(err.stack)});
}

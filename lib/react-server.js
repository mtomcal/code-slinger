var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../webpack/webpack.config.dev');

// Create the hot reloading webpack dev server
// Based on https://github.com/gaearon/react-transform-boilerplate
function _server() {
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
        .map(_server)
        .subscribe(null, function (err) { console.error(err.stack)});
}

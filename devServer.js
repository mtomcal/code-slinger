var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config.dev');

module.exports = function () {
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

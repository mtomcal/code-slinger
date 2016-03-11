var path = require('path');
var webpack = require('webpack');
var config = require('../webpack/webpack.config.prod');

// Run the production build step
// Based on https://github.com/gaearon/react-transform-boilerplate
function _compile() {
  console.log('Building for production...');
  console.log('Using directory: ' + process.cwd());
  console.log('Running webpack...');
  var compiler = webpack(config);
  compiler.run(function(err, stats) {
    if (err) {
      console.error(err);
    }
    console.log('Built', stats.hash, 'in', stats.endTime - stats.startTime + 'ms');
  });
}

// Run the compile job
module.exports = function (buildStream) {
  buildStream
        .take(1)
        .map(_compile)
        .subscribe(null, function (err) { console.error(err.stack)});
}

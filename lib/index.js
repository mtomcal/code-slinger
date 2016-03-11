// Let's make requiring all our files in lib/ folder easy
var bootstrap = require('./bootstrap');
var reactServer = require('./react-server');
var genWebpack = require('./gen-webpack');
var build = require('./build');

module.exports = {
  bootstrap: bootstrap,
  reactServer: reactServer,
  genWebpack: genWebpack,
  build: build
};

// Now I can do var lib = require('./lib')

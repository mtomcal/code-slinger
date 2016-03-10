// Let's make requiring all our files in lib/ folder easy
var bootstrap = require('./bootstrap');
var reactServer = require('./react-server');

module.exports = {
    bootstrap: bootstrap,
    reactServer: reactServer
};

// Now I can do var lib = require('./lib')

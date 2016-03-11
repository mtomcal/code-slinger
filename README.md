#code-slinger

Get your React project up and running in 10 seconds with Webpack hot reloading. Boilerplate code is based on Dan Abramov's [React Transform Boilerplate](https://github.com/gaearon/react-transform-boilerplate).

## Basic Usage

10 second method:

```bash
npm install -g code-slinger
code-slinger bootstrap
code-slinger react-server
```

Visit localhost:8000.

You get this file structure:

```
├── .babelrc
├── .eslintrc
├── .gitignore
├── dist
├── index.html
├── node_modules
├── package.json
└── src
    ├── App.js
    ├── colors.js
    └── index.js
```

Thats it!

Need a production build?

```bash
# Bundle is dropped in dist/
code-slinger build
```

## Deeper usage

```bash
# Install code-slinger and save it
npm install --save code-slinger

# Bootstrap the files
./node_modules/.bin/code-slinger bootstrap
```
Add this to package.json

```javascript
// ...
"scripts": {
  "start": "code-slinger react-server",
  "build": "code-slinger build"
},
// ...
```

Run this:

```javascript
npm start
```

Visit localhost:8000.


Want to run a production bundle build?

```bash
# Bundle is dropped in dist/
npm run build
```

Want your own config.webpack.js file to be used?

```bash
# Optional: generate a config.webpack.js
./node_modules/.bin/code-slinger gen-webpack
# Either way make sure you have a config named
# config.webpack.js in Project Root
```

*Note: For any arbitrary Webpack config to work with code-slinger: Please replace `__dirname` with `process.cwd()` in the config file*

## CLI Help

```
Usage: code-slinger <command> [options]

Commands:
  bootstrap     Generate files for running a React project
  react-server  Run the hot reloading development server for your project on
                localhost:8000
  build         Bundle and export your React app to dist/bundle.js
  gen-webpack   Generates a custom webpack file to be modified for custom
                Webpack builds.

Options:
  -h, --help  Show help                                                [boolean]

MIT License. Lead Maintainer: Michael A Tomcal @matomcal 2016
```

## Libraries Used

Primary libraries used:

* RxJS 5
* Webpack
* Babel 6

...see package.json for more supporting libraries

## Changelog

*v1.1.2*
* User supplied config.webpack.js works with `code-slinger build` now.

*v1.1.1*
* Bug fix for cannot find module when looking for config.webpack.js

*v1.1.0*
* Added convention for a user supplying their own config.webpack.js
* Added code-slinger gen-webpack command to generate a webpack file

## Contributing

We welcome contributions, pull requests, ideas, bugs and documentation contributions.

If you wish to contribute, please make sure you are familiar with RxJS. Here is a [great tutorial](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). We are also using [RxJS 5 beta](https://github.com/ReactiveX/RxJS).

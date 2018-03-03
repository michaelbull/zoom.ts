<p align="center">
  <a href="#readme"><img src="https://raw.githubusercontent.com/michaelbull/zoom.ts/master/img/logo.png" alt="zoom.ts" width="478" height="178" /></a>
</p>
<p align="center">
  A lightweight TypeScript library for image zooming, as seen on <a href="https://medium.design/image-zoom-on-medium-24d146fc0c20">Medium</a>.
</p>
<p align="center">
  <a href="https://michaelbull.github.io/zoom.ts" rel="nofollow">Demo</a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/zoom.ts"><img src="https://img.shields.io/npm/v/zoom.ts.svg?style=flat-square" alt="npm version" /></a>
  <a href="https://github.com/michaelbull/zoom.ts/blob/master/LICENSE"><img src="https://img.shields.io/github/license/michaelbull/zoom.ts.svg?style=flat-square" alt="software license" /></a>
  <a href="https://travis-ci.org/michaelbull/zoom.ts"><img src="https://img.shields.io/travis/michaelbull/zoom.ts.svg?style=flat-square" alt="build status" /></a>
  <a href="https://coveralls.io/github/michaelbull/zoom.ts?branch=master"><img src="https://img.shields.io/coveralls/michaelbull/zoom.ts.svg?style=flat-square" alt="coverage status"></img></a>
  <br />
  <a href="https://www.npmjs.com/package/zoom.ts"><img src="https://img.shields.io/npm/dt/zoom.ts.svg?style=flat-square" alt="npm downloads" /></a>
  <a href="https://david-dm.org/michaelbull/zoom.ts"><img src="https://david-dm.org/michaelbull/zoom.ts/status.svg?style=flat-square" "dependencies status" /></a>
  <a href="https://david-dm.org/michaelbull/zoom.ts?type=dev"><img src="https://david-dm.org/michaelbull/zoom.ts/dev-status.svg?style=flat-square" "devDependencies Status" /></a>
</p>
<br />
<p align="center">
  <a href="https://michaelbull.github.io/zoom.ts"><img src="https://github.com/michaelbull/zoom.ts/raw/master/img/example.gif" alt="example" width="888" height="595" /></a>
</p>
<br />
<br />

## Installation

Install the package via [npm][npm]:

```
npm install --save zoom.ts
```

## Usage

Below is a simplified usage example:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="dist/zoom.css">
    <script type="text/javascript" src="dist/zoom.js"></script>
    <script>window.zoom.listen();</script>
  </head>

  <body>
    <figure class="zoom" data-width="3500" data-height="2333" data-src="assets/forest-full.jpg">
      <img class="zoom__image" src="assets/forest.jpg">
    </figure>
  </body>
</html>
```


## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

## License

This project is available under the terms of the ISC license. See the
[`LICENSE`][license] file for the copyright information and licensing terms.

[npm]: https://www.npmjs.com/
[github]: https://github.com/michaelbull/zoom.ts

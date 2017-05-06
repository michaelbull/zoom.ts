<p align="center">
  <a href="#readme"><img src="https://raw.githubusercontent.com/michaelbull/zoom.ts/master/img/logo.png" alt="zoom.ts" width="478" height="178" /></a>
</p>
<p align="center">
  A lightweight TypeScript library for image zooming, as seen on <a href="https://medium.design/image-zoom-on-medium-24d146fc0c20">Medium</a>.
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

## Introduction

A running demonstration can be found [here][demo].

`zoom.ts` easily plugs into your application and starts listening to zoom events
as soon as the DOM is ready. The library accounts for just 5kB of bandwidth once
gzipped and requires no third-party libraries.

Holding either the <kbd>⌘</kbd> or <kbd>Ctrl</kbd> key will open the image in a
new tab when clicked. Zoomed images can be dismissed either by clicking the
image, scrolling away, or pressing <kbd>Esc</kbd>.

## Installation

Install the package via [npm][npm]:

```
npm install --save zoom.ts
```

Then you can either link the [JavaScript distribution][dist] file to have
`zoom.ts` listen on your webpage, or you can configure and include the library
itself your existing application.

To include and configure the library yourself, you will need to first `@import`
the [stylesheet][stylesheet]. Remember to define any overrides **before**
importing the stylesheet, for example:

```sass
$zoom-overlay-background-color: blue; // change overlay background to blue
$zoom-transition-duration: 1000; // slow down the transitions

@import '~zoom.ts/style';
```

Next you will need to import the library itself. In the example below, when
the document is `ready` the library will `start` by adding an event listener
that responds to click events on images marked as zoomable.

```typescript
import { ready } from 'zoom.ts/lib/Document';
import { addZoomListener } from 'zoom.ts/lib/Zoom';

ready(document, () => {
    addZoomListener(window);
    console.log('zoom.ts started');
});
```

## Usage

1. Add the class `zoom__element` to your `<img>`.
2. Wrap your `<img>` in a block-level element with a class of `zoom` (e.g.
`<figure class="zoom">`)
3. A width and height can be configured to specify the dimensions that the
expanded image should size to by add the `data-width` and `data-height`
attributes to the wrapper element.
4. The loading of a big image can be deferred by adding the `data-src` attribute
to the wrapper element (e.g. `<figure class="zoom" data-src="img/big-image.jpg">`).

```html
<!DOCTYPE html>
<html>
  <body>
    <figure class="zoom" data-width="3500" data-height="2333" data-src="img/forest-full.jpg">
      <img class="zoom__element" src="img/forest.jpg">
    </figure>

    <script type="text/javascript" src="dist/zoom.js"></script>
  </body>
</html>
```

## Building

The following scripts are configured to run via [npm][npm]:

- `npm start`
  - Runs the [webpack-dev-server][dev-server] at
    [`http://localhost:8080`][localhost]
- `npm run build`
  - Builds the distribution and places it under the `./dist` directory.
- `npm run dist`
  - Builds, minifies, and optimizes the distribution and places it under the
    `./dist` directory.
- `npm run clean`
  - Cleans the `./dist` directory.

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

## License

This project is available under the terms of the ISC license. See the
[`LICENSE`][license] file for the copyright information and licensing terms.

[logo]: /img/logo.png
[medium]: https://medium.design/image-zoom-on-medium-24d146fc0c20
[build-status-badge]: https://img.shields.io/travis/michaelbull/zoom.ts.svg?style=flat-square
[build-status]: https://travis-ci.org/michaelbull/zoom.ts
[license-badge]: https://img.shields.io/github/license/michaelbull/zoom.ts.svg?style=flat-square
[license]: https://github.com/michaelbull/zoom.ts/blob/master/LICENSE
[npm-badge]: https://img.shields.io/npm/v/zoom.ts.svg?style=flat-square
[npm]: https://www.npmjs.com/package/zoom.ts
[downloads-badge]: https://img.shields.io/npm/dt/zoom.ts.svg?style=flat-square
[downloads]: https://www.npmjs.com/package/zoom.ts
[devDependencies-badge]: https://david-dm.org/michaelbull/zoom.ts/dev-status.svg?style=flat-square
[devDependencies]: https://david-dm.org/michaelbull/zoom.ts?type=dev
[demo]: https://michaelbull.github.io/zoom.ts
[npm]: https://www.npmjs.com/
[dist]: https://github.com/michaelbull/zoom.ts/blob/master/dist/zoom.js
[stylesheet]: https://github.com/michaelbull/zoom.ts/blob/master/style.scss
[localhost]: http://localhost:8080
[dev-server]: https://github.com/webpack/webpack-dev-server
[github]: https://github.com/michaelbull/zoom.ts

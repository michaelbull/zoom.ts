# ![zoom.ts][logo]

A lightweight TypeScript library for image zooming, as seen on [Medium][medium].

A running demonstration can be found [here][demo].

[![license][license-badge]][license]
[![npm version][npm-badge]][npm]
[![npm downloads][downloads-badge]][downloads]
[![dependencies status][dependencies-badge]][dependencies]
[![devDependencies status][devDependencies-badge]][devDependencies]

`zoom.ts` easily plugs into your application and starts listening to zoom events
as soon as the DOM is ready. The library accounts for just 4kB of bandwidth once
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
import { start } from 'zoom.ts/lib/Zoom';

ready(() => {
    start();
    console.log('zoom.ts started');
});
```

## Usage

1. Add the class `zoom__element` to your `<img>`.
2. Wrap your `<img>` in a `div` with a class of `zoom` (i.e.
`<div class="zoom">`)
3. A width and height can be configured to specify the dimensions that the
expanded image should size to by add the `data-width` and `data-height`
attributes to the wrapper `div`.
4. The loading of a big image can be deferred by adding the `data-src` attribute
to the wrapper `div`.

```html
<!DOCTYPE html>
<html>
  <body>
    <div class="zoom" data-width="3500" data-height="2333" data-src="img/forest-full.jpg">
      <img class="zoom__element" src="img/forest.jpg">
    </div>

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
[license-badge]: https://img.shields.io/github/license/michaelbull/zoom.ts.svg?style=flat-square
[license]: https://github.com/michaelbull/zoom.ts/blob/master/LICENSE
[npm-badge]: https://img.shields.io/npm/v/zoom.ts.svg?style=flat-square
[npm]: https://www.npmjs.com/package/zoom.ts
[downloads-badge]: https://img.shields.io/npm/dt/zoom.ts.svg?style=flat-square
[downloads]: https://www.npmjs.com/package/zoom.ts
[dependencies-badge]: https://david-dm.org/michaelbull/zoom.ts.svg?style=flat-square
[dependencies]: https://david-dm.org/michaelbull/zoom.ts
[devDependencies-badge]: https://david-dm.org/michaelbull/zoom.ts/dev-status.svg?style=flat-square
[devDependencies]: https://david-dm.org/michaelbull/zoom.ts?type=dev
[demo]: https://michaelbull.github.io/zoom.ts
[npm]: https://www.npmjs.com/
[dist]: https://github.com/michaelbull/zoom.ts/blob/master/dist/zoom.js
[stylesheet]: https://github.com/michaelbull/zoom.ts/blob/master/style.scss
[localhost]: http://localhost:8080
[dev-server]: https://github.com/webpack/webpack-dev-server
[github]: https://github.com/michaelbull/zoom.ts

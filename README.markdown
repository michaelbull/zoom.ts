# ![zoom.ts][logo]

A lightweight TypeScript library for image and video zooming, as seen on
[Medium][medium].

[![npm version][npm-image]][npm-url]
[![npm downloads][downloads-image]][downloads-url]
[![dependencies status][dependencies-image]][dependencies-url]
[![devDependencies status][devDependencies-image]][devDependencies-url]
[![peerDependencies status][peerDependencies-image]][peerDependencies-url]

`zoom.ts` easily plugs into your application with minimal overhead by including
no third-party dependencies and requiring under 13kB of bandwidth when
optimized. Once marked as zoomable, clicking an image or video will smoothly
expand it to fit the browser's entire viewport. The zoomed element will then
await dismissal from the user, either by clicking or scrolling away.

## Demo

A running demonstration can be found [here][demo].

Holding either the <kbd>⌘</kbd> or <kbd>Ctrl</kbd> key whilst clicking the
element will open the image in a new tab.

Zoomed elements can be dismissed either by clicking the element, scrolling away,
or pressing <kbd>Esc</kbd>.

## Installation

The [TypeScript library][listener.ts] can be imported and instantiated:

```typescript
import { Listener } from 'zoom.ts/lib/Listener';

new Listener().listen();
```

Or the [JavaScript distribution][dist.js] can be linked, which will register
`zoom` as a global that can be accessed by the browser:

```html
<script type="text/javascript" src="dist/zoom.js"></script>
<script type="text/javascript">
  new zoom.Listener().listen();
</script>
```

## Usage

Add the `data-zoom="zoom-in"` attribute to an `<img>` or `<video>` to have it
zoom in when clicked.

The loading of a large resource can be deferred by specifying a `data-zoom-src`
attribute, where the value assigned contains the resource to load once the user
expands the element. The resource specified in the attribute is also the
resource that will be loaded if the user opens the image by clicking with either
<kbd>⌘</kbd> or <kbd>Ctrl</kbd> held.

## Example

In the example snippet below an image of a forest will be displayed. Once the
user clicks to zoom in the image their browser will request the larger
`forest-full.jpg` file and replace the original `<img>` with the full-resolution
version.

```html
<!DOCTYPE html>
<html>
  <body>
    <img src="forest.jpg" data-zoom="zoom-in" data-zoom-src="forest-full.jpg">

    <script type="text/javascript" src="dist/zoom.js"></script>
    <script type="text/javascript">
      new zoom.Listener().listen();
    </script>
  </body>
</html>
```

## Documentation

Documentation is generated in the `./dist/docs` directory by [TypeDoc][typedoc]
and can be viewed online [here][docs].

## Building

[Webpack][webpack] is used to build the distribution.

The following commands can be ran in the project:

- `npm run clean`
  - Removes the output files under the `./dist` directory.
- `npm run dev`
  - Runs the [webpack-dev-server][dev-server] at
[`http://localhost:8080/`](http://localhost:8080/).
- `npm run build`
  - Builds the library with documentation under the `./dist` directory.
- `npm run dist`
  - Builds, minifies, and optimizes the library with documentation under the
`./dist` directory.

## Credits

- [Michael Bull](https://michael-bull.com) ([@MikeBull94](https://github.com/MikeBull94))
- [Jacob Thornton](https://twitter.com/fat) ([@fat](https://github.com/fat)) - Author of [zoom.js](https://github.com/fat/zoom.js)
- [Sahil Bajaj](http://sahil.me) ([@spinningarrow](https://github.com/spinningarrow)) \& [Andrea Cognini](http://heavybeard.it) ([@heavybeard](https://github.com/heavybeard)) - Authors of [zoom-vanilla.js](https://github.com/heavybeard/zoom-vanilla.js)

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

## License
This project is available under the terms of the MIT license. See the
[`LICENSE`][license] file for the copyright information and licensing terms.

[logo]: /img/logo.png
[medium]: https://medium.design/image-zoom-on-medium-24d146fc0c20
[npm-image]: https://img.shields.io/npm/v/zoom.ts.svg
[npm-url]: https://www.npmjs.com/package/zoom.ts
[downloads-image]: https://img.shields.io/npm/dt/zoom.ts.svg
[downloads-url]: https://www.npmjs.com/package/zoom.ts
[dependencies-image]: https://david-dm.org/MikeBull94/zoom.ts.svg
[dependencies-url]: https://david-dm.org/MikeBull94/zoom.ts
[devDependencies-image]: https://david-dm.org/MikeBull94/zoom.ts/dev-status.svg
[devDependencies-url]: https://david-dm.org/MikeBull94/zoom.ts?type=dev
[peerDependencies-image]: https://david-dm.org/MikeBull94/zoom.ts/peer-status.svg
[peerDependencies-url]: https://david-dm.org/MikeBull94/zoom.ts?type=peer
[demo]: https://mikebull94.github.io/zoom.ts
[listener.ts]: https://github.com/MikeBull94/zoom.ts/blob/master/lib/Listener.ts
[dist.js]: https://github.com/MikeBull94/zoom.ts/blob/master/dist/zoom.js
[typedoc]: https://github.com/TypeStrong/typedoc
[docs]: https://mikebull94.github.io/zoom.ts/dist/docs
[dev-server]: https://github.com/webpack/webpack-dev-server
[webpack]: https://webpack.github.io/
[github]: https://github.com/MikeBull94/zoom.ts
[license]: https://github.com/MikeBull94/zoom.ts/blob/master/LICENSE

# zoom.ts

A lightweight TypeScript library for image and video zooming, as seen on
[Medium][medium].

[![npm version][npm-image]][npm-url]
[![dependencies status][dependencies-image]][dependencies-url]
[![devDependencies status][devDependencies-image]][devDependencies-url]
[![peerDependencies status][peerDependencies-image]][peerDependencies-url]

`zoom.ts` easily plugs into your application with minimal overhead by including
no third-party dependencies and requiring just 8kB of bandwidth when
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

### Library

The [TypeScript library][zoom.ts] can be imported and instantiated:

```javascript
import { Zoom } from 'zoom.ts/lib/Zoom';

new Zoom().listen();
```

Or the [JavaScript distribution][dist.js] can be linked, which will register
`zoom` as a global that can be accessed by the browser:

```html
<script type="text/javascript" src="dist/zoom.js"></script>
<script type="text/javascript">
  new window.zoom.Zoom().listen();
</script>
```

A minified version of the JavaScript distribution is available at
[`./dist/zoom.min.js`][min.js].

### Stylesheet

The [SCSS file][zoom.scss] can be imported:

```scss
@import '~zoom.ts/style/zoom';
```

Or the [CSS distribution][dist.css] can be linked:

```html
<link rel="stylesheet" type="text/css" href="dist/zoom.css" />
```

A minified version of the CSS distribution is available at
[`./dist/zoom.min.css`][min.css].

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
  <head>
    <link rel="stylesheet" type="text/css" href="zoom.min.css" />
  </head>

  <body>
    <main>
      <img src="forest.jpg" data-zoom="zoom-in" data-zoom-src="forest-full.jpg">
    </main>

    <script type="text/javascript" src="dist/zoom.min.js"></script>
    <script type="text/javascript">
      new window.zoom.Zoom().listen();
    </script>
  </body>
</html>
```

## Documentation

Documentation is generated in the `./docs` directory by [TypeDoc][typedoc] and
can be viewed online [here][docs].

## Building

[Node.js][node] is used to build the distribution.

The following commands can be ran in the project:

- `npm run build`
  - Lint, compile, minify, and optimize the stylesheets and scripts.
- `npm run watch`
  - Watch the file-system for changes, triggering rebuild of the stylesheets or
scripts if a change to the source of either is detected.
- `npm run clean`
  - Removes the output files under the `./dist` directory.

## Credits

- [Michael Bull](https://michael-bull.com) ([@MikeBull94](https://github.com/MikeBull94))
- [Jacob Thornton](https://twitter.com/fat) ([@fat](https://github.com/fat)) - Author of [zoom.js](https://github.com/fat/zoom.js)
- [Sahil Bajaj](http://sahil.me) ([@spinningarrow](https://github.com/spinningarrow)) \& [Andrea Cognini](http://heavybeard.it) ([@heavybeard](https://github.com/heavybeard)) - Authors of [zoom-vanilla.js](https://github.com/heavybeard/zoom-vanilla.js)

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

## License
This project is available under the terms of the MIT license. See the
[`LICENSE`][license] file for the copyright information and licensing terms.

[medium]: https://medium.design/image-zoom-on-medium-24d146fc0c20
[npm-image]: https://img.shields.io/npm/v/zoom.ts.svg
[npm-url]: https://www.npmjs.com/package/zoom.ts
[dependencies-image]: https://david-dm.org/MikeBull94/zoom.ts.svg
[dependencies-url]: https://david-dm.org/MikeBull94/zoom.ts
[devDependencies-image]: https://david-dm.org/MikeBull94/zoom.ts/dev-status.svg
[devDependencies-url]: https://david-dm.org/MikeBull94/zoom.ts#info=devDependencies
[peerDependencies-image]: https://david-dm.org/MikeBull94/zoom.ts/peer-status.svg
[peerDependencies-url]: https://david-dm.org/MikeBull94/zoom.ts#info=peerDependencies
[demo]: https://mikebull94.github.io/zoom.ts
[zoom.ts]: https://github.com/MikeBull94/zoom.ts/blob/master/lib/Zoom.ts
[dist.js]: https://github.com/MikeBull94/zoom.ts/blob/master/dist/zoom.js
[min.js]: https://github.com/MikeBull94/zoom.ts/blob/master/dist/zoom.min.js
[zoom.scss]: https://github.com/MikeBull94/zoom.ts/blob/master/style/zoom.scss
[dist.css]: https://github.com/MikeBull94/zoom.ts/blob/master/dist/zoom.css
[min.css]: https://github.com/MikeBull94/zoom.ts/blob/master/dist/zoom.min.css
[typedoc]: https://github.com/TypeStrong/typedoc
[docs]: https://mikebull94.github.io/zoom.ts/docs
[node]: https://nodejs.org
[github]: https://github.com/MikeBull94/zoom.ts
[license]: https://github.com/MikeBull94/zoom.ts/blob/master/LICENSE

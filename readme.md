# images-loaded [![Build Status](https://travis-ci.org/awcross/images-loaded.svg?branch=master)](https://travis-ci.org/awcross/images-loaded)

> Wait for images to load using promises


## Install

```
$ npm install --save images-loaded
```


## Usage

```js
const imagesLoaded = require('images-loaded');

imagesLoaded('.container').then(() => {
	// images are hot and ready
});
```


## API

### imagesLoaded(input [, options])

Returns a `Promise` when all images are done loading, with or without errors.

#### input

Type: `string` `Element` `NodeList`

A container or list of `elements` to watch for loading images.

#### options

Type: `Object`

##### props

Type: `string[]`<br>
Default: `[]`

Can be passed a list of style properties to also check, e.g. `background-image`, `border-image`, etc.

##### attrs

Type: `string[]`<br>
Default: `[]`

Can be passed a list of attributes to check, such as `poster` on a video element.


## Browser Support

If your browser supports [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) then 🎉. Check it at [caniuse.com](http://caniuse.com/#search=promises).


## License

MIT © [Alex Cross](https://alexcross.io)

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.imagesLoaded = factory());
}(this, (function () { 'use strict';

	/* eslint-disable unicorn/prefer-add-event-listener */

	var slice = Array.prototype.slice;
	var reurl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

	var camelCase = function camelCase(name) {
		return name.replace(/([a-z])-([a-z])/g, function (str, m1, m2) {
			return '' + m1 + m2.toUpperCase();
		});
	};

	var check = function check(obj) {
		return new Promise(function (resolve) {
			var element = obj.element,
			    img = obj.img,
			    src = obj.src;


			if (img.complete && img.naturalWidth !== undefined) {
				resolve(element);
			}

			var proxyImage = img;
			proxyImage.onload = function () {
				return resolve(element);
			};
			proxyImage.onerror = function () {
				return resolve(element);
			};

			if (src !== undefined && element.src === undefined) {
				proxyImage.src = src;
			}
		});
	};

	function index (element, options) {
		if (typeof element === 'string') {
			element = document.querySelectorAll(element);
		}

		var elements = element instanceof NodeList ? slice.call(element) : [].concat(element);

		options = Object.assign({
			props: [],
			attrs: []
		}, options);

		var hasProps = Array.isArray(options.props) && options.props.length;
		var hasAttrs = Array.isArray(options.attrs) && options.attrs.length;
		var images = [];

		elements.forEach(function (elem) {
			var nodeType = elem.nodeType;

			if (!nodeType || [1, 9, 11].indexOf(nodeType) === -1) {
				return;
			}

			var children = void 0;

			if (hasProps || hasAttrs) {
				children = elem.getElementsByTagName('*');
			} else {
				children = elem.getElementsByTagName('img');
			}

			var tags = slice.call(children);

			// Add self to array
			tags.unshift(elem);

			tags.forEach(function (tag) {
				if (tag instanceof HTMLImageElement) {
					images.push({
						element: tag,
						img: tag
					});
				}

				if (hasProps) {
					var style = getComputedStyle(tag);

					if (!style) {
						return;
					}

					options.props.forEach(function (prop) {
						prop = camelCase(prop);

						var match = reurl.exec(style[prop]);

						while (match !== null) {
							var obj = {
								element: tag,
								img: new Image(),
								src: match[2]
							};

							images.push(obj);
							match = reurl.exec(style[prop]);
						}
					});
				}

				if (hasAttrs) {
					options.attrs.forEach(function (attr) {
						if (typeof attr !== 'string') {
							return;
						}

						var url = tag.getAttribute(attr);

						if (url !== null) {
							images.push({
								element: tag,
								img: new Image(),
								src: url
							});
						}
					});
				}
			});
		});

		return Promise.all(images.map(check));
	}

	return index;

})));

'use strict';

const slice = Array.prototype.slice;
const reurl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

const camelCase = name => {
	return name.replace(/([a-z])-([a-z])/g, (str, m1, m2) => {
		return `${m1}${m2.toUpperCase()}`;
	});
};

const check = obj => {
	return new Promise(resolve => {
		const {element, img, src} = obj;

		if (img.complete && img.naturalWidth !== undefined) {
			resolve(element);
		}

		const proxyImage = img;
		proxyImage.onload = () => resolve(element);
		proxyImage.onerror = () => resolve(element);

		if (src !== undefined && element.src === undefined) {
			proxyImage.src = src;
		}
	});
};

export default function (element, options) {
	if (typeof element === 'string') {
		element = document.querySelectorAll(element);
	}

	const elements = element instanceof NodeList ? slice.call(element) : [...element];

	options = Object.assign({
		props: [],
		attrs: []
	}, options);

	const hasProps = Array.isArray(options.props) && options.props.length;
	const hasAttrs = Array.isArray(options.attrs) && options.attrs.length;
	const images = [];

	elements.forEach(elem => {
		const nodeType = elem.nodeType;

		if (!nodeType || [1, 9, 11].indexOf(nodeType) === -1) {
			return;
		}

		let children;

		if (hasProps || hasAttrs) {
			children = elem.getElementsByTagName('*');

		} else {
			children = elem.getElementsByTagName('img');
		}

		const tags = slice.call(children);

		// Add self to array
		tags.unshift(elem);

		tags.forEach(tag => {
			if (tag instanceof HTMLImageElement) {
				images.push({
					element: tag,
					img: tag
				});
			}

			if (hasProps) {
				const style = getComputedStyle(tag);

				if (!style) {
					return;
				}

				options.props.forEach(prop => {
					prop = camelCase(prop);

					let match = reurl.exec(style[prop]);

					while (match !== null) {
						const obj = {
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
				options.attrs.forEach(attr => {
					if (typeof attr !== 'string') {
						return;
					}

					const url = tag.getAttribute(attr);

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

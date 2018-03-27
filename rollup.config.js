import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const pkg = require('./package.json');

export default {
	input: 'index.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',
			name: 'imagesLoaded'
		},
		{
			file: pkg.module,
			format: 'es'
		}
	],
	plugins: [
		resolve(),
		commonjs({
			include: 'node_modules/**'
		}),
		babel({
			exclude: 'node_modules/**'
		})
	]
};

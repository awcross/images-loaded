import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'index.js',
	dest: 'dist/index.js',
	format: 'umd',
	moduleName: 'imagesLoaded',
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

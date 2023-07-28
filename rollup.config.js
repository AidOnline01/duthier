const alias = require('rollup-plugin-alias');
const json = require('@rollup/plugin-json');

exports.default = {
	input: 'src/main.js',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
		sourcemap: true,
	},
	plugins: [
		json(),
		alias({
			resolve: ['.js', '.json'],
			entries: {
				'@': __dirname + '/src/'
			}
		})
	],
};
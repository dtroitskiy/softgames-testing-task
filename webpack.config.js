'use strict';
const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './src/App.ts',
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.([cm]?ts|tsx)$/,
				loader: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js' ],
		extensionAlias: {
			'.ts': ['.js', '.ts'],
			'.cts': ['.cjs', '.cts'],
			'.mts': ['.mjs', '.mts']
		}
	}
};

module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:jest/recommended',
		'plugin:node/recommended'
	],
	env: {
		node: true,
		es6: true,
		commonjs: true
	},
	parserOptions: {
		ecmaVersion: 2022
	},
	plugins: ['jest', 'node'],
	env: {
		'jest/globals': true
	}
}

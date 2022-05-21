module.exports = {
	components: "source/PhoneInputWithCountry.js",
	styleguideDir: "website/docs",
	usageMode: "expand",
	sortProps: props => props,
	dangerouslyUpdateWebpackConfig(webpackConfig, env) {
		webpackConfig.output.filename = 'build/bundle.js'
		webpackConfig.output.chunkFilename = 'build/[name].js'
		return webpackConfig
	},
	webpackConfig: {
		module: {
			rules: [
				// Babel loader will use your project’s babel.config.js
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				// Other loaders that are needed for your components
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		}
	}
}
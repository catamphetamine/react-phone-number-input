module.exports = {
	"components": "source/PhoneInput.js",
	"styleguideDir": "bundle/docs/styleguide",
	"usageMode": "expand",
	sortProps: props => props,
	dangerouslyUpdateWebpackConfig(webpackConfig, env) {
		webpackConfig.output.filename = 'build/bundle.js'
		webpackConfig.output.chunkFilename = 'build/[name].js'
		return webpackConfig
	}
}
require('babel-register')
({
	// Optional ignore regex - if any filenames
	// **do** match this regex then they aren't compiled.
	// ignore: /regex/,

	// Optional only regex - if any filenames
	// **don't** match this regex then they aren't compiled.
	// only: /my_es6_folder/,

	// Ignore can also be specified as a function.
	ignore: function(filename)
	{
		if (filename.indexOf('/node_modules/') >= 0)
		{
			if (filename.indexOf('/libphonenumber-js/') >= 0)
			{
				return false
			}
			if (filename.indexOf('/react-responsive-ui/') >= 0)
			{
				return false
			}
			return true
		}
		return false
	},
})
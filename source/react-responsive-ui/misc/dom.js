// https://github.com/catamphetamine/react-responsive-ui/blob/master/source/misc/dom.js

export function submit_parent_form(node)
{
	while (node.parentElement)
	{
		node = node.parentElement
		if (node instanceof HTMLFormElement)
		{
			// Won't use `node.submit()` because it bypasses `onSubmit`.
			// Will click the submit button instead.
			const submit = node.querySelector('button[type=submit]')
			if (submit)
			{
				submit.click()
				return true
			}
		}
	}
}

export function get_scrollbar_width()
{
	// // `window.innerWidth` has a bug:
	// // it's decreases as the page scale is increased.
	// // Therefore not using it.
	// // (Full width) - (Width minus scrollbar)
	// return document.body.clientWidth - window.innerWidth

	return 17
}
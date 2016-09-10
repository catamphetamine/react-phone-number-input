// Checks if `string` starts with `substring`
export function starts_with(string, substring)
{
	let j = substring.length

	if (j > string.length)
	{
		return false
	}

	while (j > 0)
	{
		j--

		if (string[j] !== substring[j])
		{
			return false
		}
	}

	return true
}
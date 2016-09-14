"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.starts_with = starts_with;
// Checks if `string` starts with `substring`
function starts_with(string, substring) {
	var j = substring.length;

	if (j > string.length) {
		return false;
	}

	while (j > 0) {
		j--;

		if (string[j] !== substring[j]) {
			return false;
		}
	}

	return true;
}
//# sourceMappingURL=helpers.js.map
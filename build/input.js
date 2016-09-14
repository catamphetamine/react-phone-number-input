'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _phone = require('./phone');

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Key codes
// https://github.com/sanniassin/react-input-mask/blob/master/InputElement.js
// https://github.com/halt-hammerzeit/react-phone-number-input

var Keys = {
	Backspace: 8,
	Delete: 46
};

// Usage:
//
// <Phone
// 	value={this.state.phone}
// 	format={format.RU}
// 	onChange={phone => this.setState({ phone })}
// 	className="phone-input"
// 	style={{ color: 'black' }} />
//

var Phone_input = function (_React$Component) {
	(0, _inherits3.default)(Phone_input, _React$Component);

	function Phone_input(props, context) {
		(0, _classCallCheck3.default)(this, Phone_input);

		var _this = (0, _possibleConstructorReturn3.default)(this, (Phone_input.__proto__ || (0, _getPrototypeOf2.default)(Phone_input)).call(this, props, context));

		_this.on_key_down = _this.on_key_down.bind(_this);
		_this.on_cut = _this.on_cut.bind(_this);
		_this.on_blur = _this.on_blur.bind(_this);
		_this.format_input_value = _this.format_input_value.bind(_this);
		return _this;
	}

	(0, _createClass3.default)(Phone_input, [{
		key: 'render',
		value: function render() {
			var _props = this.props;
			var value = _props.value;
			var format = _props.format;
			var rest = (0, _objectWithoutProperties3.default)(_props, ['value', 'format']);

			// Currently onCut has a bug: it just deletes, but doesn't copy.
			// Since no one would really cut a phone number, I guess that's ok.

			// Maybe React already trims the `value`.
			// If that's so then don't trim it here.

			return _react2.default.createElement('input', (0, _extends3.default)({}, rest, {
				type: 'tel',
				ref: 'input',
				value: (0, _phone.format_local)(value ? value.trim() : '', format, false),
				onKeyDown: this.on_key_down,
				onChange: this.format_input_value,
				onBlur: this.on_blur,
				onPaste: this.format_input_value,
				onCut: this.on_cut }));
		}

		// Returns <input/> DOM Element

	}, {
		key: 'input_element',
		value: function input_element() {
			return _reactDom2.default.findDOMNode(this.refs.input);
		}

		// Sets <input/> value and caret position

	}, {
		key: 'set_input_value',
		value: function set_input_value(value, caret_position) {
			// DOM Node
			var input = this.input_element();

			// set <input/> value manually to also set caret position
			// and prevent React from resetting the caret position later
			// inside subsequent `render()`.
			input.value = value;

			// Set caret position (with the neccessary adjustments)
			if (caret_position !== undefined) {
				input.setSelectionRange(caret_position, caret_position);
			}

			var _props2 = this.props;
			var onChange = _props2.onChange;
			var format = _props2.format;


			if (onChange) {
				onChange((0, _phone.parse_plaintext_international)(value, format, false));
			}
		}

		// Gets <input/> value

	}, {
		key: 'get_input_value',
		value: function get_input_value() {
			return this.input_element().value;
		}

		// Gets <input/> caret position

	}, {
		key: 'get_caret_position',
		value: function get_caret_position() {
			return this.input_element().selectionStart;
		}

		// Gets <input/> selected position

	}, {
		key: 'get_selection',
		value: function get_selection() {
			// DOM Node
			var input = this.input_element();

			// If no selection, return nothing
			if (input.selectionStart === input.selectionEnd) {
				return;
			}

			return { start: input.selectionStart, end: input.selectionEnd };
		}

		// Formats input value as a phone number

	}, {
		key: 'format_input_value',
		value: function format_input_value(event) {
			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			// Get selection caret positions
			options.selection = this.get_selection();

			// Trunk prefix is not part of the input
			options.with_trunk_prefix = false;

			// Edit <input/>ted value according to the input conditions (caret position, key pressed)

			var _edit = (0, _editor2.default)(this.get_input_value(), this.get_caret_position(), this.props.format, options);

			var phone = _edit.phone;
			var caret = _edit.caret;

			// Set <input/> value and caret position

			this.set_input_value(phone, caret);
		}

		// Intercepts "Cut" event.
		// Special handling for "Cut" event because
		// it wouldn't copy to clipboard otherwise.

	}, {
		key: 'on_cut',
		value: function on_cut(event) {
			var _this2 = this;

			setTimeout(function () {
				return _this2.format_input_value(event);
			}, 0);
		}

		// This handler is mainly for `redux-form`

	}, {
		key: 'on_blur',
		value: function on_blur(event) {
			var _props3 = this.props;
			var onBlur = _props3.onBlur;
			var format = _props3.format;


			if (onBlur) {
				onBlur((0, _phone.parse_plaintext_international)(this.input_element().value, format, false));
			}
		}

		// Intercepts "Delete" and "Backspace" keys
		// (hitting "Delete" or "Backspace"
		//  at any caret position should always result in 
		//  erasing a digit)

	}, {
		key: 'on_key_down',
		value: function on_key_down(event) {
			var backspace = event.keyCode === Keys.Backspace;
			var Delete = event.keyCode === Keys.Delete;

			if (backspace || Delete) {
				this.format_input_value(event, { backspace: backspace, delete: Delete });
				return event.preventDefault();
			}
		}
	}]);
	return Phone_input;
}(_react2.default.Component);

exports.default = Phone_input;


Phone_input.propTypes = {
	format: _react.PropTypes.oneOfType([_react.PropTypes.shape({
		country: _react.PropTypes.string.isRequired,
		template: _react.PropTypes.string.isRequired
	}), _react.PropTypes.shape({
		country: _react.PropTypes.string.isRequired,
		template: _react.PropTypes.func.isRequired
	})]).isRequired,
	value: _react.PropTypes.string,
	onChange: _react.PropTypes.func.isRequired,
	onBlur: _react.PropTypes.func
};
module.exports = exports['default'];
//# sourceMappingURL=input.js.map
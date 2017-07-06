import _extends from 'babel-runtime/helpers/extends';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import _getIterator from 'babel-runtime/core-js/get-iterator';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
// https://github.com/halt-hammerzeit/react-responsive-ui/blob/master/source/select.js

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { submit_parent_form, get_scrollbar_width } from './misc/dom';

// Possible enhancements:
//
//  * If the menu is close to a screen edge,
//    automatically reposition it so that it fits on the screen
//  * Maybe show menu immediately above the toggler
//    (like in Material design), not below it.
//
// https://material.google.com/components/menus.html

var Empty_value_option_value = '';

var value_prop_type = PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]);

var Select = function (_PureComponent) {
  _inherits(Select, _PureComponent);

  function Select(props) {
    _classCallCheck(this, Select);

    // Shouldn't memory leak because
    // the set of options is assumed to be constant.
    var _this = _possibleConstructorReturn(this, (Select.__proto__ || _Object$getPrototypeOf(Select)).call(this, props));

    _initialiseProps.call(_this);

    _this.options = {};
    // any timeouts will be cleared when unmounted
    _this.timeouts = {};
    var value = props.value,
        autocomplete = props.autocomplete,
        options = props.options,
        children = props.children,
        menu = props.menu,
        toggler = props.toggler,
        onChange = props.onChange;


    if (autocomplete) {
      if (!options) {
        throw new Error('"options" property is required for an "autocomplete" select');
      }

      _this.state.matching_options = _this.get_matching_options(options, value);
    }

    if (children && !menu) {
      React.Children.forEach(children, function (element) {
        if (!element.props.value) {
          throw new Error('You must specify "value" prop on each child of <Select/>');
        }

        if (!element.props.label) {
          throw new Error('You must specify "label" prop on each child of <Select/>');
        }
      });
    }

    if (menu && !toggler) {
      throw new Error('Supply a "toggler" component when enabling "menu" in <Select/>');
    }

    if (!menu && !onChange) {
      throw new Error('"onChange" property must be specified for <Select/>');
    }
    return _this;
  }

  // Client side rendering, javascript is enabled


  _createClass(Select, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          fallback = _props.fallback,
          nativeExpanded = _props.nativeExpanded;


      document.addEventListener('click', this.document_clicked);

      if (fallback) {
        this.setState({ javascript: true });
      }

      if (nativeExpanded) {
        this.resize_native_expanded_select();
        window.addEventListener('resize', this.resize_native_expanded_select);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(previous_props, previous_state) {
      var _props2 = this.props,
          nativeExpanded = _props2.nativeExpanded,
          value = _props2.value;
      var _state = this.state,
          expanded = _state.expanded,
          height = _state.height;


      if (expanded !== previous_state.expanded) {
        if (expanded && this.should_animate()) {
          if (height === undefined) {
            this.calculate_height();
          }
        }
      }

      // If the `value` changed then resize the native expanded `<select/>`
      if (nativeExpanded && value !== previous_props.value) {
        this.resize_native_expanded_select();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var nativeExpanded = this.props.nativeExpanded;


      document.removeEventListener('click', this.document_clicked);

      if (nativeExpanded) {
        window.removeEventListener('resize', this.resize_native_expanded_select);
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(_Object$keys(this.timeouts)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var timeoutID = _step.value;

          clearTimeout(this.timeouts[timeoutID]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          id = _props3.id,
          upward = _props3.upward,
          scroll = _props3.scroll,
          children = _props3.children,
          menu = _props3.menu,
          toggler = _props3.toggler,
          alignment = _props3.alignment,
          autocomplete = _props3.autocomplete,
          saveOnIcons = _props3.saveOnIcons,
          fallback = _props3.fallback,
          native = _props3.native,
          nativeExpanded = _props3.nativeExpanded,
          disabled = _props3.disabled,
          required = _props3.required,
          placeholder = _props3.placeholder,
          label = _props3.label,
          value = _props3.value,
          error = _props3.error,
          style = _props3.style,
          className = _props3.className;
      var _state2 = this.state,
          expanded = _state2.expanded,
          list_height = _state2.list_height;


      var options = this.get_options();

      var list_style = void 0;

      // Makes the options list scrollable (only when not in `autocomplete` mode).
      if (this.is_scrollable() && this.state.list_height !== undefined) {
        list_style = { maxHeight: list_height + 'px' };
      }

      var overflow = scroll && options && this.overflown();

      var list_items = void 0;

      // If a list of options is supplied as an array of `{ value, label }`,
      // then transform those elements to <buttons/>
      if (options) {
        list_items = options.map(function (_ref, index) {
          var value = _ref.value,
              label = _ref.label,
              icon = _ref.icon;

          return _this2.render_list_item({
            index: index,
            value: value,
            label: label,
            icon: !saveOnIcons && icon,
            overflow: overflow
          });
        });
      } else {
        // Else, if a list of options is supplied as a set of child React elements,
        // then render those elements.
        list_items = React.Children.map(children, function (element, index) {
          if (!element) {
            return;
          }

          return _this2.render_list_item({ index: index, element: element });
        });
      }

      var wrapper_style = { textAlign: alignment };

      var selected = this.get_selected_option();

      var markup = React.createElement(
        'div',
        {
          ref: function ref(_ref4) {
            return _this2.select = _ref4;
          },
          onKeyDown: this.on_key_down_in_container,
          style: style ? _extends({}, wrapper_style, style) : wrapper_style,
          className: classNames('rrui__select', {
            rrui__rich: fallback,
            'rrui__select--menu': menu,
            'rrui__select--upward': upward,
            'rrui__select--expanded': expanded,
            'rrui__select--collapsed': !expanded,
            'rrui__select--disabled': disabled
          }, className)
        },
        React.createElement(
          'div',
          {
            className: classNames({
              rrui__input: !menu
            })
          },
          !menu && !native && this.render_selected_item(),
          label && (this.get_selected_option() || placeholder) && React.createElement(
            'label',
            {
              htmlFor: id,
              className: classNames('rrui__input-label', {
                'rrui__input-label--required': required && value_is_empty(value),
                'rrui__input-label--invalid': this.should_indicate_invalid()
              })
            },
            label
          ),
          menu && React.createElement(
            'div',
            {
              ref: function ref(_ref2) {
                return _this2.menu_toggler;
              },
              className: 'rrui__select__toggler'
            },
            React.cloneElement(toggler, { onClick: this.toggle })
          ),
          !native && !nativeExpanded && list_items.length > 0 && React.createElement(
            'ul',
            {
              ref: function ref(_ref3) {
                return _this2.list = _ref3;
              },
              style: list_style,
              className: classNames('rrui__expandable', 'rrui__expandable--overlay', 'rrui__select__options', 'rrui__shadow', {
                'rrui__select__options--menu': menu,
                'rrui__expandable--expanded': expanded,
                'rrui__select__options--expanded': expanded,
                'rrui__expandable--left-aligned': alignment === 'left',
                'rrui__expandable--right-aligned': alignment === 'right',
                'rrui__select__options--left-aligned': !children && alignment === 'left',
                'rrui__select__options--right-aligned': !children && alignment === 'right',
                // CSS selector performance optimization
                'rrui__select__options--upward': upward,
                'rrui__select__options--downward': !upward
              })
            },
            list_items
          ),
          (native || fallback && !this.state.javascript) && this.render_static()
        ),
        this.should_indicate_invalid() && React.createElement(
          'div',
          { className: 'rrui__input-error' },
          error
        )
      );

      return markup;
    }
  }, {
    key: 'render_list_item',
    value: function render_list_item(_ref5) {
      var _this3 = this;

      var index = _ref5.index,
          element = _ref5.element,
          value = _ref5.value,
          label = _ref5.label,
          icon = _ref5.icon,
          overflow = _ref5.overflow;
      var _props4 = this.props,
          disabled = _props4.disabled,
          menu = _props4.menu,
          scrollbarPadding = _props4.scrollbarPadding;
      var _state3 = this.state,
          focused_option_value = _state3.focused_option_value,
          expanded = _state3.expanded;

      // If a list of options is supplied as a set of child React elements,
      // then extract values from their props.

      if (element) {
        value = element.props.value;
      }

      var is_focused = !menu && value === focused_option_value;

      var item_style = void 0;

      // on overflow the vertical scrollbar will take up space
      // reducing padding-right and the only way to fix that
      // is to add additional padding-right
      //
      // a hack to restore padding-right taken up by a vertical scrollbar
      if (overflow && scrollbarPadding) {
        item_style = { marginRight: get_scrollbar_width() + 'px' };
      }

      var button = void 0;

      // If a list of options is supplied as a set of child React elements,
      // then enhance those elements with extra props.
      if (element) {
        var extra_props = {
          style: item_style ? _extends({}, item_style, element.props.style) : element.props.style,
          className: classNames('rrui__select__option', {
            'rrui__select__option--focused': is_focused
          }, element.props.className)
        };

        var onClick = element.props.onClick;

        extra_props.onClick = function (event) {
          if (menu) {
            _this3.toggle();
          } else {
            _this3.item_clicked(value, event);
          }

          if (onClick) {
            onClick(event);
          }
        };

        button = React.cloneElement(element, extra_props);
      } else {
        // Else, if a list of options is supplied as an array of `{ value, label }`,
        // then transform those options to <buttons/>
        button = React.createElement(
          'button',
          {
            type: 'button',
            onClick: function onClick(event) {
              return _this3.item_clicked(value, event);
            },
            disabled: disabled,
            tabIndex: '-1',
            className: classNames('rrui__select__option', {
              'rrui__select__option--focused': is_focused,
              // CSS selector performance optimization
              'rrui__select__option--disabled': disabled
            }),
            style: item_style
          },
          icon && React.cloneElement(icon, {
            className: classNames(icon.props.className, 'rrui__select__option-icon')
          }),
          label
        );
      }

      var markup = React.createElement(
        'li',
        {
          key: get_option_key(value),
          ref: function ref(_ref6) {
            return _this3.options[get_option_key(value)] = _ref6;
          },
          className: classNames('rrui__expandable__content', 'rrui__select__options-list-item', {
            'rrui__select__separator-option': element && element.type === Select.Separator,
            'rrui__expandable__content--expanded': expanded,
            // CSS selector performance optimization
            'rrui__select__options-list-item--expanded': expanded
          })
        },
        button
      );

      return markup;
    } // , first, last

    // Renders the selected option
    // and possibly a transparent native `<select/>` above it
    // so that the native `<select/>` expands upon click
    // on the selected option
    // (in case of `nativeExpanded` setting).

  }, {
    key: 'render_selected_item',
    value: function render_selected_item() {
      var nativeExpanded = this.props.nativeExpanded;


      var selected = this.render_selected_item_only();

      if (!nativeExpanded) {
        return selected;
      }

      var markup = React.createElement(
        'div',
        { style: native_expanded_select_container_style },
        this.render_static(),
        selected
      );

      return markup;
    }
  }, {
    key: 'render_selected_item_only',
    value: function render_selected_item_only() {
      var _this4 = this;

      var _props5 = this.props,
          children = _props5.children,
          value = _props5.value,
          placeholder = _props5.placeholder,
          label = _props5.label,
          disabled = _props5.disabled,
          autocomplete = _props5.autocomplete,
          concise = _props5.concise,
          tabIndex = _props5.tabIndex,
          onFocus = _props5.onFocus,
          inputClassName = _props5.inputClassName;
      var _state4 = this.state,
          expanded = _state4.expanded,
          autocomplete_width = _state4.autocomplete_width,
          autocomplete_input_value = _state4.autocomplete_input_value;


      var selected = this.get_selected_option();
      var selected_label = this.get_selected_option_label();

      var selected_text = selected ? selected_label : placeholder || label;

      if (autocomplete && expanded) {
        // style = { ...style, width: autocomplete_width + 'px' }

        var _markup = React.createElement('input', {
          type: 'text',
          ref: function ref(_ref7) {
            return _this4.autocomplete = _ref7;
          },
          placeholder: selected_text,
          value: autocomplete_input_value,
          onChange: this.on_autocomplete_input_change,
          onKeyDown: this.on_key_down,
          onFocus: onFocus,
          onBlur: this.on_blur,
          tabIndex: tabIndex,
          className: classNames('rrui__input-field', 'rrui__select__selected', 'rrui__select__selected--autocomplete', {
            'rrui__select__selected--nothing': !selected_label,
            // CSS selector performance optimization
            'rrui__select__selected--expanded': expanded,
            'rrui__select__selected--disabled': disabled
          }, inputClassName)
        });

        return _markup;
      }

      var markup = React.createElement(
        'button',
        {
          ref: function ref(_ref8) {
            return _this4.selected = _ref8;
          },
          type: 'button',
          disabled: disabled,
          onClick: this.toggle,
          onKeyDown: this.on_key_down,
          onFocus: onFocus,
          onBlur: this.on_blur,
          tabIndex: tabIndex,
          className: classNames('rrui__input-field', 'rrui__select__selected', {
            'rrui__input-field--invalid': this.should_indicate_invalid(),
            'rrui__select__selected--nothing': !selected_label
          })
        },
        React.createElement(
          'div',
          { className: 'rrui__select__selected-content' },
          React.createElement(
            'div',
            { className: 'rrui__select__selected-label' },
            concise && selected && selected.icon ? React.cloneElement(selected.icon, { title: selected_label }) : selected_text
          ),
          React.createElement('div', {
            className: classNames('rrui__select__arrow', {
              // CSS selector performance optimization
              'rrui__select__arrow--expanded': expanded
            })
          })
        )
      );

      return markup;
    }

    // supports disabled javascript

  }, {
    key: 'render_static',
    value: function render_static() {
      var _this5 = this;

      var _props6 = this.props,
          id = _props6.id,
          name = _props6.name,
          value = _props6.value,
          label = _props6.label,
          disabled = _props6.disabled,
          options = _props6.options,
          menu = _props6.menu,
          toggler = _props6.toggler,
          fallback = _props6.fallback,
          nativeExpanded = _props6.nativeExpanded,
          children = _props6.children;


      if (menu) {
        var _markup2 = React.createElement(
          'div',
          {
            className: classNames({
              rrui__rich__fallback: fallback
            })
          },
          toggler
        );

        return _markup2;
      }

      var markup = React.createElement(
        'select',
        {
          ref: function ref(_ref9) {
            return _this5.native = _ref9;
          },
          id: id,
          name: name,
          value: value_is_empty(value) ? Empty_value_option_value : value,
          disabled: disabled,
          onChange: this.native_select_on_change,
          className: classNames('rrui__input', 'rrui__select__native', {
            'rrui__select__native-expanded': nativeExpanded,
            rrui__rich__fallback: fallback
          })
        },
        options ? this.render_native_select_options(options, value_is_empty(value)) : React.Children.map(children, function (child) {
          if (!child) {
            return;
          }

          var markup = React.createElement(
            'option',
            {
              className: 'rrui__select__native-option',
              key: child.props.value,
              value: child.props.value
            },
            child.props.label
          );

          return markup;
        })
      );

      return markup;
    }
  }, {
    key: 'render_native_select_options',
    value: function render_native_select_options(options, empty_option_is_selected) {
      var placeholder = this.props.placeholder;


      var empty_option_present = false;

      var rendered_options = options.map(function (option) {
        var value = option.value,
            label = option.label;


        if (value_is_empty(value)) {
          empty_option_present = true;
          value = Empty_value_option_value;
        }

        var markup = React.createElement(
          'option',
          {
            className: 'rrui__select__native-option',
            key: get_option_key(value),
            value: value
          },
          label
        );

        return markup;
      });

      if (empty_option_is_selected && !empty_option_present) {
        rendered_options.unshift(React.createElement(
          'option',
          {
            className: 'rrui__select__native-option',
            key: get_option_key(undefined),
            value: ''
          },
          placeholder
        ));
      }

      return rendered_options;
    }

    // Whether should indicate that the input value is invalid

  }, {
    key: 'should_indicate_invalid',
    value: function should_indicate_invalid() {
      var _props7 = this.props,
          indicateInvalid = _props7.indicateInvalid,
          error = _props7.error;


      return indicateInvalid && error;
    }
  }, {
    key: 'get_selected_option',
    value: function get_selected_option() {
      var value = this.props.value;


      return this.get_option(value);
    }
  }, {
    key: 'get_option',
    value: function get_option(value) {
      var _props8 = this.props,
          options = _props8.options,
          children = _props8.children;


      if (options) {
        return options.filter(function (x) {
          return x.value === value;
        })[0];
      }

      var option = void 0;

      React.Children.forEach(children, function (child) {
        if (child.props.value === value) {
          option = child;
        }
      });

      return option;
    }
  }, {
    key: 'get_option_index',
    value: function get_option_index(option) {
      var _props9 = this.props,
          options = _props9.options,
          children = _props9.children;


      if (options) {
        return options.indexOf(option);
      }

      var option_index = void 0;

      React.Children.forEach(children, function (child, index) {
        if (child.props.value === option.value) {
          option_index = index;
        }
      });

      return option_index;
    }
  }, {
    key: 'get_selected_option_label',
    value: function get_selected_option_label() {
      var options = this.props.options;


      var selected = this.get_selected_option();

      if (!selected) {
        return;
      }

      if (options) {
        return selected.label;
      }

      return selected.props.label;
    }
  }, {
    key: 'overflown',
    value: function overflown() {
      var _props10 = this.props,
          options = _props10.options,
          maxItems = _props10.maxItems;


      return options.length > maxItems;
    }
  }, {
    key: 'scrollable_list_height',
    value: function scrollable_list_height() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state;
      var maxItems = this.props.maxItems;

      // (Adding vertical padding so that it shows these `maxItems` options fully)

      return (state.height - 2 * state.vertical_padding) * (maxItems / this.get_options().length) + state.vertical_padding;
    }
  }, {
    key: 'should_animate',
    value: function should_animate() {
      return true;

      // return this.props.options.length >= this.props.transition_item_count_min
    }
  }, {
    key: 'focus',
    value: function focus() {
      if (this.autocomplete) {
        this.autocomplete.focus();
      } else {
        this.selected.focus();
      }
    }
  }, {
    key: 'item_clicked',
    value: function item_clicked(value, event) {
      if (event) {
        event.preventDefault();
      }

      var onChange = this.props.onChange;


      this.toggle(undefined, { callback: function callback() {
          return onChange(value);
        } });
    }

    // Would have used `onBlur={...}` event handler here
    // with `if (container.contains(event.relatedTarget))` condition,
    // but it doesn't work in IE in React.
    // https://github.com/facebook/react/issues/3751
    //
    // Therefore, using the hacky `document.onClick` handlers
    // and this `onKeyDown` Tab handler
    // until `event.relatedTarget` support is consistent in React.
    //


    // This handler is a workaround for `redux-form`

  }, {
    key: 'get_options',
    value: function get_options() {
      var _props11 = this.props,
          autocomplete = _props11.autocomplete,
          autocompleteShowAll = _props11.autocompleteShowAll,
          maxItems = _props11.maxItems,
          options = _props11.options;
      var matching_options = this.state.matching_options;


      if (!autocomplete) {
        return options;
      }

      if (autocompleteShowAll) {
        return matching_options;
      }

      return matching_options.slice(0, maxItems);
    }

    // Get the previous option (relative to the currently focused option)

  }, {
    key: 'previous_focusable_option',
    value: function previous_focusable_option() {
      var options = this.get_options();
      var focused_option_value = this.state.focused_option_value;


      var i = 0;
      while (i < options.length) {
        if (options[i].value === focused_option_value) {
          if (i - 1 >= 0) {
            return options[i - 1];
          }
        }
        i++;
      }
    }

    // Get the next option (relative to the currently focused option)

  }, {
    key: 'next_focusable_option',
    value: function next_focusable_option() {
      var options = this.get_options();
      var focused_option_value = this.state.focused_option_value;


      var i = 0;
      while (i < options.length) {
        if (options[i].value === focused_option_value) {
          if (i + 1 < options.length) {
            return options[i + 1];
          }
        }
        i++;
      }
    }

    // Scrolls to an option having the value

  }, {
    key: 'scroll_to',
    value: function scroll_to(value) {
      var vertical_padding = this.state.vertical_padding;


      var option_element = ReactDOM.findDOMNode(this.options[get_option_key(value)]);
      var list = ReactDOM.findDOMNode(this.list);

      // If this option isn't even shown
      // (e.g. autocomplete)
      // then don't scroll to it because there's nothing to scroll to.
      if (!option_element) {
        return;
      }

      var offset_top = option_element.offsetTop;

      var is_first_option = list.firstChild === option_element;

      // If it's the first one - then scroll to list top
      if (is_first_option) {
        offset_top -= vertical_padding;
      }

      list.scrollTop = offset_top;
    }

    // Fully shows an option having the `value` (scrolls to it if neccessary)

  }, {
    key: 'show_option',
    value: function show_option(value, gravity) {
      var vertical_padding = this.state.vertical_padding;


      var option_element = ReactDOM.findDOMNode(this.options[get_option_key(value)]);
      var list = ReactDOM.findDOMNode(this.list);

      var is_first_option = list.firstChild === option_element;
      var is_last_option = list.lastChild === option_element;

      switch (gravity) {
        case 'top':
          var top_line = option_element.offsetTop;

          if (is_first_option) {
            top_line -= vertical_padding;
          }

          if (top_line < list.scrollTop) {
            list.scrollTop = top_line;
          }

          return;

        case 'bottom':
          var bottom_line = option_element.offsetTop + option_element.offsetHeight;

          if (is_last_option) {
            bottom_line += vertical_padding;
          }

          if (bottom_line > list.scrollTop + list.offsetHeight) {
            list.scrollTop = bottom_line - list.offsetHeight;
          }

          return;
      }
    }

    // Calculates height of the expanded item list

  }, {
    key: 'calculate_height',
    value: function calculate_height() {
      var options = this.props.options;


      var list_dom_node = ReactDOM.findDOMNode(this.list);
      var border = parseInt(window.getComputedStyle(list_dom_node).borderTopWidth);
      var height = list_dom_node.scrollHeight;

      var vertical_padding = parseInt(window.getComputedStyle(list_dom_node).paddingTop);

      // For things like "accordeon".
      //
      // const images = list_dom_node.querySelectorAll('img')
      //
      // if (images.length > 0)
      // {
      // 	return this.preload_images(list_dom_node, images)
      // }

      var state = { height: height, vertical_padding: vertical_padding, border: border };

      if (this.is_scrollable() && options && this.overflown()) {
        state.list_height = this.scrollable_list_height(state);
      }

      this.setState(state);
    }
  }, {
    key: 'is_scrollable',
    value: function is_scrollable() {
      var _props12 = this.props,
          menu = _props12.menu,
          autocomplete = _props12.autocomplete,
          autocompleteShowAll = _props12.autocompleteShowAll,
          scroll = _props12.scroll;


      return !menu && (autocomplete && autocompleteShowAll || !autocomplete) && scroll;
    }

    // This turned out not to work for `autocomplete`
    // because not all options are ever shown.
    // get_widest_label_width()
    // {
    // 	// <ul/> -> <li/> -> <button/>
    // 	const label = ReactDOM.findDOMNode(this.list).firstChild.firstChild
    //
    // 	const style = getComputedStyle(label)
    //
    // 	const width = parseFloat(style.width)
    // 	const side_padding = parseFloat(style.paddingLeft)
    //
    // 	return width - 2 * side_padding
    // }

  }, {
    key: 'get_matching_options',


    // // https://github.com/daviferreira/react-sanfona/blob/master/src/AccordionItem/index.jsx#L54
    // // Wait for images to load before calculating maxHeight
    // preload_images(node, images)
    // {
    // 	let images_loaded = 0
    //
    // 	const image_loaded = () =>
    // 	{
    // 		images_loaded++
    //
    // 		if (images_loaded === images.length)
    // 		{
    // 			this.setState
    // 			({
    // 				height: this.props.expanded ? node.scrollHeight : 0
    // 			})
    // 		}
    // 	}
    //
    // 	for (let i = 0; i < images.length; i += 1)
    // 	{
    // 		const image = new Image()
    // 		image.src = images[i].src
    // 		image.onload = image.onerror = image_loaded
    // 	}
    // }
    value: function get_matching_options(options, value) {
      // If the autocomplete value is `undefined` or empty
      if (!value) {
        return options;
      }

      value = value.toLowerCase();

      return options.filter(function (_ref10) {
        var label = _ref10.label,
            verbose = _ref10.verbose;

        return (verbose || label).toLowerCase().indexOf(value) >= 0;
      });
    }
  }]);

  return Select;
}(PureComponent);

Select.propTypes = {
  // A list of selectable options
  options: PropTypes.arrayOf(PropTypes.shape({
    // Option value (may be `undefined`)
    value: value_prop_type,
    // Option label (may be `undefined`)
    label: PropTypes.string,
    // Option icon
    icon: PropTypes.node
  })),

  // HTML form input `name` attribute
  name: PropTypes.string,

  // Label which is placed above the select
  label: PropTypes.string,

  // Placeholder (like "Choose")
  placeholder: PropTypes.string,

  // Whether to use native `<select/>`
  native: PropTypes.bool.isRequired,

  // Whether to use native `<select/>` when expanded
  nativeExpanded: PropTypes.bool.isRequired,

  // Show icon only for selected item,
  // and only if `concise` is `true`.
  saveOnIcons: PropTypes.bool,

  // Disables this control
  disabled: PropTypes.bool,

  // Set to `true` to mark the field as required
  required: PropTypes.bool.isRequired,

  // Selected option value
  value: value_prop_type,

  // Is called when an option is selected
  onChange: PropTypes.func,

  // Is called when the select is focused
  onFocus: PropTypes.func,

  // Is called when the select is blurred.
  // This `onBlur` interceptor is a workaround for `redux-form`,
  // so that it gets the parsed `value` in its `onBlur` handler,
  // not the formatted text.
  onBlur: PropTypes.func,

  // (exotic use case)
  // Falls back to a plain HTML input
  // when javascript is disabled (e.g. Tor)
  fallback: PropTypes.bool.isRequired,

  // Component CSS class
  className: PropTypes.string,

  // Autocomplete `<input/>` CSS class
  inputClassName: PropTypes.string,

  // CSS style object
  style: PropTypes.object,

  // If this flag is set to `true`,
  // and `icon` is specified for a selected option,
  // then the selected option will be displayed
  // as icon only, without the label.
  concise: PropTypes.bool,

  // HTML `tabindex` attribute
  tabIndex: PropTypes.number,

  // If set to `true`, autocompletion is available
  // upon expanding the options list.
  autocomplete: PropTypes.bool,

  // If set to `true`, autocomple will show all
  // matching options instead of just `maxItems`.
  autocompleteShowAll: PropTypes.bool,

  // Options list alignment ("left", "right")
  alignment: PropTypes.oneOf(['left', 'right']),

  // If `menu` flag is set to `true`
  // then it's gonna be a dropdown menu
  // with `children` elements inside.
  menu: PropTypes.bool,

  // If `menu` flag is set to `true`
  // then `toggler` is the dropdown menu button.
  toggler: PropTypes.element,

  // If `scroll` is `false`, then options list
  // is not limited in height.
  // Is `true` by default (scrollable).
  scroll: PropTypes.bool.isRequired,

  // If this flag is set to `true`,
  // then the dropdown expands itself upward.
  // (as opposed to the default downward)
  upward: PropTypes.bool,

  // Maximum items fitting the options list height (scrollable).
  // In case of `autocomplete` that's the maximum number of matched items shown.
  // Is `6` by default.
  maxItems: PropTypes.number.isRequired,

  // Is `true` by default (only when the list of options is scrollable)
  scrollbarPadding: PropTypes.bool,

  focusUponSelection: PropTypes.bool.isRequired,

  onTabOut: PropTypes.func,

  onToggle: PropTypes.func,

  automaticallyScrollIntoView: PropTypes.bool

  // transition_item_count_min : PropTypes.number,
  // transition_duration_min : PropTypes.number,
  // transition_duration_max : PropTypes.number
};
Select.defaultProps = {
  alignment: 'left',
  scroll: true,
  maxItems: 6,
  scrollbarPadding: true,
  focusUponSelection: true,
  fallback: false,
  native: false,
  nativeExpanded: false,

  // Set to `true` to mark the field as required
  required: false,

  automaticallyScrollIntoView: false

  // transition_item_count_min : 1,
  // transition_duration_min : 60, // milliseconds
  // transition_duration_max : 100 // milliseconds
};

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.state = {
    // Is initialized during the first `componentDidUpdate()` call
    vertical_padding: 0
  };

  this.native_select_on_change = function (event) {
    var onChange = _this6.props.onChange;


    var value = event.target.value;

    // Convert back from an empty string to `undefined`
    if (value === Empty_value_option_value) {
      // `null` is not accounted for, use `undefined` instead.
      value = undefined;
    }

    onChange(value);
  };

  this.resize_native_expanded_select = function () {
    // For some strange reason 1px on the right side of the `<select/>`
    // still falls through to the underlying selected option label.
    ReactDOM.findDOMNode(_this6.native).style.width = ReactDOM.findDOMNode(_this6.selected).offsetWidth + 1 + 'px';
  };

  this.toggle = function (event) {
    var toggle_options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (event) {
      // Don't navigate away when clicking links
      event.preventDefault();

      // Not discarding the click event because
      // other expanded selects may be listening to it.
      // // Discard the click event so that it won't reach `document` click listener
      // event.stopPropagation() // doesn't work
      // event.nativeEvent.stopImmediatePropagation()
    }

    var _props13 = _this6.props,
        menu = _props13.menu,
        disabled = _props13.disabled,
        autocomplete = _props13.autocomplete,
        options = _props13.options,
        value = _props13.value,
        focusUponSelection = _props13.focusUponSelection,
        onToggle = _props13.onToggle,
        nativeExpanded = _props13.nativeExpanded,
        automaticallyScrollIntoView = _props13.automaticallyScrollIntoView;


    if (nativeExpanded) {
      return;
    }

    if (disabled) {
      return;
    }

    var expanded = _this6.state.expanded;


    if (!expanded && autocomplete) {
      _this6.setState({
        // The input value can't be `undefined`
        // because in that case React would complain
        // about it being an "uncontrolled input"
        autocomplete_input_value: '',
        matching_options: options
      });

      // if (!this.state.autocomplete_width)
      // {
      // 	this.setState({ autocomplete_width: this.get_widest_label_width() })
      // }
    }

    // Deferring expanding the select upon click
    // because document.onClick should finish first,
    // otherwise `event.target` may be detached from the DOM
    // and it would immediately toggle back to collapsed state.
    clearTimeout(_this6.timeouts.expander);
    clearTimeout(_this6.timeouts.focusOnSelect);
    clearTimeout(_this6.timeouts.scrollIntoView);
    _this6.timeouts.expander = setTimeout(function () {
      delete _this6.timeouts.expander;
      _this6.setState({
        expanded: !expanded
      });

      if (!expanded && options) {
        // Focus either the selected option
        // or the first option in the list.

        var focused_option_value = value || options[0].value;

        _this6.setState({ focused_option_value: focused_option_value });

        // Scroll down to the focused option
        _this6.scroll_to(focused_option_value);
      }

      // If it's autocomplete, then focus <input/> field
      // upon toggling the select component.

      if (!toggle_options.dont_focus_after_toggle) {
        if (autocomplete) {
          if (!expanded || expanded && focusUponSelection) {
            _this6.timeouts.focusOnSelect = setTimeout(function () {
              delete _this6.timeouts.focusOnSelect;
              // Focus the toggler
              if (expanded) {
                _this6.selected.focus();
              } else {
                _this6.autocomplete.focus();
              }
            }, 0);
          }
        } else {
          // For some reason Firefox loses focus
          // upon select expansion via a click,
          // so this extra `.focus()` works around that issue.
          if (!menu) {
            _this6.selected.focus();
          }
        }
      }

      if (!expanded && automaticallyScrollIntoView && _this6.list) {
        _this6.timeouts.scrollIntoView = setTimeout(function () {
          if (_this6.list.scrollIntoViewIfNeeded) {
            _this6.list.scrollIntoViewIfNeeded();
          } else if (_this6.list.scrollIntoView) {
            _this6.list.scrollIntoView();
          }
          delete _this6.timeouts.scrollIntoView;
        }, 100);
      }

      if (onToggle) {
        onToggle(!expanded);
      }

      if (toggle_options.callback) {
        toggle_options.callback();
      }
    }, 0);
  };

  this.document_clicked = function (event) {
    var autocomplete = ReactDOM.findDOMNode(_this6.autocomplete);
    var selected_option = ReactDOM.findDOMNode(_this6.selected);
    var options_list = ReactDOM.findDOMNode(_this6.list);

    // Don't close the select if its expander button has been clicked,
    // or if autocomplete has been clicked,
    // or if an option was selected from the list.
    if (options_list && options_list.contains(event.target) || autocomplete && autocomplete.contains(event.target) || selected_option && selected_option.contains(event.target)) {
      return;
    }

    _this6.setState({ expanded: false });

    var onToggle = _this6.props.onToggle;


    if (onToggle) {
      onToggle(false);
    }
  };

  this.on_key_down_in_container = function (event) {
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }

    var expanded = _this6.state.expanded;


    switch (event.keyCode) {
      // Toggle on Tab out
      case 9:
        if (expanded) {
          _this6.toggle(undefined, { dont_focus_after_toggle: true });

          var onTabOut = _this6.props.onTabOut;


          if (onTabOut) {
            onTabOut(event);
          }
        }
        return;
    }
  };

  this.on_key_down = function (event) {
    if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
      return;
    }

    var _props14 = _this6.props,
        options = _props14.options,
        value = _props14.value,
        autocomplete = _props14.autocomplete;
    var _state5 = _this6.state,
        expanded = _state5.expanded,
        focused_option_value = _state5.focused_option_value;

    // Maybe add support for `children` arrow navigation in future

    if (options) {
      switch (event.keyCode) {
        // Select the previous option (if present) on up arrow
        case 38:
          event.preventDefault();

          var previous = _this6.previous_focusable_option();

          if (previous) {
            _this6.show_option(previous.value, 'top');
            return _this6.setState({ focused_option_value: previous.value });
          }

          return;

        // Select the next option (if present) on down arrow
        case 40:
          event.preventDefault();

          var next = _this6.next_focusable_option();

          if (next) {
            _this6.show_option(next.value, 'bottom');
            return _this6.setState({ focused_option_value: next.value });
          }

          return;

        // Collapse on Escape
        //
        // Maybe add this kind of support for "Escape" key in some future:
        //  hiding the item list, cancelling current item selection process
        //  and restoring the selection present before the item list was toggled.
        //
        case 27:
          // Collapse the list if it's expanded
          if (_this6.state.expanded) {
            _this6.toggle();

            // Restore focus when the list is collapsed
            _this6.timeouts.focusOnCollapse = setTimeout(function () {
              _this6.selected.focus();
              delete _this6.timeouts.focusOnCollapse;
            }, 0);
          }

          return;

        // on Enter
        case 13:
          // Choose the focused item on Enter
          if (expanded) {
            event.preventDefault();

            // If an item is focused
            // (which may not be a case
            //  when autocomplete is matching no items)
            // (still for non-autocomplete select
            //  it is valid to have a default option)
            if (_this6.get_options() && _this6.get_options().length > 0) {
              // Choose the focused item
              _this6.item_clicked(focused_option_value);
              // And collapse the select
              _this6.toggle();
            }
          } else {
            // Else it should have just submitted the form on Enter,
            // but it wouldn't because the select element activator is a <button/>
            // therefore hitting Enter while being focused on it just pushes that button.
            // So submit the enclosing form manually.
            if (submit_parent_form(ReactDOM.findDOMNode(_this6.select))) {
              event.preventDefault();
            }
          }

          return;

        // on Spacebar
        case 32:
          // Choose the focused item on Enter
          if (expanded) {
            // only if it it's an `options` select
            // and also if it's not an autocomplete
            if (_this6.get_options() && !autocomplete) {
              event.preventDefault();

              // `focused_option_value` could be non-existent
              // in case of `autocomplete`, but since
              // we're explicitly not handling autocomplete here
              // it is valid to select any options including the default ones.
              _this6.item_clicked(focused_option_value);
              _this6.toggle();
            }
          }
          // Otherwise, the spacebar keydown event on a `<button/>`
          // will trigger `onClick` and `.toggle()` will be called.

          return;
      }
    }
  };

  this.on_blur = function (event) {
    var _props15 = _this6.props,
        onBlur = _props15.onBlur,
        value = _props15.value;

    // This `onBlur` interceptor is a workaround for `redux-form`,
    // so that it gets the right (parsed, not the formatted one)
    // `event.target.value` in its `onBlur` handler.

    if (onBlur) {
      var _event = _extends({}, event, {
        target: _extends({}, event.target, {
          value: value
        })
      });

      // For `redux-form` event detection.
      // https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
      _event.stopPropagation = event.stopPropagation;
      _event.preventDefault = event.preventDefault;

      onBlur(_event);
    }
  };

  this.on_autocomplete_input_change = function (event) {
    var options = _this6.props.options;

    var input = event.target.value;
    var matching_options = _this6.get_matching_options(options, input);

    _this6.setState({
      autocomplete_input_value: input,
      matching_options: matching_options,
      focused_option_value: matching_options.length > 0 ? matching_options[0].value : undefined
    });
  };
};

export default Select;


Select.Separator = function (props) {
  return React.createElement('div', { className: 'rrui__select__separator' });
};

var native_expanded_select_container_style = {
  display: 'inline-block'
};

// There can be an `undefined` value,
// so just `{ value }` won't do here.
function get_option_key(value) {
  return value_is_empty(value) ? '@@rrui/select/undefined' : value;
}

function value_is_empty(value) {
  return value === null || value === undefined;
}
//# sourceMappingURL=select.js.map
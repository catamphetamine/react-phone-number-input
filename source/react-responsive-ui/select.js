import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'

import { submit_parent_form, get_scrollbar_width } from './misc/dom'

// Possible enhancements:
//
//  * If the menu is close to a screen edge,
//    automatically reposition it so that it fits on the screen
//  * Maybe show menu immediately above the toggler
//    (like in Material design), not below it.
//
// https://material.google.com/components/menus.html

const Empty_value_option_value = ''

const value_prop_type = PropTypes.oneOfType
([
	PropTypes.string,
	PropTypes.number,
	PropTypes.bool
])

export default class Select extends PureComponent
{
	static propTypes =
	{
		// A list of selectable options
		options    : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value (may be `undefined`)
				value : value_prop_type,
				// Option label (may be `undefined`)
				label : PropTypes.string,
				// Option icon
				icon  : PropTypes.node
			})
		),

		// HTML form input `name` attribute
		name       : PropTypes.string,

		// Label which is placed above the select
		label      : PropTypes.string,

		// Placeholder (like "Choose")
		placeholder : PropTypes.string,

		// Whether to use native `<select/>`
		native      : PropTypes.bool.isRequired,

		// Whether to use native `<select/>` when expanded
		nativeExpanded : PropTypes.bool.isRequired,

		// Show icon only for selected item,
		// and only if `concise` is `true`.
		saveOnIcons : PropTypes.bool,

		// Disables this control
		disabled   : PropTypes.bool,

		// Set to `true` to mark the field as required
		required   : PropTypes.bool.isRequired,

		// Selected option value
		value      : value_prop_type,

		// Is called when an option is selected
		onChange   : PropTypes.func,

		// Is called when the select is focused
		onFocus    : PropTypes.func,

		// Is called when the select is blurred.
		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the parsed `value` in its `onBlur` handler,
		// not the formatted text.
		onBlur     : PropTypes.func,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback   : PropTypes.bool.isRequired,

		// Component CSS class
		className  : PropTypes.string,

		// Autocomplete `<input/>` CSS class
		inputClassName : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// If this flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label.
		concise    : PropTypes.bool,

		// HTML `tabindex` attribute
		tabIndex   : PropTypes.number,

		// If set to `true`, autocompletion is available
		// upon expanding the options list.
		autocomplete : PropTypes.bool,

		// If set to `true`, autocomple will show all
		// matching options instead of just `maxItems`.
		autocompleteShowAll : PropTypes.bool,

		// Options list alignment ("left", "right")
		alignment  : PropTypes.oneOf(['left', 'right']),

		// If `menu` flag is set to `true`
		// then it's gonna be a dropdown menu
		// with `children` elements inside
		// and therefore `onChange` won't be called
		// on menu item click.
		menu       : PropTypes.bool,

		// If `menu` flag is set to `true`
		// then `toggler` is the dropdown menu button.
		toggler    : PropTypes.element,

		// If `scroll` is `false`, then options list
		// is not limited in height.
		// Is `true` by default (scrollable).
		scroll     : PropTypes.bool.isRequired,

		// If this flag is set to `true`,
		// then the dropdown expands itself upward.
		// (as opposed to the default downward)
		upward     : PropTypes.bool,

		// Maximum items fitting the options list height (scrollable).
		// In case of `autocomplete` that's the maximum number of matched items shown.
		// Is `6` by default.
		maxItems   : PropTypes.number.isRequired,

		// Is `true` by default (only when the list of options is scrollable)
		scrollbarPadding : PropTypes.bool,

		focusUponSelection : PropTypes.bool.isRequired,

		// When the `<Select/>` is expanded
		// the options list may not fit on the screen.
		// If `scrollIntoView` is `true` (which is the default)
		// then the browser will automatically scroll
		// so that the expanded options list fits on the screen.
		scrollIntoView : PropTypes.bool.isRequired,

		// If `scrollIntoView` is `true` (which is the default)
		// then this is gonna be the delay after which it scrolls into view.
		expandAnimationDuration : PropTypes.number.isRequired,

		onTabOut : PropTypes.func,

		onToggle : PropTypes.func

		// transition_item_count_min : PropTypes.number,
		// transition_duration_min : PropTypes.number,
		// transition_duration_max : PropTypes.number
	}

	static defaultProps =
	{
		alignment          : 'left',
		scroll             : true,
		maxItems           : 6,
		scrollbarPadding   : true,
		focusUponSelection : true,
		fallback           : false,
		native             : false,
		nativeExpanded     : false,
		scrollIntoView     : true,
		expandAnimationDuration : 150,

		// Set to `true` to mark the field as required
		required : false,

		// transition_item_count_min : 1,
		// transition_duration_min : 60, // milliseconds
		// transition_duration_max : 100 // milliseconds
	}

	state =
	{
		// Is initialized during the first `componentDidUpdate()` call
		vertical_padding: 0
	}

	constructor(props)
	{
		super(props)

		// Shouldn't memory leak because
		// the set of options is assumed to be constant.
		this.options = {}

		const
		{
			value,
			autocomplete,
			options,
			children,
			menu,
			toggler,
			onChange
		}
		= this.props

		if (autocomplete)
		{
			if (!options)
			{
				throw new Error(`"options" property is required for an "autocomplete" select`)
			}

			this.state.matching_options = this.get_matching_options(options, value)
		}

		if (children && !menu)
		{
			React.Children.forEach(children, (element) =>
			{
				if (!element.props.value)
				{
					throw new Error(`You must specify "value" prop on each child of <Select/>`)
				}

				if (!element.props.label)
				{
					throw new Error(`You must specify "label" prop on each child of <Select/>`)
				}
			})
		}

		if (menu && !toggler)
		{
			throw new Error(`Supply a "toggler" component when enabling "menu" in <Select/>`)
		}

		if (!menu && !onChange)
		{
			throw new Error(`"onChange" property must be specified for a non-menu <Select/>`)
		}
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		const { fallback, nativeExpanded } = this.props

		document.addEventListener('click', this.document_clicked)

		if (fallback)
		{
			this.setState({ javascript: true })
		}

		if (nativeExpanded)
		{
			this.resize_native_expanded_select()
			window.addEventListener('resize', this.resize_native_expanded_select)
		}
	}

	componentDidUpdate(previous_props, previous_state)
	{
		const { nativeExpanded, value } = this.props
		const { expanded, height } = this.state

		if (expanded !== previous_state.expanded)
		{
			if (expanded && this.should_animate())
			{
				if (height === undefined)
				{
					this.calculate_height()
				}
			}
		}

		// If the `value` changed then resize the native expanded `<select/>`
		if (nativeExpanded && value !== previous_props.value)
		{
			this.resize_native_expanded_select()
		}
	}

	componentWillUnmount()
	{
		const { nativeExpanded } = this.props

		document.removeEventListener('click', this.document_clicked)

		if (nativeExpanded)
		{
			window.removeEventListener('resize', this.resize_native_expanded_select)
		}

		if (this.toggle_timeout)
		{
			clearTimeout(this.toggle_timeout)
			this.toggle_timeout = undefined
		}

		if (this.scroll_into_view_timeout)
		{
			clearTimeout(this.scroll_into_view_timeout)
			this.scroll_into_view_timeout = undefined
		}

		if (this.restore_focus_on_collapse_timeout)
		{
			clearTimeout(this.restore_focus_on_collapse_timeout)
			this.restore_focus_on_collapse_timeout = undefined
		}
	}

	render()
	{
		const
		{
			id,
			upward,
			scroll,
			children,
			menu,
			toggler,
			alignment,
			autocomplete,
			saveOnIcons,
			fallback,
			native,
			nativeExpanded,
			disabled,
			required,
			placeholder,
			label,
			value,
			error,
			style,
			className
		}
		= this.props

		const
		{
			expanded,
			list_height
		}
		= this.state

		const options = this.get_options()

		let list_style

		// Makes the options list scrollable (only when not in `autocomplete` mode).
		if (this.is_scrollable() && this.state.list_height !== undefined)
		{
			list_style = { maxHeight: `${list_height}px` }
		}

		const overflow = scroll && options && this.overflown()

		let list_items

		// If a list of options is supplied as an array of `{ value, label }`,
		// then transform those elements to <buttons/>
		if (options)
		{
			list_items = options.map(({ value, label, icon }, index) =>
			{
				return this.render_list_item({ index, value, label, icon: !saveOnIcons && icon, overflow })
			})
		}
		// Else, if a list of options is supplied as a set of child React elements,
		// then render those elements.
		else
		{
			list_items = React.Children.map(children, (element, index) =>
			{
				if (!element)
				{
					return
				}

				return this.render_list_item({ index, element })
			})
		}

		const wrapper_style = { textAlign: alignment }

		const selected = this.get_selected_option()

		const markup =
		(
			<div
				ref={ ref => this.select = ref }
				onKeyDown={ this.on_key_down_in_container }
				onBlur={ this.on_blur }
				style={ style ? { ...wrapper_style, ...style } : wrapper_style }
				className={ classNames
				(
					'rrui__select',
					{
						'rrui__rich'              : fallback,
						'rrui__select--upward'    : upward,
						'rrui__select--expanded'  : expanded,
						'rrui__select--collapsed' : !expanded,
						'rrui__select--disabled'  : disabled
					},
					className
				) }>

				<div
					className={ classNames
					({
						'rrui__input': !toggler
					}) }>

					{/* Currently selected item */}
					{ !menu && !native && this.render_selected_item() }

					{/* Label */}
					{/* (this label is placed after the "selected" button
					     to utilize the CSS `+` selector) */}
					{/* If the `placeholder` wasn't specified
					    but `label` was and no option is currently selected
					    then the `label` becomes the `placeholder`
					    until something is selected */}
					{ label && (this.get_selected_option() || placeholder) &&
						<label
							htmlFor={ id }
							className={ classNames('rrui__input-label',
							{
								'rrui__input-label--required' : required && value_is_empty(value),
								'rrui__input-label--invalid'  : this.should_indicate_invalid()
							}) }>
							{ label }
						</label>
					}

					{/* Menu toggler */}
					{ menu && this.render_toggler() }

					{/* The list of selectable options */}
					{/* Math.max(this.state.height, this.props.max_height) */}
					{ !native && !nativeExpanded && list_items.length > 0 &&
						<ul
							ref={ ref => this.list = ref }
							style={ list_style }
							className={ classNames
							(
								'rrui__expandable',
								'rrui__expandable--overlay',
								'rrui__select__options',
								'rrui__shadow',
								{
									'rrui__select__options--menu'          : menu,
									'rrui__expandable--expanded'           : expanded,
									'rrui__select__options--expanded'      : expanded,
									'rrui__expandable--left-aligned'       : alignment === 'left',
									'rrui__expandable--right-aligned'      : alignment === 'right',
									'rrui__select__options--left-aligned'  : !children && alignment === 'left',
									'rrui__select__options--right-aligned' : !children && alignment === 'right',
									// CSS selector performance optimization
									'rrui__select__options--upward'        : upward,
									'rrui__select__options--downward'      : !upward
								}
							) }>
							{ list_items }
						</ul>
					}

					{/* Fallback in case javascript is disabled */}
					{ (native || (fallback && !this.state.javascript)) && this.render_static() }
				</div>

				{/* Error message */}
				{ this.should_indicate_invalid() &&
					<div className="rrui__input-error">{ error }</div>
				}
			</div>
		)

		return markup
	}

	render_list_item({ index, element, value, label, icon, overflow }) // , first, last
	{
		const { disabled, menu, scrollbarPadding } = this.props
		const { focused_option_value, expanded } = this.state

		// If a list of options is supplied as a set of child React elements,
		// then extract values from their props.
		if (element)
		{
			value = element.props.value
		}

		const is_focused = !menu && value === focused_option_value

		let item_style

		// on overflow the vertical scrollbar will take up space
		// reducing padding-right and the only way to fix that
		// is to add additional padding-right
		//
		// a hack to restore padding-right taken up by a vertical scrollbar
		if (overflow && scrollbarPadding)
		{
			item_style = { marginRight: get_scrollbar_width() + 'px' }
		}

		let button

		// If a list of options is supplied as a set of child React elements,
		// then enhance those elements with extra props.
		if (element)
		{
			const extra_props =
			{
				style     : item_style ? { ...item_style, ...element.props.style } : element.props.style,
				className : classNames
				(
					'rrui__select__option',
					{
						'rrui__select__option--focused' : is_focused
					},
					element.props.className
				)
			}

			const onClick = element.props.onClick

			extra_props.onClick = (event) =>
			{
				if (menu)
				{
					this.toggle()
				}
				else
				{
					this.item_clicked(value, event)
				}

				if (onClick)
				{
					onClick(event)
				}
			}

			button = React.cloneElement(element, extra_props)
		}
		// Else, if a list of options is supplied as an array of `{ value, label }`,
		// then transform those options to <buttons/>
		else
		{
			button = <button
				type="button"
				onClick={ event => this.item_clicked(value, event) }
				disabled={ disabled }
				tabIndex="-1"
				className={ classNames
				(
					'rrui__select__option',
					{
						'rrui__select__option--focused' : is_focused,
						// CSS selector performance optimization
						'rrui__select__option--disabled' : disabled
					}
				) }
				style={ item_style }>
				{ icon && React.cloneElement(icon, { className: classNames(icon.props.className, 'rrui__select__option-icon') }) }
				{ label }
			</button>
		}

		const markup =
		(
			<li
				key={ get_option_key(value) }
				ref={ ref => this.options[get_option_key(value)] = ref }
				className={ classNames
				(
					'rrui__expandable__content',
					'rrui__select__options-list-item',
					{
						'rrui__select__separator-option' : element && element.type === Select.Separator,
						'rrui__expandable__content--expanded' : expanded,
						// CSS selector performance optimization
						'rrui__select__options-list-item--expanded' : expanded
					}
				) }>
				{ button }
			</li>
		)

		return markup
	}

	// Renders the selected option
	// and possibly a transparent native `<select/>` above it
	// so that the native `<select/>` expands upon click
	// on the selected option
	// (in case of `nativeExpanded` setting).
	render_selected_item()
	{
		const { nativeExpanded, toggler } = this.props

		if (toggler)
		{
			return this.render_toggler()
		}

		const selected = this.render_selected_item_only()

		if (nativeExpanded)
		{
			return (
				<div style={ native_expanded_select_container_style }>
					{ this.render_static() }
					{ selected }
				</div>
			)
		}

		return selected
	}

	render_selected_item_only()
	{
		const
		{
			children,
			value,
			placeholder,
			label,
			disabled,
			autocomplete,
			concise,
			tabIndex,
			onFocus,
			title,
			inputClassName
		}
		= this.props

		const
		{
			expanded,
			autocomplete_width,
			autocomplete_input_value
		}
		= this.state

		const selected = this.get_selected_option()
		const selected_label = this.get_selected_option_label()

		const selected_text = selected ? selected_label : (placeholder || label)

		if (autocomplete && expanded)
		{
			// style = { ...style, width: autocomplete_width + 'px' }

			const markup =
			(
				<input
					type="text"
					ref={ ref => this.autocomplete = ref }
					placeholder={ selected_text }
					value={ autocomplete_input_value }
					onChange={ this.on_autocomplete_input_change }
					onKeyDown={ this.on_key_down }
					onFocus={ onFocus }
					tabIndex={ tabIndex }
					title={ title }
					className={ classNames
					(
						'rrui__input-field',
						'rrui__select__selected',
						'rrui__select__selected--autocomplete',
						{
							'rrui__select__selected--nothing'  : !selected_label,
							// CSS selector performance optimization
							'rrui__select__selected--expanded' : expanded,
							'rrui__select__selected--disabled' : disabled
						},
						inputClassName
					) }/>
			)

			return markup
		}

		const markup =
		(
			<button
				ref={ ref => this.selected = ref }
				type="button"
				disabled={ disabled }
				onClick={ this.toggle }
				onKeyDown={ this.on_key_down }
				onFocus={ onFocus }
				tabIndex={ tabIndex }
				title={ title }
				className={ classNames
				(
					'rrui__input-field',
					'rrui__select__selected',
					{
						'rrui__input-field--invalid'      : this.should_indicate_invalid(),
						'rrui__select__selected--nothing' : !selected_label
					}
				) }>

				{/* http://stackoverflow.com/questions/35464067/flexbox-not-working-on-button-element-in-some-browsers */}
				<div className="rrui__select__selected-content">

					{/* Selected option label (or icon) */}
					<div className="rrui__select__selected-label">
						{ (concise && selected && selected.icon) ? React.cloneElement(selected.icon, { title: selected_label }) : selected_text }
					</div>

					{/* An arrow */}
					<div
						className={ classNames('rrui__select__arrow',
						{
							// CSS selector performance optimization
							'rrui__select__arrow--expanded': expanded
						}) }/>
				</div>
			</button>
		)

		return markup
	}

	render_toggler()
	{
		const { toggler } = this.props

		return (
			<div className="rrui__select__toggler">
				{ React.cloneElement(toggler,
				{
					ref       : ref => this.selected = ref,
					onClick   : this.toggle,
					onKeyDown : this.on_key_down
				}) }
			</div>
		)
	}

	// supports disabled javascript
	render_static()
	{
		const
		{
			id,
			name,
			value,
			label,
			disabled,
			options,
			menu,
			toggler,
			fallback,
			nativeExpanded,
			children
		}
		= this.props

		if (menu)
		{
			const markup =
			(
				<div
					className={ classNames
					({
						'rrui__rich__fallback' : fallback
					}) }>
					{toggler}
				</div>
			)

			return markup
		}

		const markup =
		(
			<select
				ref={ ref => this.native = ref }
				id={ id }
				name={ name }
				value={ value_is_empty(value) ? Empty_value_option_value : value }
				disabled={ disabled }
				onChange={ this.native_select_on_change }
				className={ classNames('rrui__input', 'rrui__select__native',
				{
					'rrui__select__native-expanded' : nativeExpanded,
					'rrui__rich__fallback'          : fallback
				}) }>
				{
					options
					?
					this.render_native_select_options(options, value_is_empty(value))
					:
					React.Children.map(children, (child) =>
					{
						if (!child)
						{
							return
						}

						const markup =
						(
							<option
								className="rrui__select__native-option"
								key={ child.props.value }
								value={ child.props.value }>
								{ child.props.label }
							</option>
						)

						return markup
					})
				}
			</select>
		)

		return markup
	}

	render_native_select_options(options, empty_option_is_selected)
	{
		const { placeholder } = this.props

		let empty_option_present = false

		const rendered_options = options.map((option) =>
		{
			let { value, label } = option

			if (value_is_empty(value))
			{
				empty_option_present = true
				value = Empty_value_option_value
			}

			const markup =
			(
				<option
					className="rrui__select__native-option"
					key={ get_option_key(value) }
					value={ value }>
					{ label }
				</option>
			)

			return markup
		})

		if (empty_option_is_selected && !empty_option_present)
		{
			rendered_options.unshift
			(
				<option
					className="rrui__select__native-option"
					key={ get_option_key(undefined) }
					value="">
					{ placeholder }
				</option>
			)
		}

		return rendered_options
	}

	// Whether should indicate that the input value is invalid
	should_indicate_invalid()
	{
		const { indicateInvalid, error } = this.props

		return indicateInvalid && error
	}

	native_select_on_change = (event) =>
	{
		const { onChange } = this.props

		let value = event.target.value

		// Convert back from an empty string to `undefined`
		if (value === Empty_value_option_value)
		{
			// `null` is not accounted for, use `undefined` instead.
			value = undefined
		}

		onChange(value)
	}

	resize_native_expanded_select = () =>
	{
		// For some strange reason 1px on the right side of the `<select/>`
		// still falls through to the underlying selected option label.
		ReactDOM.findDOMNode(this.native).style.width = (ReactDOM.findDOMNode(this.selected).offsetWidth + 1) + 'px'
	}

	get_selected_option()
	{
		const { value } = this.props

		return this.get_option(value)
	}

	get_option(value)
	{
		const { options, children } = this.props

		if (options)
		{
			return options.filter(x => x.value === value)[0]
		}

		let option

		React.Children.forEach(children, function(child)
		{
			if (child.props.value === value)
			{
				option = child
			}
		})

		return option
	}

	get_option_index(option)
	{
		const { options, children } = this.props

		if (options)
		{
			return options.indexOf(option)
		}

		let option_index

		React.Children.forEach(children, function(child, index)
		{
			if (child.props.value === option.value)
			{
				option_index = index
			}
		})

		return option_index
	}

	get_selected_option_label()
	{
		const { options } = this.props

		const selected = this.get_selected_option()

		if (!selected)
		{
			return
		}

		if (options)
		{
			return selected.label
		}

		return selected.props.label
	}

	overflown()
	{
		const { options, maxItems } = this.props

		return options.length > maxItems
	}

	scrollable_list_height(state = this.state)
	{
		const { maxItems } = this.props

		// (Adding vertical padding so that it shows these `maxItems` options fully)
		return (state.height - 2 * state.vertical_padding) * (maxItems / this.get_options().length) + state.vertical_padding
	}

	should_animate()
	{
		return true

		// return this.props.options.length >= this.props.transition_item_count_min
	}

	focus()
	{
		if (this.autocomplete)
		{
			this.autocomplete.focus()
		}
		else
		{
			this.selected.focus()
		}
	}

	toggle = (event, toggle_options = {}) =>
	{
		if (event)
		{
			// Don't navigate away when clicking links
			event.preventDefault()

			// Not discarding the click event because
			// other expanded selects may be listening to it.
			// // Discard the click event so that it won't reach `document` click listener
			// event.stopPropagation() // doesn't work
			// event.nativeEvent.stopImmediatePropagation()
		}

		const
		{
			toggler,
			disabled,
			autocomplete,
			options,
			value,
			focusUponSelection,
			onToggle,
			nativeExpanded,
			scrollIntoView,
			expandAnimationDuration
		}
		= this.props

		if (nativeExpanded)
		{
			return
		}

		if (disabled)
		{
			return
		}

		if (this.toggle_timeout)
		{
			clearTimeout(this.toggle_timeout)
			this.toggle_timeout = undefined
		}

		if (this.scroll_into_view_timeout)
		{
			clearTimeout(this.scroll_into_view_timeout)
			this.scroll_into_view_timeout = undefined
		}

		const { expanded } = this.state

		if (!expanded && autocomplete)
		{
			this.setState
			({
				// The input value can't be `undefined`
				// because in that case React would complain
				// about it being an "uncontrolled input"
				autocomplete_input_value : '',
				matching_options         : options
			})

			// if (!this.state.autocomplete_width)
			// {
			// 	this.setState({ autocomplete_width: this.get_widest_label_width() })
			// }
		}

		// Deferring expanding the select upon click
		// because `document.onClick(event)` should fire first,
		// otherwise `event.target` in that handler will be detached
		// from the document and so `this.document_clicked()` handler will
		// immediately toggle the select back to collapsed state.
		this.toggle_timeout = setTimeout(() =>
		{
			this.toggle_timeout = undefined

			this.setState
			({
				expanded: !expanded
			},
			() =>
			{
				const is_now_expanded = this.state.expanded

				if (!toggle_options.dont_focus_after_toggle)
				{
					// If it's autocomplete, then focus <input/> field
					// upon toggling the select component.
					if (autocomplete)
					{
						if (is_now_expanded)
						{
							// Focus the input after the select is expanded
							this.autocomplete.focus()
						}
						else if (focusUponSelection)
						{
							// Focus the toggler after the select is collapsed
							this.selected.focus()
						}
					}
					else
					{
						// For some reason Firefox loses focus
						// upon select expansion via a click,
						// so this extra `.focus()` works around that issue.
						this.selected.focus()
					}
				}

				this.scroll_into_view_timeout = setTimeout(() =>
				{
					this.scroll_into_view_timeout = undefined

					const is_still_expanded = this.state.expanded

					if (is_still_expanded && this.list && scrollIntoView)
					{
						const element = ReactDOM.findDOMNode(this.list)

						// https://developer.mozilla.org/ru/docs/Web/API/Element/scrollIntoViewIfNeeded
						if (element.scrollIntoViewIfNeeded)
						{
							element.scrollIntoViewIfNeeded(false)
						}
						else
						{
							// https://github.com/stipsan/scroll-into-view-if-needed
							scrollIntoViewIfNeeded(element, false, { duration: 800 })
						}
					}
				},
				expandAnimationDuration * 1.1)
			})

			if (!expanded && options)
			{
				// Focus either the selected option
				// or the first option in the list.

				const focused_option_value = value || options[0].value

				this.setState({ focused_option_value })

				// Scroll down to the focused option
				this.scroll_to(focused_option_value)
			}

			if (onToggle)
			{
				onToggle(!expanded)
			}

			if (toggle_options.callback)
			{
				toggle_options.callback()
			}
		},
		0)
	}

	item_clicked = (value, event) =>
	{
		if (event)
		{
			event.preventDefault()
		}

		const { onChange } = this.props

		this.toggle(undefined, { callback: () => onChange(value) })
	}

	document_clicked = (event) =>
	{
		const autocomplete = ReactDOM.findDOMNode(this.autocomplete)
		const selected_option = ReactDOM.findDOMNode(this.selected)
		const options_list = ReactDOM.findDOMNode(this.list)

		// Don't close the select if its expander button has been clicked,
		// or if autocomplete has been clicked,
		// or if an option was selected from the list.
		if (options_list && options_list.contains(event.target)
			|| (autocomplete && autocomplete.contains(event.target))
			|| (selected_option && selected_option.contains(event.target)))
		{
			return
		}

		this.setState({ expanded: false })

		const { onToggle } = this.props

		if (onToggle)
		{
			onToggle(false)
		}
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
	on_key_down_in_container = (event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { expanded } = this.state

		switch (event.keyCode)
		{
			// Toggle on Tab out
			case 9:
				if (expanded)
				{
					this.toggle(undefined, { dont_focus_after_toggle: true })

					const { onTabOut } = this.props

					if (onTabOut)
					{
						onTabOut(event)
					}
				}
				return
		}
	}

	on_key_down = (event) =>
	{
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey)
		{
			return
		}

		const { options, value, autocomplete } = this.props
		const { expanded, focused_option_value } = this.state

		// Maybe add support for `children` arrow navigation in future
		if (options)
		{
			switch (event.keyCode)
			{
				// Select the previous option (if present) on up arrow
				case 38:
					event.preventDefault()

					const previous = this.previous_focusable_option()

					if (previous)
					{
						this.show_option(previous.value, 'top')
						return this.setState({ focused_option_value: previous.value })
					}

					return

				// Select the next option (if present) on down arrow
				case 40:
					event.preventDefault()

					const next = this.next_focusable_option()

					if (next)
					{
						this.show_option(next.value, 'bottom')
						return this.setState({ focused_option_value: next.value })
					}

					return

				// Collapse on Escape
				//
				// Maybe add this kind of support for "Escape" key in some future:
				//  hiding the item list, cancelling current item selection process
				//  and restoring the selection present before the item list was toggled.
				//
				case 27:
					// Collapse the list if it's expanded
					if (this.state.expanded)
					{
						this.toggle()

						// Restore focus when the list is collapsed
						this.restore_focus_on_collapse_timeout = setTimeout(() =>
						{
							this.restore_focus_on_collapse_timeout = undefined

							this.selected.focus()
						},
						0)
					}

					return

				// on Enter
				case 13:
					// Choose the focused item on Enter
					if (expanded)
					{
						event.preventDefault()

						// If an item is focused
						// (which may not be a case
						//  when autocomplete is matching no items)
						// (still for non-autocomplete select
						//  it is valid to have a default option)
						if (this.get_options() && this.get_options().length > 0)
						{
							// Choose the focused item
							this.item_clicked(focused_option_value)
						}
					}
					// Else it should have just submitted the form on Enter,
					// but it wouldn't because the select element activator is a <button/>
					// therefore hitting Enter while being focused on it just pushes that button.
					// So submit the enclosing form manually.
					else
					{
						if (submit_parent_form(ReactDOM.findDOMNode(this.select)))
						{
							event.preventDefault()
						}
					}

					return

				// on Spacebar
				case 32:
					// Choose the focused item on Enter
					if (expanded)
					{
						// only if it it's an `options` select
						// and also if it's not an autocomplete
						if (this.get_options() && !autocomplete)
						{
							event.preventDefault()

							// `focused_option_value` could be non-existent
							// in case of `autocomplete`, but since
							// we're explicitly not handling autocomplete here
							// it is valid to select any options including the default ones.
							this.item_clicked(focused_option_value)
						}
					}
					// Otherwise, the spacebar keydown event on a `<button/>`
					// will trigger `onClick` and `.toggle()` will be called.

					return
			}
		}
	}

	// This handler is a workaround for `redux-form`
	on_blur = (event) =>
	{
		const { onBlur, value } = this.props

		// If clicked on a select option then don't trigger "blur" event
		if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget))
		{
			return
		}

		// This `onBlur` interceptor is a workaround for `redux-form`,
		// so that it gets the right (parsed, not the formatted one)
		// `event.target.value` in its `onBlur` handler.
		if (onBlur)
		{
			const _event =
			{
				...event,
				target:
				{
					...event.target,
					value
				}
			}

			// For `redux-form` event detection.
			// https://github.com/erikras/redux-form/blob/v5/src/events/isEvent.js
			_event.stopPropagation = event.stopPropagation
			_event.preventDefault  = event.preventDefault

			onBlur(_event)
		}
	}

	get_options()
	{
		const { autocomplete, autocompleteShowAll, maxItems, options } = this.props
		const { matching_options } = this.state

		if (!autocomplete)
		{
			return options
		}

		if (autocompleteShowAll)
		{
			return matching_options
		}

		return matching_options.slice(0, maxItems)
	}

	// Get the previous option (relative to the currently focused option)
	previous_focusable_option()
	{
		const options = this.get_options()
		const { focused_option_value } = this.state

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === focused_option_value)
			{
				if (i - 1 >= 0)
				{
					return options[i - 1]
				}
			}
			i++
		}
	}

	// Get the next option (relative to the currently focused option)
	next_focusable_option()
	{
		const options = this.get_options()
		const { focused_option_value } = this.state

		let i = 0
		while (i < options.length)
		{
			if (options[i].value === focused_option_value)
			{
				if (i + 1 < options.length)
				{
					return options[i + 1]
				}
			}
			i++
		}
	}

	// Scrolls to an option having the value
	scroll_to(value)
	{
		const { vertical_padding } = this.state

		const option_element = ReactDOM.findDOMNode(this.options[get_option_key(value)])
		const list = ReactDOM.findDOMNode(this.list)

		// If this option isn't even shown
		// (e.g. autocomplete)
		// then don't scroll to it because there's nothing to scroll to.
		if (!option_element)
		{
			return
		}

		let offset_top = option_element.offsetTop

		const is_first_option = list.firstChild === option_element

		// If it's the first one - then scroll to list top
		if (is_first_option)
		{
			offset_top -= vertical_padding
		}

		list.scrollTop = offset_top
	}

	// Fully shows an option having the `value` (scrolls to it if neccessary)
	show_option(value, gravity)
	{
		const { vertical_padding } = this.state

		const option_element = ReactDOM.findDOMNode(this.options[get_option_key(value)])
		const list = ReactDOM.findDOMNode(this.list)

		const is_first_option = list.firstChild === option_element
		const is_last_option  = list.lastChild === option_element

		switch (gravity)
		{
			case 'top':
				let top_line = option_element.offsetTop

				if (is_first_option)
				{
					top_line -= vertical_padding
				}

				if (top_line < list.scrollTop)
				{
					list.scrollTop = top_line
				}

				return

			case 'bottom':
				let bottom_line = option_element.offsetTop + option_element.offsetHeight

				if (is_last_option)
				{
					bottom_line += vertical_padding
				}

				if (bottom_line > list.scrollTop + list.offsetHeight)
				{
					list.scrollTop = bottom_line - list.offsetHeight
				}

				return
		}
	}

	// Calculates height of the expanded item list
	calculate_height()
	{
		const { options } = this.props

		const list_dom_node = ReactDOM.findDOMNode(this.list)
		const border = parseInt(window.getComputedStyle(list_dom_node).borderTopWidth)
		const height = list_dom_node.scrollHeight

		const vertical_padding = parseInt(window.getComputedStyle(list_dom_node).paddingTop)

		// For things like "accordeon".
		//
		// const images = list_dom_node.querySelectorAll('img')
		//
		// if (images.length > 0)
		// {
		// 	return this.preload_images(list_dom_node, images)
		// }

		const state = { height, vertical_padding, border }

		if (this.is_scrollable() && options && this.overflown())
		{
			state.list_height = this.scrollable_list_height(state)
		}

		this.setState(state)
	}

	is_scrollable()
	{
		const { menu, autocomplete, autocompleteShowAll, scroll } = this.props

		return !menu && (autocomplete && autocompleteShowAll || !autocomplete) && scroll
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

	get_matching_options(options, value)
	{
		// If the autocomplete value is `undefined` or empty
		if (!value)
		{
			return options
		}

		value = value.toLowerCase()

		return options.filter(({ label, verbose }) =>
		{
			return (verbose || label).toLowerCase().indexOf(value) >= 0
		})
	}

	on_autocomplete_input_change = (event) =>
	{
		const { options } = this.props
		const input = event.target.value
		const matching_options = this.get_matching_options(options, input)

		this.setState
		({
			autocomplete_input_value: input,
			matching_options,
			focused_option_value: matching_options.length > 0 ? matching_options[0].value : undefined
		})
	}

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
}

Select.Separator = function(props)
{
	return <div className="rrui__select__separator"/>
}

const native_expanded_select_container_style =
{
	display : 'inline-block'
}

// There can be an `undefined` value,
// so just `{ value }` won't do here.
function get_option_key(value)
{
	return value_is_empty(value) ? '@@rrui/select/undefined' : value
}

function value_is_empty(value)
{
	return value === null || value === undefined
}
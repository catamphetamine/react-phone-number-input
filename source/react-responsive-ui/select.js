







// WHEN THIS SELECT COMPONENT IS GONNA BE RE-COPY-PASTED FROM REACT-RESPONSIVE-UI
// THIS COULD BE POTENTIALLY A BREAKING CHANGE DUE TO STYLES BEING MOVED FROM INLINE TO CSS.

// 0.8.0 / 25.02.2017
// ==================
//
//   * (could be a breaking change) Moving CSS positioning properties from inline styles to the CSS file therefore if using an edited CSS file from older versions update styles for `.rrui__select` and `.rrui__select__options`










// https://github.com/halt-hammerzeit/react-responsive-ui/blob/master/source/select.js

import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { flat as styler } from 'react-styling'
import classNames from 'classnames'

import { is_reachable, submit_parent_form, get_scrollbar_width } from './misc/dom'

// Possible enhancements:
//
//  * If the menu is close to a screen edge,
//    automatically reposition it so that it fits on the screen
//  * Maybe show menu immediately above the toggler
//    (like in Material design), not below it.
//
// https://material.google.com/components/menus.html

// This is to stretch the selected option `icon`
// to the appropriate `line-height` when `concise` mode is set.
// (And also to stretch the selected option with no `label`)
const Zero_width_space = '\u200b'

export default class Select extends PureComponent
{
	static propTypes =
	{
		// A list of selectable options
		options    : PropTypes.arrayOf
		(
			PropTypes.shape
			({
				// Option value
				value : React.PropTypes.string,
				// Option label
				label : React.PropTypes.string,
				// Option icon
				icon  : React.PropTypes.node
			})
		),

		// HTML form input `name` attribute
		name       : PropTypes.string,

		// Default label (like "Choose")
		label      : PropTypes.string,

		// Show icon only for selected item,
		// and only if `concise` is `true`.
		saveOnIcons : PropTypes.bool,

		// Disables this control
		disabled   : PropTypes.bool,

		// Selected option value
		value      : PropTypes.any,

		// Is called when an option is selected
		onChange   : PropTypes.func,

		// (exotic use case)
		// Falls back to a plain HTML input
		// when javascript is disabled (e.g. Tor)
		fallback  : PropTypes.bool.isRequired,

		// CSS class
		className  : PropTypes.string,

		// CSS style object
		style      : PropTypes.object,

		// If this flag is set to `true`,
		// and `icon` is specified for a selected option,
		// then the selected option will be displayed
		// as icon only, without the label.
		concise    : PropTypes.bool,

		// If set to `true`, autocompletion is available
		// upon expanding the options list.
		autocomplete : PropTypes.bool,

		// Options list alignment ("left", "right")
		alignment  : PropTypes.oneOf(['left', 'right']),

		// If `menu` flag is set to `true`
		// then it's gonna be a dropdown menu
		// with `children` elements inside.
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
		// Is `6` by default.
		maxItems  : PropTypes.number.isRequired,

		// Is `true` by default (only when the list of options is scrollable)
		scrollbarPadding : PropTypes.bool,

		focusUponSelection : PropTypes.bool.isRequired,

		onTabOut : PropTypes.func,

		onToggle : PropTypes.func

		// transition_item_count_min : PropTypes.number,
		// transition_duration_min : PropTypes.number,
		// transition_duration_max : PropTypes.number
	}

	static defaultProps =
	{
		alignment : 'left',

		scroll : true,

		maxItems : 6,

		scrollbarPadding : true,

		focusUponSelection : true,

		fallback : false,

		// transition_item_count_min : 1,
		// transition_duration_min : 60, // milliseconds
		// transition_duration_max : 100 // milliseconds
	}

	state = {}

	constructor(props)
	{
		super(props)

		// Shouldn't memory leak because
		// the set of options is assumed to be constant.
		this.options = {}

		this.toggle           = this.toggle.bind(this)
		this.document_clicked = this.document_clicked.bind(this)
		this.on_key_down      = this.on_key_down.bind(this)

		this.on_autocomplete_input_change = this.on_autocomplete_input_change.bind(this)
		this.on_key_down_in_container = this.on_key_down_in_container.bind(this)

		const
		{
			autocomplete,
			options,
			children,
			menu,
			toggler,
			onChange
		}
		= props

		if (autocomplete)
		{
			if (!options)
			{
				throw new Error(`"options" property is required for an "autocomplete" select`)
			}

			this.state.filtered_options = options
		}

		if (children && !menu)
		{
			React.Children.forEach(children, function(element)
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
			throw new Error(`"onChange" property must be specified for <Select/>`)
		}
	}

	// Client side rendering, javascript is enabled
	componentDidMount()
	{
		document.addEventListener('click', this.document_clicked)

		const { fallback } = this.props

		if (fallback)
		{
			this.setState({ javascript: true })
		}
	}

	componentDidUpdate(previous_props, previous_state)
	{
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
	}

	componentWillUnmount()
	{
		document.removeEventListener('click', this.document_clicked)
	}

	render()
	{
		const
		{
			upward,
			scroll,
			children,
			menu,
			toggler,
			alignment,
			autocomplete,
			saveOnIcons,
			fallback,
			disabled,
			style,
			className
		}
		= this.props

		const { filtered_options, expanded } = this.state
		const options = autocomplete ? filtered_options : this.props.options

		let list_style = upward ? styles.list_upward : styles.list_downward

		// Will be altered
		list_style = { ...list_style }

		switch (alignment)
		{
			case 'left':
				list_style.left = 0
				break

			case 'right':
				list_style.right = 0
				break

			default:
				throw new Error(`Unsupported alignment: "${alignment}"`)
		}

		if (!menu && scroll && this.state.list_height !== undefined)
		{
			list_style.maxHeight = this.state.list_height + 'px'
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
				return this.render_list_item({ index, element })
			})
		}

		const wrapper_style = { ...styles.wrapper, textAlign: alignment }

		const markup =
		(
			<div
				ref={ ref => this.select = ref }
				onKeyDown={ this.on_key_down_in_container }
				style={ style ? { ...wrapper_style, ...style } : wrapper_style }
				className={ classNames
				(
					className,
					'rrui__select',
					{
						'rrui__rich'              : fallback,
						'rrui__select--upward'    : upward,
						'rrui__select--expanded'  : expanded,
						'rrui__select--collapsed' : !expanded,
						'rrui__select--disabled'  : disabled
					}
				) }>

				{/* Currently selected item */}
				{ !menu && this.render_selected_item() }

				{/* Menu toggler */}
				{ menu &&
					<div
						ref={ ref => this.menu_toggler }
						style={ styles.menu_toggler }>
						{ React.cloneElement(toggler, { onClick : this.toggle }) }
					</div>
				}

				{/* The list of selectable options */}
				{/* Math.max(this.state.height, this.props.max_height) */}
				<ul
					ref={ ref => this.list = ref }
					style={ list_style }
					className={ classNames
					(
						'rrui__select__options',
						{
							'rrui__select__options--expanded'             : expanded,
							'rrui__select__options--simple-left-aligned'  : !children && alignment === 'left',
							'rrui__select__options--simple-right-aligned' : !children && alignment === 'right'
						}
					) }>
					{ list_items }
				</ul>

				{/* Fallback in case javascript is disabled */}
				{ fallback && !this.state.javascript && this.render_static() }
			</div>
		)

		return markup
	}

	render_list_item({ index, element, value, label, icon, overflow }) // , first, last
	{
		const { disabled, menu, scrollbarPadding } = this.props
		const { focused_option_value } = this.state

		// If a list of options is supplied as a set of child React elements,
		// then extract values from their props.
		if (element)
		{
			value = element.props.value
		}

		const is_focused = !menu && value === focused_option_value

		let list_item_style = { textAlign: 'left' }

		let item_style = styles.list_item

		// on overflow the vertical scrollbar will take up space
		// reducing padding-right and the only way to fix that
		// is to add additional padding-right
		//
		// a hack to restore padding-right taken up by a vertical scrollbar
		if (overflow && scrollbarPadding)
		{
			item_style = { ...styles.list.item }

			item_style.marginRight = get_scrollbar_width() + 'px'
		}

		let button

		// If a list of options is supplied as a set of child React elements,
		// then enhance those elements with extra props.
		if (element)
		{
			const extra_props =
			{
				style     : { ...item_style, ...element.props.style },
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
				onClick={event => this.item_clicked(value, event)}
				disabled={disabled}
				tabIndex="-1"
				className={classNames
				(
					'rrui__select__option',
					'rrui__button__button',
					{
						'rrui__select__option--focused' : is_focused
					}
				)}
				style={item_style}>
				{ icon && React.cloneElement(icon, { className: classNames(icon.props.className, 'rrui__select__option-icon') }) }
				{ label }
			</button>
		}

		// There can be an `undefined` value,
		// so just `{ value }` won't do here,
		// and `{ `${value}` }` is not ideal too,
		// because there theoretically can be a value `"undefined"`.
		const key = `${index} ${value}`

		// Using just `index` for `ref`s is safe
		// because when `key` changes then the `ref` is updated
		// so there won't be inconsistencies.
		const markup =
		(
			<li
				key={ key }
				ref={ ref => this.options[index] = ref }
				className={ classNames
				({
					'rrui__select__separator-option' : element && element.type === Select.Separator
				}) }
				style={ list_item_style }>
				{ button }
			</li>
		)

		return markup
	}

	render_selected_item()
	{
		const { children, value, label, disabled, autocomplete, concise } = this.props
		const { expanded, autocomplete_width, autocomplete_input_value } = this.state

		const selected_label = this.get_selected_option_label()

		if (autocomplete && expanded)
		{
			const markup =
			(
				<input
					type="text"
					ref={ ref => this.autocomplete = ref }
					placeholder={ selected_label || label }
					value={ autocomplete_input_value }
					onChange={ this.on_autocomplete_input_change }
					onKeyDown={ this.on_key_down }
					style={ { width: autocomplete_width + 'px' } }
					className={ classNames
					(
						'rrui__select__selected',
						'rrui__select__selected--autocomplete',
						{
							'rrui__select__selected--nothing' : !selected_label
						}
					) }/>
			)

			return markup
		}

		const selected = this.get_selected_option()

		const markup =
		(
			<button
				ref={ref => this.selected = ref}
				type="button"
				disabled={disabled}
				onClick={this.toggle}
				onKeyDown={this.on_key_down}
				className={classNames
				(
					'rrui__select__selected',
					'rrui__button__button',
					{
						'rrui__select__selected--nothing' : !selected_label
					}
				)}>

				{/*
				This is to stretch the selected option `icon`
				to the appropriate `line-height` when `concise` mode is set.
				(And also to stretch the selected option with no `label`)
				*/}
				{ Zero_width_space }

				{/* the label (or icon) */}
				{ (concise && selected && selected.icon) ? React.cloneElement(selected.icon, { title: selected_label }) : (selected_label || label) }

				{/* an arrow */}
				<div
					className={classNames('rrui__select__arrow',
					{
						'rrui__select__arrow--expanded': expanded
					})}
					style={styles.arrow}/>
			</button>
		)

		return markup
	}

	// supports disabled javascript
	render_static()
	{
		const
		{
			name,
			value,
			label,
			disabled,
			options,
			menu,
			toggler,
			style,
			className,
			children
		}
		= this.props

		if (menu)
		{
			return <div className="rrui__rich__fallback">{toggler}</div>
		}

		const markup =
		(
			<div className="rrui__rich__fallback">
				<select
					name={name}
					value={value === null ? undefined : value}
					disabled={disabled}
					onChange={event => {}}
					style={ style ? { ...style, width: 'auto' } : { width: 'auto' } }
					className={className}>
					{
						options
						?
						options.map((item, i) =>
						{
							return <option
								className="rrui__select__option"
								key={ `${i} ${item.value}` }
								value={ item.value }>
								{ item.label }
							</option>
						})
						:
						React.Children.map(children, child =>
						{
							return <option
								className="rrui__select__option"
								key={ child.props.value }
								value={ child.props.value }>
								{ child.props.label }
							</option>
						})
					}
				</select>
			</div>
		)

		return markup
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
		return this.props.options.length > this.props.maxItems
	}

	scrollable_list_height(state = this.state)
	{
		return (state.height - 2 * state.vertical_padding) * (this.props.maxItems / this.props.options.length) + state.vertical_padding
	}

	should_animate()
	{
		return true

		// return this.props.options.length >= this.props.transition_item_count_min
	}

	toggle(event, toggle_options = {})
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
			disabled,
			autocomplete,
			options,
			value,
			focusUponSelection,
			onToggle
		}
		= this.props

		if (disabled)
		{
			return
		}

		const { expanded } = this.state

		if (!expanded && autocomplete)
		{
			this.setState
			({
				autocomplete_input_value: '',
				filtered_options: options
			})

			if (!this.state.autocomplete_width)
			{
				this.setState({ autocomplete_width: this.get_widest_label_width() })
			}
		}

		// Deferring expanding the select upon click
		// because document.onClick should finish first,
		// otherwise `event.target` may be detached from the DOM
		// and it would immediately toggle back to collapsed state.
		setTimeout(() =>
		{
			this.setState
			({
				expanded: !expanded
			})

			if (!expanded && options)
			{
				// Focus either the selected option
				// or the first option in the list.

				const focused_option_value = value || options[0].value

				this.setState({ focused_option_value })

				// Scroll down to the focused option
				this.scroll_to(this.get_option(focused_option_value))
			}

			// If it's autocomplete, then focus <input/> field
			// upon toggling the select component.
			if (autocomplete && !toggle_options.dont_focus_after_toggle)
			{
				if (!expanded || (expanded && focusUponSelection))
				{
					setTimeout(() =>
					{
						// Focus the toggler
						if (expanded)
						{
							this.selected.focus()
						}
						else
						{
							this.autocomplete.focus()
						}
					},
					0)
				}
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

	item_clicked(value, event)
	{
		if (event)
		{
			event.preventDefault()
		}

		const
		{
			disabled,
			onChange,
			autocomplete,
			focusUponSelection
		}
		= this.props

		if (disabled)
		{
			return
		}

		// Focus the toggler
		if (focusUponSelection)
		{
			if (autocomplete)
			{
				this.autocomplete.focus()
			}
			else
			{
				this.selected.focus()
			}
		}

		this.toggle(undefined, { callback: () => onChange(value) })
	}

	document_clicked(event)
	{
		const autocomplete = ReactDOM.findDOMNode(this.autocomplete)
		const selected_option = ReactDOM.findDOMNode(this.selected)
		const options_list = ReactDOM.findDOMNode(this.list)

		// Don't close the select if its expander button has been clicked,
		// or if autocomplete has been clicked,
		// or if an option was selected from the list.
		if (is_reachable(event.target, options_list)
			|| (autocomplete && is_reachable(event.target, autocomplete))
			|| (selected_option && is_reachable(event.target, selected_option)))
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

	// Would have used `onBlur()` handler here
	// with `is_reachable(event.relatedTarget, container)`,
	// but it has an IE bug in React.
	// https://github.com/facebook/react/issues/3751
	//
	// Therefore, using the hacky `document.onClick` handlers
	// and this `onKeyDown` Tab handler
	// until `event.relatedTarget` support is consistent in React.
	//
	on_key_down_in_container(event)
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

	on_key_down(event)
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
						this.show_option(previous, 'top')
						return this.setState({ focused_option_value: previous.value })
					}

					return

				// Select the next option (if present) on down arrow
				case 40:
					event.preventDefault()

					const next = this.next_focusable_option()

					if (next)
					{
						this.show_option(next, 'bottom')
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
						setTimeout
						(() =>
						{
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
							// And collapse the select
							this.toggle()
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
							this.toggle()
						}
					}
					// Expand the select otherwise
					else
					{
						event.preventDefault()
						this.toggle()
					}

					return
			}
		}
	}

	get_options()
	{
		const { autocomplete, options } = this.props
		const { filtered_options } = this.state

		return autocomplete ? filtered_options : options
	}

	// Get the previous value (relative to the currently focused value)
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

	// Get the next value (relative to the currently focused value)
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
	scroll_to(option)
	{
		const index = this.get_option_index(option)
		const option_element = ReactDOM.findDOMNode(this.options[index])
		ReactDOM.findDOMNode(this.list).scrollTop = option_element.offsetTop
	}

	// Fully shows an option (scrolls to it if neccessary)
	show_option(option, gravity)
	{
		const index = this.get_option_index(option)
		const option_element = ReactDOM.findDOMNode(this.options[index])
		const list = ReactDOM.findDOMNode(this.list)

		switch (gravity)
		{
			case 'top':
				if (option_element.offsetTop < list.scrollTop)
				{
					list.scrollTop = option_element.offsetTop
				}
				return

			case 'bottom':
				if (option_element.offsetTop + option_element.offsetHeight > list.scrollTop + list.offsetHeight)
				{
					list.scrollTop = option_element.offsetTop + option_element.offsetHeight - list.offsetHeight
				}
				return
		}
	}

	// Calculates height of the expanded item list
	calculate_height()
	{
		const list_dom_node = ReactDOM.findDOMNode(this.list)
		const border = parseInt(window.getComputedStyle(list_dom_node).borderTopWidth)
		const height = list_dom_node.scrollHeight // + 2 * border // inner height + 2 * border

		const vertical_padding = parseInt(window.getComputedStyle(list_dom_node.firstChild).paddingTop)

		// const images = list_dom_node.querySelectorAll('img')

		// if (images.length > 0)
		// {
		// 	return this.preload_images(list_dom_node, images)
		// }

		const state = { height, vertical_padding, border }

		if (!this.props.menu && this.props.scroll && this.props.options && this.overflown())
		{
			state.list_height = this.scrollable_list_height(state)
		}

		this.setState(state)
	}

	get_widest_label_width()
	{
		// <ul/> -> <li/> -> <button/>
		const label = ReactDOM.findDOMNode(this.list).firstChild.firstChild

		const style = getComputedStyle(label)

		const width = parseFloat(style.width)
		const side_padding = parseFloat(style.paddingLeft)

		return width - 2 * side_padding
	}

	on_autocomplete_input_change(event)
	{
		const input = event.target.value

		const { options } = this.props

		const filtered_options = options.filter(({ value, label, verbose, icon }) =>
		{
			return (verbose || label).toLowerCase().indexOf(input.toLowerCase()) !== -1
		})

		this.setState
		({
			autocomplete_input_value: input,
			filtered_options,
			focused_option_value: filtered_options.length > 0 ? filtered_options[0].value : undefined
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
	return <div className="rrui__select__separator" style={styles.separator}/>
}

const styles = styler
`
	wrapper
		position   : relative
		display    : inline-block
		// text-align : inherit

		-webkit-user-select : none
		-moz-user-select    : none
		-ms-user-select     : none
		user-select         : none

	arrow
		display  : inline-block

	list
		position        : absolute
		z-index         : 1
		margin-top      : 0
		margin-bottom   : 0
		padding         : 0
		list-style-type : none
		overflow-x      : hidden

		&downward
			// when html page is overflown by a long list
			// this bottom margin takes effect
			margin-bottom : 1em

		&upward
			bottom: 100%

			// when html page is overflown by a long list
			// this top margin takes effect
			margin-top : 1em

	list_item
		display     : inline-block
		white-space : nowrap

	menu_toggler
		display : inline-block

	separator
		padding     : 0
		line-height : 0
		font-size   : 0
`
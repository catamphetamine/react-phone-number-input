import PropTypes from 'prop-types'

export const metadata = PropTypes.shape({
	country_calling_codes : PropTypes.object.isRequired,
	countries : PropTypes.object.isRequired
})

export const labels = PropTypes.objectOf(PropTypes.string)
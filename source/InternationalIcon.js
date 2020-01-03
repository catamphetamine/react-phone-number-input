import React from 'react'
import PropTypes from 'prop-types'

export default function InternationalIcon({ aspectRatio, ...rest }) {
	if (aspectRatio === 1) {
		return <InternationalIcon1x1 {...rest}/>
	} else {
		return <InternationalIcon3x2 {...rest}/>
	}
}

InternationalIcon.propTypes = {
	title: PropTypes.string.isRequired,
	aspectRatio: PropTypes.number
}

// 3x2.
// Using `<title/>` in `<svg/>`s:
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title
function InternationalIcon3x2({ title, ...rest }) {
	return (
		<svg
			{...rest}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 75 50">
			<title>{title}</title>
			<g
				className="PhoneInputInternationalIconGlobe"
				stroke="currentColor"
				fill="none"
				strokeWidth="2"
				strokeMiterlimit="10">
				<path strokeLinecap="round" d="M47.2,36.1C48.1,36,49,36,50,36c7.4,0,14,1.7,18.5,4.3"/>
				<path d="M68.6,9.6C64.2,12.3,57.5,14,50,14c-7.4,0-14-1.7-18.5-4.3"/>
				<line x1="26" y1="25" x2="74" y2="25"/>
				<line x1="50" y1="1" x2="50" y2="49"/>
				<path strokeLinecap="round" d="M46.3,48.7c1.2,0.2,2.5,0.3,3.7,0.3c13.3,0,24-10.7,24-24S63.3,1,50,1S26,11.7,26,25c0,2,0.3,3.9,0.7,5.8"/>
				<path strokeLinecap="round" d="M46.8,48.2c1,0.6,2.1,0.8,3.2,0.8c6.6,0,12-10.7,12-24S56.6,1,50,1S38,11.7,38,25c0,1.4,0.1,2.7,0.2,4c0,0.1,0,0.2,0,0.2"/>
			</g>
			<path
				className="PhoneInputInternationalIconPhone"
				stroke="none"
				fill="currentColor"
				d="M12.4,17.9c2.9-2.9,5.4-4.8,0.3-11.2S4.1,5.2,1.3,8.1C-2,11.4,1.1,23.5,13.1,35.6s24.3,15.2,27.5,11.9c2.8-2.8,7.8-6.3,1.4-11.5s-8.3-2.6-11.2,0.3c-2,2-7.2-2.2-11.7-6.7S10.4,19.9,12.4,17.9z"/>
		</svg>
	)
}

InternationalIcon3x2.propTypes = {
	title: PropTypes.string.isRequired
}

// 1x1.
// Using `<title/>` in `<svg/>`s:
// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title
function InternationalIcon1x1({ title, ...rest }) {
	return (
		<svg
			{...rest}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 50 50">
			<title>{title}</title>
			<g
				className="PhoneInputInternationalIconGlobe"
				stroke="currentColor"
				fill="none"
				strokeWidth="2"
				strokeLinecap="round">
				<path d="M8.45,13A21.44,21.44,0,1,1,37.08,41.56"/>
				<path d="M19.36,35.47a36.9,36.9,0,0,1-2.28-13.24C17.08,10.39,21.88.85,27.8.85s10.72,9.54,10.72,21.38c0,6.48-1.44,12.28-3.71,16.21"/>
				<path d="M17.41,33.4A39,39,0,0,1,27.8,32.06c6.62,0,12.55,1.5,16.48,3.86"/>
				<path d="M44.29,8.53c-3.93,2.37-9.86,3.88-16.49,3.88S15.25,10.9,11.31,8.54"/>
				<line x1="27.8" y1="0.85" x2="27.8" y2="34.61"/>
				<line x1="15.2" y1="22.23" x2="49.15" y2="22.23"/>
			</g>
			<path
				className="PhoneInputInternationalIconPhone"
				stroke="transparent"
				fill="currentColor"
				d="M9.42,26.64c2.22-2.22,4.15-3.59.22-8.49S3.08,17,.93,19.17c-2.49,2.48-.13,11.74,9,20.89s18.41,11.5,20.89,9c2.15-2.15,5.91-4.77,1-8.71s-6.27-2-8.49.22c-1.55,1.55-5.48-1.69-8.86-5.08S7.87,28.19,9.42,26.64Z"/>
		</svg>
	)
}

InternationalIcon1x1.propTypes = {
	title: PropTypes.string.isRequired
}

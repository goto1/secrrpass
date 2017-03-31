import React from 'react';

const passOptionsStyle = {
	background: '#96B81C',
	position: 'absolute',
	right: '0',
	top: '20px',
	width: '155px',
	height: '50px',
	marginRight: '20px',
	borderRadius: '500px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	transition: 'all 0.5s ease-in-out',
	transform: 'translateX(180px)',
};

const passOptionsActiveStyle = {
	...passOptionsStyle,
	transform: 'translateX(10px)',
};

const iconStyle = {
	display: 'block',
	fontSize: '1.25em',
	color: '#CAFE00',
	cursor: 'pointer',
};

const spacerStyle = {
	margin: '0 10px 0 10px',
	fontSize: '2.5em',
	color: '#779902',
};

export default (props) => {
	const style = props.show ? passOptionsActiveStyle : passOptionsStyle;
	return (
		<div style={style}>
			<i className="fa fa-clipboard" aria-hidden="true" style={iconStyle} />
			<span style={spacerStyle}>|</span>
			<i className="fa fa-pencil" aria-hidden="true" style={iconStyle} />
			<span style={spacerStyle}>|</span>
			<i className="fa fa-trash-o" aria-hidden="true" style={iconStyle} />
		</div>
	);
};
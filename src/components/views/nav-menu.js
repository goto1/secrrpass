import React from 'react';

const navStyle = {
	display: 'flex',
	justifyContent: 'space-around',
	paddingTop: '12.5px',
	position: 'absolute',
	width: '100%',
};

const navItemStyle = {
	background: '#F35138',
	fontSize: '1.5em',
	padding: '5px 0px 2.5px 0px',
	borderRadius: '500px',
	color: '#F1F1F4',
	width: '65px',
	textAlign: 'center',
	boxShadow: '0 0 2.5px 4px #75353C',
};

const NavItem = ({ type }) => (
	<div style={navItemStyle}>
		<i className={`fa fa-${type}`} aria-hidden='true'></i>
	</div>
);

export default () => (
	<div style={navStyle}>
		<NavItem type='home' />
		<NavItem type='plus' />
		<NavItem type='info' />
	</div>
);
import React from 'react';
import { Link } from 'react-router-dom';

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
	cursor: 'pointer',
};

const NavItem = ({ type }) => (
	<div style={navItemStyle}>
		<i className={`fa fa-${type}`} aria-hidden='true'></i>
	</div>
);

const NavigationMenu = () => {
	const userID = localStorage.getItem('userID') || '';

	return (
		<div style={navStyle}>
			<Link to={userID ? `/${userID}` : '/'}>
				<NavItem type='home' />
			</Link>
			<Link to='/add'>
				<NavItem type='plus' />
			</Link>
			<Link to='/settings'>
				<NavItem type='user' />
			</Link>
		</div>
	);
}

export default NavigationMenu;
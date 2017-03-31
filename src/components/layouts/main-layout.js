import React from 'react';
import Header from '../containers/header';
import PasswordList from '../views/password-list';

const mainLayoutStyle = {
	background: '#1C1F41',
	width: '375px',
	height: '667px',
	borderRadius: '5px',
	boxShadow: '0 0 40px 1px black',
	overflow: 'hidden',
	position: 'relative',
};

const mainContentStyle = {
	overflowY: 'scroll',
	padding: '5px 0 0 0',
	height: '81.5%',
};

export default (props) => {
	return (
		<div style={mainLayoutStyle}>
			<Header />
			<div style={mainContentStyle}>
				<PasswordList />
			</div>
		</div>
	);
};
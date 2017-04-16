import React from 'react';
import { Route } from 'react-router-dom';
import Header from '../containers/header';
import PasswordList from '../containers/password-list';
import AddPassword from '../containers/add-password';
import Settings from '../settings';

const layoutStyle = {
	background: '#1C1F41',
	width: '375px',
	height: '667px',
	borderRadius: '5px',
	boxShadow: '0 0 20px 5px #323332',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
};

const MainLayout = () => (
	<div style={layoutStyle}>
		<Header />
		<div style={{
			overflowY: 'scroll',
			paddingTop: '5px',
			height: '100%',
		}}>
			<Route exact path="/:userID?" component={PasswordList} />
			<Route path="/:userID?/add" component={AddPassword} />
			<Route path="/:userID?/settings" component={Settings} />
		</div>
	</div>
);

export default MainLayout;
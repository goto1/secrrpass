import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from '../containers/header';
import PasswordList from '../containers/password-list';
import AddPassword from '../containers/add-password';
import Settings from '../settings';

const styles = {
	layout: {
		background: '#1C1F41',
		width: '375px',
		height: '667px',
		borderRadius: '5px',
		boxShadow: '0 0 20px 5px #323332',
		overflow: 'hidden',
		display: 'flex',
		flexDirection: 'column',
	},
	content: {
		overflowY: 'scroll',
		paddingTop: '5px',
		height: '100%',
	},
};

const MainLayout = () => (
	<div style={styles.layout}>
		<Header />
		<div style={styles.content}>
			<Switch>
				<Route exact path="/" component={PasswordList} />
				<Route path="/add" component={AddPassword} />
				<Route path="/settings" component={Settings} />
				<Route path="/:userID" component={PasswordList} />
			</Switch>
		</div>
	</div>
);

export default MainLayout;

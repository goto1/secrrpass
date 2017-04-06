import React from 'react';
import { 
	BrowserRouter as Router,
	Route
} from 'react-router-dom';
import Header from '../containers/header';
import PasswordList from '../views/password-list';
import AddPassword from '../add-password';

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
	<Router>
		<div style={layoutStyle}>
			<Header />
			<div style={{
				overflowY: 'scroll',
				paddingTop: '5px',
			}}>
				<Route exact path="/" component={PasswordList} />
				<Route path="/add" component={AddPassword} />
				<Route path="/info" render={() => (
					<h1>Hi</h1>
				)} />
			</div>
		</div>
	</Router>
);

export default MainLayout;
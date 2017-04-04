import React from 'react';
import Header from '../containers/header';
import PasswordList from '../views/password-list';

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
		}}>
			<PasswordList />
		</div>
	</div>
);

export default MainLayout;
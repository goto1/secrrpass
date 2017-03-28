import React from 'react';
import '../styles/MainLayout.css';

function MainLayout(props) {
	return (
		<div className="MainLayout">
			<div className="Header">
				<div className="AppIcon">
					<i className="fa fa-shield" aria-hidden="true"></i>
				</div>
				<div className="AppTitle">
					<span className="title">secrrpass</span>
					<span className="appInfo">Password management made simple.</span>
				</div>
				<div className="MenuButton">
					<i className="fa fa-ellipsis-v" aria-hidden="true"></i>
				</div>
			</div>
		</div>
	);
}

export default MainLayout;
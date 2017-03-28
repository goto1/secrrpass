import React from 'react';
import '../styles/MainLayout.css';

function PasswordIcon(props) {
	return (
		<div className="PasswordIcon">
			<i className={props.icon} aria-hidden="true"></i>
		</div>
	);
}

function PasswordDetails(props) {
	return (
		<div className="PasswordDetails">
			<div className="Name">
				{props.name}
			</div>
			<div className="UserAccount">
				{props.userAccount}
			</div>
		</div>
	);
}

function PasswordItem(props) {
	return (
		<div className="PasswordItem">
			<PasswordIcon icon="fa fa-lock" />
			<PasswordDetails
				name={props.name}
				userAccount={props.userAccount} />
		</div>
	);
}

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
			<div className="MainContent">
				<div className="PasswordList">
					<PasswordItem 
						name="Google"
						userAccount="jsmith@gmail.com" />
					<PasswordItem 
						name="Angie's list"
						userAccount="jaredsmith.4249@gmail.com" />
					<PasswordItem 
						name="Apple ID"
						userAccount="johnpatrick@gmail.com" />
					<PasswordItem 
						name="Amazon Web Services"
						userAccount="michaellee@gmail.com" />
					<PasswordItem 
						name="Amazon Web Services 3"
						userAccount="justinbeiber@gmail.com" />
					<PasswordItem 
						name="Amazon Web Services 1"
						userAccount="whosyourcapitan@gmail.com" />
					<PasswordItem 
						name="Amazon Web Services 2"
						userAccount="iamthecapitan@gmail.com" />
					<PasswordItem 
						name="Amazon Web Services 4"
						userAccount="okdude@gmail.com" />
				</div>
			</div>
		</div>
	);
}

export default MainLayout;
import React, { Component } from 'react';
import '../styles/MainLayout.css';

const passwordItems = [
	{ id: 1, name: 'Yahoo', username: 'jsmith@yahoo.com' },
	{ id: 2, name: 'Google', username: 'johnny@gmail.com' },
	{ id: 3, name: 'Amazon', username: 'drpepper@gmail.com' },
	{ id: 4, name: 'Apple', username: 'willywonka@aol.com' },
	{ id: 5, name: 'AT&T', username: 'jsmith@gmail.com' },
	{ id: 6, name: 'Bank of America', username: 'jsmith39993' },
	{ id: 7, name: 'Wells Fargo', username: 'jw4888' },
	{ id: 8, name: 'Capital One', username: 'jsmithcap2' },
];

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

function RevealPasswordItemOptionsButton(props) {
	return (
		<div className="RevealPasswordItemOptionsButton"
			onClick={props.revealPasswordOptions} >
			<i 
				className="fa fa-chevron-right" 
				aria-hidden="true" />
		</div>
	);
}

function PasswordOptions(props) {
	const styles = props.display ?
		'PasswordOptions PasswordOptionsShow' : 'PasswordOptions';
	return (
		<div className={styles}>
			<i className="fa fa-clipboard" aria-hidden="true"></i>
			<span className="spacer">|</span>
			<i className="fa fa-pencil" aria-hidden="true"></i>
			<span className="spacer">|</span>
			<i className="fa fa-trash-o" aria-hidden="true"></i>
		</div>
	);
}

class PasswordListItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showOptions: false,
		};
		this.revealPasswordOptions = this.revealPasswordOptions.bind(this);
	}

	revealPasswordOptions(event) {
		this.setState({
			showOptions: !this.state.showOptions
		});
	}

	render() {
		return (
			<div className="PasswordListItem">
				<PasswordItem
					name={this.props.name}
					userAccount={this.props.username}
					moveToLeft={this.state.showOptions} 
					revealPasswordOptions={this.revealPasswordOptions} />
				<PasswordOptions display={this.state.showOptions} />
			</div>
		);
	}
}

function PasswordItem(props) {
	const styles = props.moveToLeft ?
		'PasswordItem PasswordItemMoveToLeft' : 'PasswordItem';
	return (
		<div className={styles}>
			<PasswordIcon icon="fa fa-lock" />
			<PasswordDetails
				name={props.name}
				userAccount={props.userAccount} />
			<RevealPasswordItemOptionsButton
				revealPasswordOptions={props.revealPasswordOptions} />
		</div>
	);
}

function PasswordList(props) {
	const passwords = passwordItems.map((password, index) => 
		<PasswordListItem
			key={password.id.toString()}
			name={password.name}
			username={password.username} />
	);
	return (
		<div className="PasswordList">
			{passwords}
		</div>
	);
}

class Header extends Component {
	constructor(props) {
		super(props);

		this.state = { showNavigation: false };
		this.toggleNavigation = this.toggleNavigation.bind(this);
	}

	toggleNavigation(event) {
		this.setState({ showNavigation: !this.state.showNavigation });
	}

	render() {
		return (
			<div className="Header">
				<div className="FirstRow">
					<AppIcon />
					<AppTitle />
					<MenuButton
						active={this.state.showNavigation} 
						toggleNavigation={this.toggleNavigation}/>
				</div>
				<NavigationMenu 
					active={this.state.showNavigation} />
			</div>
		);
	}
}

function AppTitle(props) {
	return (
		<div className="AppTitle">
			<span className="title">secrrpass</span>
			<span className="appInfo">
				Password management made simple.
			</span>
		</div>
	);
}

function NavigationMenu(props) {
	const styles = props.active ?
		'NavigationMenu NavigationMenuActive' : 'NavigationMenu';
	return (
		<div className={styles}>
			<div className="MenuItem">
				<i className="fa fa-home" aria-hidden="true"></i>
			</div>
			<div className="MenuItem">
				<i className="fa fa-plus" aria-hidden="true"></i>
			</div>
			<div className="MenuItem">
				<i className="fa fa-info" aria-hidden="true"></i>
			</div>
		</div>
	);
}

function MenuButton(props) {
	const styles = props.active ?
		'MenuButton MenuButtonActive' : 'MenuButton';
	return (
		<div className={styles} onClick={props.toggleNavigation}>
			<i className="fa fa-ellipsis-v" aria-hidden="true" />
		</div>
	);
}

function AppIcon(props) {
	return (
		<div className="AppIcon">
			<i className="fa fa-shield" aria-hidden="true"></i>
		</div>
	);
}

function MainLayout(props) {
	return (
		<div className="MainLayout">
			<Header />
			<div className="MainContent">
				<PasswordList />
			</div>
		</div>
	);
}

export default MainLayout;

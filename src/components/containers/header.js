import React, { Component } from 'react';
import NavigationMenu from '../views/nav-menu';
import MenuButton from '../views/menu-button';

const headerStyle = {
	padding: '10px 0 10px 0',
	height: 'auto',
};

const headerRowStyle = {
	display: 'flex',
	justifyContent: 'space-around',
	alignItems: 'center',
	color: '#F1F1F4',
};

const appIconStyle = {
	fontSize: '2em',
	transform: 'rotate(-0.05turn)',
	color: '#EE1959'
};

const appTitleStyle = {
	background: '#F1F1F4',
	borderRadius: '500px',
	flexBasis: '55%',
	color: '#1C1F41',
	padding: '5px 20px 5px 20px',
	maxHeight: '48px',
	overflow: 'hidden'
};

const titleStyle = {
	fontWeight: '500',
	fontSize: '1.10em',
	display: 'block',
	textTransform: 'uppercase',
	letterSpacing: '1.15px',
};

const appInfoStyle = {
	fontSize: '.75em',
	fontWeight: '300',
};

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
			<div style={headerStyle}>
				<div style={headerRowStyle}>
					<div style={appIconStyle}>
						<i className="fa fa-shield" aria-hidden="true"></i>
					</div>
					<div style={appTitleStyle}>
						<span style={titleStyle}>
							secrrpass
						</span>
						<span style={appInfoStyle}>
							Password management made simple.
						</span>
					</div>
					<MenuButton
						active={this.state.showNavigation}
						toggleNavigation={this.toggleNavigation} />
				</div>
				<NavigationMenu
					active={this.state.showNavigation} />
			</div>
		);
	}
}

export default Header;
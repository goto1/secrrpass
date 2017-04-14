import React, { Component } from 'react';
import NavigationMenu from '../views/nav-menu';
import MenuButton from '../views/menu-button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './header.css';

const Logo = () => (
	<div className="Logo">
		<i className="fa fa-shield" aria-hidden="true" />
	</div>
);

const AppTitle = () => (
	<div className="AppTitle">
		<span>secrrpass</span>
		<span>Password management made simple.</span>
	</div>
);


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
		const navigation = 
			<NavigationMenu key={'1'} active={this.state.showNavigation} />;
		const style = 
			this.state.showNavigation ? 'Header expand' : 'Header';
		return (
			<div className={style}>
				<div className="row">
					<Logo />
					<AppTitle />
					<MenuButton
						active={this.state.showNavigation}
						toggleNavigation={this.toggleNavigation} />
				</div>
				<ReactCSSTransitionGroup
					transitionName="nav-transition"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{ this.state.showNavigation && navigation }
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default Header;

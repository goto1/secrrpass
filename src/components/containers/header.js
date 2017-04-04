import React, { Component } from 'react';
import NavigationMenu from '../views/nav-menu';
import MenuButton from '../views/menu-button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './header.css';

const Logo = () => (
	<div style={{
		fontSize: '2em',
		animation: 'logo-spin 7500ms infinite linear',
		color: '#EE1959',
		marginLeft: '5px',
	}}><i className="fa fa-shield" aria-hidden="true" /></div>
);

const AppTitle = () => (
	<div style={{
		background: '#F1F1F4',
		borderRadius: '500px',
		flexBasis: '55%',
		color: '#1C1F41',
		padding: '5px 20px 5px 20px',
		maxHeight: '48px',
		overflow: 'hidden',
	}}>
		<span style={{
			fontWeight: '500',
			fontSize: '1.1em',
			display: 'block',
			textTransform: 'uppercase',
			letterSpacing: '1.15px'
		}}>secrrpass</span>
		<span style={{
			fontSize: '.75em',
			fontWeight: '300'
		}}>Password management made simple.</span>
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
					transitionName="example"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}>
					{ this.state.showNavigation && navigation }
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default Header;


// { this.state.showNavigation && navigation }
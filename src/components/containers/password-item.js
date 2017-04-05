import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PasswordDetails from '../views/password-details.js';
import PasswordOptions from '../views/password-options.js';
import './password-item.css';

const passItemStyle = {
	display: 'flex',
	position: 'relative',
	overflow: 'hidden',
	padding: '10px 0',
};

class PasswordItem extends Component {
	constructor(props) {
		super(props);
		this.state = { showOptions: false };
		this.showPassOptions = this.showPassOptions.bind(this);
	}

	showPassOptions(event) {
		this.setState({ showOptions: !this.state.showOptions });
	}

	render() {
		const passOptions = <PasswordOptions key={'1'} />
		return (
			<div style={passItemStyle}>
				<PasswordDetails 
					style={passItemStyle}
					serviceName={this.props.password.name}
					userName={this.props.password.username}
					active={this.state.showOptions}
					showOptions={this.showPassOptions} />
				<ReactCSSTransitionGroup
					transitionName="showOptions"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{this.state.showOptions && passOptions}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default PasswordItem;
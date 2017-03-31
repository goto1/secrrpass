import React, { Component } from 'react';
import PasswordDetails from '../views/password-details.js';
import PasswordOptions from '../views/password-options.js';

const passItemStyle = {
	display: 'flex',
	position: 'relative',
	overflow: 'hidden',
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
		return (
			<div style={passItemStyle}>
				<PasswordDetails 
					style={passItemStyle}
					name={this.props.name}
					login={this.props.login}
					active={this.state.showOptions}
					showOptions={this.showPassOptions} />
				<PasswordOptions 
					show={this.state.showOptions} />
			</div>
		);
	}
}

export default PasswordItem;
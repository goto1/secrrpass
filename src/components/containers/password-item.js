import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PasswordOptions from '../views/password-options.js';
import './password-item.css';

const ItemIcon = ({ hide }) => {
	const classes = hide ? 'ItemIcon ItemIconHidden' : 'ItemIcon';
	return (
		<div className={classes}>
			<i className="fa fa-lock" />
		</div>
	);
};

const ServiceName = ({ name }) => 
	<div className="ServiceName">{name}</div>;

const UserName = ({ user }) => 
	<div className="UserName">{user}</div>;

const ShowPassOptionsBtn = ({ toggleOptions }) =>
	<div className="ShowPassOptionsBtn" onClick={toggleOptions}>
		<i className="fa fa-chevron-right" aria-hidden="true" />
	</div>;

const Overview = ({ serviceName, userName, showOptions }) => {
	const classes = showOptions ? 'Overview OverviewShort' : 'Overview';
	return (
		<div className={classes}>
			<ServiceName name={serviceName} />
			<UserName user={userName} />
		</div>
	);
};

const PasswordDetails = (props) => {
	const { active, serviceName, userName, toggleOptions } = props;
	const classes = active ? 'PasswordDetails PasswordDetailsShrink' : 'PasswordDetails';
	return (
		<div className={classes}>
			<ItemIcon hide={active} />
			<Overview 
				serviceName={serviceName}
				userName={userName}
				showOptions={active} />
			<ShowPassOptionsBtn toggleOptions={toggleOptions} />
		</div>
	);
}

class PasswordItem extends Component {
	constructor(props) {
		super(props);
		this.state = { showOptions: false };
		this.toggleOptions = this.toggleOptions.bind(this);
	}

	toggleOptions() {
		this.setState({ showOptions: !this.state.showOptions });
	}

	render() {
		const passOptions = <PasswordOptions key={'1'} />;
		return (
			<div className="PasswordItem">
				<PasswordDetails 
					serviceName={this.props.password.name}
					userName={this.props.password.username}
					active={this.state.showOptions}
					toggleOptions={this.toggleOptions} />
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
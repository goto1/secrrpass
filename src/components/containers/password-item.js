import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PasswordOptions from './password-options.js';
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
	const { serviceName, userName, toggleOptions, hideIcon } = props;
	const classes = hideIcon ? 'PasswordDetails PasswordDetailsShrink' : 'PasswordDetails';
	return (
		<div className={classes}>
			<ItemIcon hide={hideIcon} />
			<Overview
				serviceName={serviceName}
				userName={userName}
				showOptions={hideIcon} />
			<ShowPassOptionsBtn toggleOptions={toggleOptions} />
		</div>
	);
};

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
		const { serviceName, userName, id } = this.props;
		const passOptions = <PasswordOptions key={id} id={id} />;
		return (
			<div className="PasswordItem">
				<PasswordDetails 
					serviceName={serviceName}
					userName={userName}
					hideIcon={this.state.showOptions}
					toggleOptions={this.toggleOptions} />
				<ReactCSSTransitionGroup
					transitionName="show-options"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}>
					{this.state.showOptions && passOptions}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default PasswordItem;
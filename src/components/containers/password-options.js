import React, { Component } from 'react';
import { Redirect } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

function Spacer() {
	const styles = {
		margin: '0 10px',
		fontSize: '40px',
		color: '#779902',
	};

	return (
		<span style={styles}>|</span>
	);
}

function Option({ icon, onClick }) {
	const styles = {
		display: 'block',
		fontSize: '22.5px',
		color: '#CAFE00',
		cursor: 'pointer',
	};
	const iconType = `fa fa-${icon}`;

	return (
		<div style={styles}>
			<i 
				className={iconType}
				aria-hidden='true'
				onClick={onClick} 
			/>
		</div>
	);
}

function ActionButton({ name, action, goBack }) {
	const styles = {
		container: {
			background: '#F15B3F',
			color: '#F3F3F5',
			width: '100%',
			height: '52.5px',
			display: 'flex',
			alignItems: 'center',
			borderRadius: '500px',
			position: 'absolute',
			top: '0',
			fontSize: '20px',
			textTransform: 'uppercase',
			justifyContent: 'center',
			zIndex: '1',
		},
		icon: {
			cursor: 'pointer',
			flexBasis: '15%',
			textAlign: 'center',
		},
		action: {
			cursor: 'pointer',
			flexBasis: '65%',
			overflow: 'hidden',
			textAlign: 'center',
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.icon}>
				<i
					className='fa fa-chevron-left'
					aria-hidden='true'
					onClick={goBack} 
				/>
			</div>
			<div 
				style={styles.action} 
				onClick={action}>
					{name}
			</div>
		</div>
	);
}

class PasswordOptions extends Component {
	constructor(props) {
		super(props);

		this.state = {
			buttons: {
				delete: {
					name: 'Delete',
					action: this.delete.bind(this),
					goBack: this.showAllOptions.bind(this),
				},
				copy: {
					name: 'Copy',
					action: this.copy.bind(this),
					goBack: this.showAllOptions.bind(this),
				},
			},
			displayCopyBtn: false,
			displayDeleteBtn: false,
			displayEditForm: false,
		};

		this.copy = this.copy.bind(this);
		this.edit = this.edit.bind(this);
		this.delete = this.delete.bind(this);
		this.showCopyBtn = this.showCopyBtn.bind(this);
		this.showDeleteBtn = this.showDeleteBtn.bind(this);
		this.showAllOptions = this.showAllOptions.bind(this);
	}

	showAllOptions() {
		this.setState({
			displayCopyBtn: false,
			displayDeleteBtn: false,
		});
	}

	showCopyBtn() {
		this.setState({ 
			displayCopyBtn: !this.state.showCopyBtn, 
			displayDeleteBtn: false 
		});
	}

	showDeleteBtn() {
		this.setState({
			displayCopyBtn: false,
			displayDeleteBtn: !this.state.showDeleteBtn,
		});
	}

	copy() {
		const { id } = this.props;
		console.log(`password with id of ${id} was copied...`);
	}

	edit() {
		this.setState({ displayEditForm: true });
	}

	delete() {
		const { id, deletePassword } = this.props;

		deletePassword(id);
	}

	getStyles() {
		return {
			container: {
				position: 'absolute',
				top: '16px',
				marginLeft: '12.5px',
			},
			options: {
				background: '#96B81C',
				width: '157.5px',
				height: '52.5px',
				borderRadius: '500px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			},
		};
	}

	render() {
		const styles = this.getStyles();
		const showCopyBtn = this.showCopyBtn;
		const showDeleteBtn = this.showDeleteBtn;
		const edit = this.edit;
		const passwordID = this.props.id;
		const { 
			displayDeleteBtn, displayCopyBtn, 
			displayEditForm, buttons } = this.state;

		if (displayEditForm) {
			const url = `/edit/${passwordID}`;

			return <Redirect to={url} />;
		}

		return (
			<div style={styles.container}>
				<div style={styles.options}>
					<Option icon='clipboard' onClick={showCopyBtn} />
					<Spacer />
					<Option icon='pencil' onClick={edit} />
					<Spacer />
					<Option icon='trash-o' onClick={showDeleteBtn} />
				</div>

				<ReactCSSTransitionGroup
					transitionName='action-btn'
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
						{	displayCopyBtn &&
							<ActionButton key={'1'} {...buttons.copy} /> }
				</ReactCSSTransitionGroup>
				<ReactCSSTransitionGroup
					transitionName='action-btn'
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
						{	displayDeleteBtn &&
							<ActionButton key={'2'} {...buttons.delete} /> }
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default PasswordOptions;

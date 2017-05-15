import React, { Component } from 'react';
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

function ActionButton({ name, action, goBack}) {
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
			showCopyBtn: false,
			showDeleteBtn: false,
		};
		this.onCopy = this.onCopy.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.showCopyBtn = this.showCopyBtn.bind(this);
		this.showDeleteBtn = this.showDeleteBtn.bind(this);
		this.showAllOptions = this.showAllOptions.bind(this);
	}

	showAllOptions() {
		this.setState({
			showCopyBtn: false,
			showDeleteBtn: false,
		});
	}

	showCopyBtn() {
		this.setState({ 
			showCopyBtn: !this.state.showCopyBtn, 
			showDeleteBtn: false 
		});
	}

	showDeleteBtn() {
		this.setState({
			showCopyBtn: false,
			showDeleteBtn: !this.state.showDeleteBtn,
		});
	}

	onCopy() {
		const { id } = this.props;
		console.log(`password (${id}) copy action`);
	}

	onEdit() {
		const { id } = this.props;

		console.log(`password (${id}) edit action`);
	}

	onDelete() {
		const { id, deletePassword } = this.props;

		deletePassword(id);
	}

	render() {
		const buttons = {
			delete: {
				name: 'Delete',
				action: this.onDelete,
				goBack: this.showAllOptions,
			},
			copy: {
				name: 'Copy',
				action: this.onCopy,
				goBack: this.showAllOptions,
			},
		};

		return (
			<div className="Options">
				<div className="PasswordOptions">
					<Option icon="clipboard" onClick={this.showCopyBtn} />
					<Spacer />
					<Option icon="pencil" onClick={this.onEdit} />
					<Spacer />
					<Option icon="trash-o" onClick={this.showDeleteBtn} />
				</div>
				<ReactCSSTransitionGroup
					transitionName="action-btn"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
					{this.state.showCopyBtn && <ActionButton key={'1'} {...buttons.copy} />}
				</ReactCSSTransitionGroup>
				<ReactCSSTransitionGroup
					transitionName="action-btn"
					transitionEnterTimeout={300}
					transitionLeaveTimeout={300}>
					{this.state.showDeleteBtn && <ActionButton key={'2'} {...buttons.delete} />}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default PasswordOptions;

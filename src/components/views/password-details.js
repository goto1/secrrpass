import React from 'react';

const LockIcon = () => (
	<div style={{
		fontSize: '1.65em',
		padding: '0 25px',
		color: '#F1F1F4',
	}}><i className="fa fa-lock"></i></div>
);

const ServiceName = ({ serviceName, optionsShown }) => {
	let styles = {
		fontSize: '1.15em',
		color: '#EE1959',
		fontWeight: '400',
		marginBottom: '5px',
		transition: 'all 500ms ease-in-out',
	};
	styles = optionsShown ? {...styles, fontSize: '.95em'} : styles;
	return (
		<div style={styles}>{serviceName}</div>
	);
}

const UserName = ({ userName, optionsShown }) => {
	let styles = {
		color: '#F1F1F4',
		fontSize: '.95em',
		fontWeight: '300',
		transition: 'all 500ms ease-in-out',
	};
	styles = optionsShown ? 
		{...styles, opacity: '.4', fontSize: '.85em'} : styles;
	return (
		<div style={styles}>{userName}</div>
	);
}

const ShowPasswordOptions = ({ showOptions }) => (
	<div style={{
		fontSize: '1.15em',
		color: '#F1F1F4',
		padding: '2.5px 7.5px',
		cursor: 'pointer',
	}} onClick={showOptions}>
		<i className='fa fa-chevron-right' aria-hidden='true'></i>
	</div>
);

const PasswordOverview = ({ serviceName, userName, optionsShown }) => {
	let styles = {
		display: 'flex',
		flexDirection: 'column',
		flexBasis: '72.5%',
		transition: 'flex-basis 500ms ease-in-out',
		overflow: 'hidden',
	};
	styles = optionsShown ? 
		{...styles, flexBasis: '47.5%'} : styles;
	return (
		<div style={styles}>
			<ServiceName 
				serviceName={serviceName} 
				optionsShown={optionsShown} />
			<UserName 
				userName={userName} 
				optionsShown={optionsShown} />
		</div>
	);
};

const PasswordDetails = (props) => {
	let styles = {
		display: 'flex',
		alignItems: 'center',
		background: '#282F5B',
		height: '85px',
		width: '95%',
		borderRadius: '0 500px 500px 0',
		marginLeft: '2.5px',
		letterSpacing: '1.65px',
		position: 'relative',
		transition: 'width 500ms ease-in-out',
	};
	styles = props.active ? {...styles, width: '50%'} : styles;
	return (
		<div style={styles}>
			<LockIcon />
			<PasswordOverview
				serviceName={props.serviceName}
				userName={props.userName}
				optionsShown={props.active} />
			<ShowPasswordOptions showOptions={props.showOptions} />
		</div>
	);
}

export default PasswordDetails;

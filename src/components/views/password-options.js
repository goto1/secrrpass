import React from 'react';

const Spacer = () => (
	<span style={{
		margin: '0 10px',
		fontSize: '2.5em',
		color: '#779902',
	}}>|</span>
);

const Option = ({ icon }) => {
	const className = `fa fa-${icon}`;
	return (
		<div style={{
			display: 'block',
			fontSize: '1.25em',
			color: '#CAFE00',
			cursor: 'pointer',
		}}>
			<i className={className} aria-hidden="true"></i>
		</div>
	);
}

const styles = {
	background: '#96B81C',
	position: 'absolute',
	right: '-10px',
	top: '25px',
	width: '155px',
	height: '50px',
	marginRight: '20px',
	borderRadius: '500px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

const PasswordOptions = () => (
	<div style={styles}>
		<Option icon="clipboard" />
		<Spacer />
		<Option icon="pencil" />
		<Spacer />
		<Option icon="trash-o" />
	</div>
);

export default PasswordOptions;

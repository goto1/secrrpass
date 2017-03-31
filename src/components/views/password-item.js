import React from 'react';

const passItemStyle = {
	display: 'flex',
	alignItems: 'center',
	background: '#282F5B',
	height: '85px',
	width: '95%',
	borderRadius: '0 500px 500px 0',
	marginLeft: '2.5px',
	letterSpacing: '1.65px',
	margin: '0 0 15px 0',
	position: 'relative',
	transition: 'transform .5s ease-in-out',
};

const passItemActive = {
	...passItemStyle,
	transform: 'translateX(-50%)',
};

const passIconStyle = {
	fontSize: '1.65em',
	padding: '0 25px 0 25px',
	color: '#F1F1F4',
};

const passDetailsStyle = {
	display: 'flex',
	flexDirection: 'column',
};

const passNameStyle = {
	fontSize: '1.15em',
	color: '#EE1959',
	fontWeight: '400',
	marginBottom: '5px',
};

const passUserAccStyle = {
	color: '#F1F1F4',
	fontSize: '.95em',
	fontWeight: '300',
};

const showPassOptsBtn = {
	position: 'absolute',
	right: '10px',
	fontSize: '1.15em',
	top: '40%',
	color: '#F1F1F4',
	padding: '0 0 0 10px',
	cursor: 'pointer',
};

function PasswordItem(props) {
	const styles = props.active ? passItemActive : passItemStyle;
	return (
		<div style={styles}>
			<div style={passIconStyle}>
				<i className="fa fa-lock" />
			</div>
			<div style={passDetailsStyle}>
				<div style={passNameStyle}>
					{props.name}
				</div>
				<div style={passUserAccStyle}>
					{props.userAccount}
				</div>
			</div>
			<div style={showPassOptsBtn} onClick={props.revealPasswordOptions} >
				<i className="fa fa-chevron-right" aria-hidden="true"></i>
			</div>
		</div>
	);
}

export default PasswordItem;
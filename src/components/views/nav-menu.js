import React from 'react';

const navMenuStyle = {
	display: 'flex',
	justifyContent: 'space-around',
	width: '99.5%',
	margin: '15px 0 0 0',
	// transition: 'all .5s ease-in-out',
	// transform: 'translateX(-350px)'
}

// const navMenuActiveStyle = {
// 	...navMenuStyle,
// 	transform: 'translateX(0)',
// };

const menuItemStyle = {
	background: '#F35138',
	fontSize: '1.5em',
	padding: '5px 0px 2.5px 0px',
	borderRadius: '500px',
	color: '#F1F1F4',
	width: '65px',
	textAlign: 'center',
	boxShadow: '0 0 2.5px 4px #75353C',
};

function NavigationMenu(props) {
	// const styles = props.active ? navMenuActiveStyle : navMenuStyle;
	const styles = navMenuStyle;
	return (
		<div style={styles}>
			<div style={menuItemStyle}>
				<i className="fa fa-home" aria-hidden="true"></i>
			</div>
			<div style={menuItemStyle}>
				<i className="fa fa-plus" aria-hidden="true"></i>
			</div>
			<div style={menuItemStyle}>
				<i className="fa fa-info" aria-hidden="true"></i>
			</div>
		</div>
	);
}

export default NavigationMenu;
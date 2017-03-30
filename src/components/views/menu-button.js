import React from 'react';

const menuBtnStyle = {
	fontSize: '1.85em',
	padding: '0 5px 0 5px',
	cursor: 'pointer',
	transition: 'transform .5s ease-in-out',
};

const menuBtnActiveStyles = {
	...menuBtnStyle,
	transform: 'rotate(-90deg)',
};

function MenuButton(props) {
	const styles = props.active ? menuBtnActiveStyles : menuBtnStyle;
	return (
		<div 
			style={styles}
			onClick={props.toggleNavigation}>
			<i className="fa fa-ellipsis-v" aria-hidden="true"></i>
		</div>
	);
}

export default MenuButton;
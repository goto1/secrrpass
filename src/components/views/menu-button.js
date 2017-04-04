import React from 'react';

const style = {
	fontSize: '1.85em',
	padding: '0 7.5px',
	cursor: 'pointer',
	transition: 'transform .5s ease-in-out',
};

const styleActive = {
	...style,
	transform: 'rotate(-90deg)',
};

const MenuButton = ({ active, toggleNavigation }) => {
	const styles = active ? styleActive : style;
	return (
		<div 
			style={styles}
			onClick={toggleNavigation}>
			<i className="fa fa-ellipsis-v" aria-hidden="true"></i>
		</div>
	);
}

export default MenuButton;
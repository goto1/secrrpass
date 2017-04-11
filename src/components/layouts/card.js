import React from 'react';

const CardStyles = {
	background: '#2D3665',
	width: '85%',
	margin: '0 auto',
	marginBottom: '20px',
	borderRadius: '7.5px',
	padding: '15px',
	overflow: 'hidden'
};

const HeadingStyles = {
	margin: '0 0 20px 0',
	textTransform: 'uppercase',
	fontSize: '25px',
	paddingBottom: '5px',
	borderBottom: '3px solid #F11C64',
	color: '#F3F3F5',
	fontWeight: '300',
	letterSpacing: '1.5px',
};

const Card = ({ heading, children }) => (
	<div style={CardStyles}>
		<h2 style={HeadingStyles}>
			{heading}
		</h2>
		{children}
	</div>
);

export default Card;
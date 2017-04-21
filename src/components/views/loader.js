import React from 'react';
import './loader.css';

const Loader = () => (
	<div className="container">
		<div className="flex">
			<div className="loader"></div>
		</div>
		<div className="load-text">
			Loading...
		</div>
	</div>
);

export default Loader;
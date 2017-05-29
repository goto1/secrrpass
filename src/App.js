import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import { UserUtils } from './utils/utils';
import './App.css';

import './utils/rxjs-operators';

function App(props) {
	UserUtils.logout(); // cleanup any existing sessions

	return (
		<Router>
			<MainLayout />
		</Router>
	);
}

export default App;

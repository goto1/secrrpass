import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import './App.css';

import './utils/rxjs-operators';

const App = () => (
	<Router>
		<MainLayout />
	</Router>
);

export default App;

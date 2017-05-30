import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import './utils/rxjs-operators';
import './App.css';

function App(props) {
	return (
		<Router>
			<MainLayout />
		</Router>
	);
}

export default App;

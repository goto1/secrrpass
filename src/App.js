import React, { Component } from 'react';
import genUserID from './utils/id-generator';
import firebase from './utils/firebase';
import MainLayout from './components/layouts/main-layout';
import './App.css';

class App extends Component {

	componentWillMount() {
		const { match, history } = this.props;
		const userID = match.params.userID || genUserID();

		firebase.checkIfUserExists(userID)
			.then((user) => {
				if (user.val() === null) { 
					firebase.createNewUser(userID); 
				} else {
					firebase.updateUserLastAccess(userID);
				}
				localStorage.setItem('userID', userID);
				history.push(`/${userID}`);
			})
			.catch((err) => { console.log(err); });
	}

	render() {
		return <MainLayout />
	}
}

export default App;

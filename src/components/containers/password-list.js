import React, { Component } from 'react';
import { Redirect } from 'react-router';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import firebase from '../../utils/firebase';
import securityUtils from '../../utils/security-utils';
import genUserID from '../../utils/id-generator';
import * as _ from 'lodash';
import './password-list.css';

const NoPasswordsToShow = () => (
	<div className="NoPasswordsToShow">
		<div><i className="fa fa-frown-o" aria-hidden='true' /></div>
		<div>
			<span>Currently you do not have any saved passwords.</span>
			<span>Go ahead and a few passwords for future reference!</span>
		</div>
	</div>
);

class PasswordList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoader: true,
			passwords: null,
			newUser: false,
		};
		this.deletePassword = this.deletePassword.bind(this);
		this.getListOfPasswords = this.getListOfPasswords.bind(this);
	}

	componentWillMount() {
		const { match } = this.props;
		const userID = match.params.userID || genUserID();

		localStorage.setItem('userID', userID);

		const extractData = (data) => data.val() || null;

		firebase.checkIfUserExists(userID)
			.map(extractData)
			.subscribe(
				(user) => {
					if (!user) {
						firebase.createNewUser(userID).subscribe();
						this.setState({ newUser: true });
					} else {
						firebase.updateUserLastAccess(userID).subscribe();
					}
				},
				(err) => { console.log(err); },
			);
	}

	componentDidMount() {
		const userID = localStorage.getItem('userID');

		const extractData = (data) => data.val();
		const decryptData = (data) => {
			if (data) {
				const clone = Object.assign({}, data);
				const decrypted = {};

				Object.keys(clone).map((id) => {
					decrypted[id] = securityUtils.decrypt(clone[id]);
				});

				return decrypted;
			}

			return {};
		};

		firebase.getUserPasswords(userID)
			.map(extractData)
			.map(decryptData)
			.subscribe(
				(passwords) => { this.setState({ passwords, showLoader: false }); },
				(err) => { console.log(err); }
			);
	}

	deletePassword(passwordID) {
		const userID = localStorage.getItem('userID');

		firebase.deletePassword(userID, passwordID)
			.subscribe(
				(res) => {
					console.log(res);
					// const updatedPassword = _.remove(this.state.passwords, ())
				},
				(err) => console.log(err),
			);


	}

	getListOfPasswords() {
		const { passwords } = this.state;

		if (passwords) {
			const temp = [];

			_.forIn(passwords, (value, key) => {
				temp.push({ id: key, ...value });
			});

			return temp.map(
				password => <PasswordItem key={password.id} {...password} />
			);
		}

		return null;
	}

	render() {
		const currPath = this.props.location.pathname;
		const expectedPath = `/${localStorage.getItem('userID')}`;
		const passwordList = this.getListOfPasswords();

		// this.getListOfPasswords();

		// this.getListOfPasswords();

		// console.log(this.state.passwords);

		// if (this.state.passwords) {
		// 	const passwords = {};


		// 	const test = _.forIn(this.state.passwords, 
		// 		(value, key) => <PasswordItem key={key}
		// 	);
		// 	_.forIn(this.state.passwords, (value, key) => {

		// 		console.log('key', key);
		// 		console.log('value', value);
		// 	});

		// 	// Object.keys(this.state.passwords).map((password, idx) => {
		// 	// 	console.log(idx, password);
		// 	// });
		// }

		// // if (this.state.passwords) {
		// // 	passwordList = this.state.passwords.map(
		// // 		password => <PasswordItem key={password.id} {...password} />
		// // 	);
		// // }

		return (
			<div className="PasswordList">
				{ (currPath !== expectedPath) && <Redirect to={expectedPath} /> }

				{ this.state.showLoader && <Loader /> }

				{ passwordList ? (
					passwordList
				) : (
					<NoPasswordsToShow />
				) }
			</div>
		);
	}
}

export default PasswordList;
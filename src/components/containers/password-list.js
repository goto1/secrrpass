import React, { Component } from 'react';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import firebase from '../../utils/firebase';
import securityUtils from '../../utils/security-utils';
import genUserID from '../../utils/id-generator';
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
			passwords: [],
		}
	}

	componentWillMount() {
		const { match } = this.props;
		const userID = match.params.userID || genUserID();

		const extractData = (data) => data.val() || null;

		firebase.checkIfUserExists(userID)
			.map(extractData)
			.subscribe(
				(user) => {
					if (!user) {
						firebase.createNewUser(userID).subscribe();
					} else {
						firebase.updateUserLastAccess(userID).subscribe();
					}
					localStorage.setItem('userID', userID);
				},
				(err) => { console.log(err); },
			);
	}

	componentDidMount() {
		const userID = localStorage.getItem('userID');

		const extractData = (data) => data.val();
		const decryptData = (data) => {
			if (data) {
				return Object.keys(data).map((id) => {
					const decrypted = securityUtils.decrypt(data[id]);
					return { id, ...decrypted };
				});
			}
			return data;
		};

		firebase.getUserPasswords(userID)
			.map(extractData)
			.map(decryptData)
			.subscribe(
				(passwords) => { this.setState({ passwords, showLoader: false }); },
				(err) => { console.log(err); }
			);
	}

	render() {
		let passwordList = null;

		if (this.state.passwords) {
			passwordList = this.state.passwords.map(
				password => <PasswordItem key={password.id} {...password} />
			);
		}

		return (
			<div className="PasswordList">
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
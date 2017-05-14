import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { forIn, remove } from 'lodash';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import firebase from '../../utils/firebase';
import { generateRandomID } from '../../utils/generators';
import { handleError } from '../../utils/error-handler';
import { extractData, decryptUserPasswords } from '../../utils/response-handler';

function NoPasswords() {
	const styles = {
		container: {
			height: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column',
			color: '#F1F1F4',
			padding: '0 10px',
		},
		icon: { fontSize: '100px' },
		text: {
			fontSize: '20px',
			fontWeight: '200',
			letterSpacing: '2px',
			textAlign: 'center',
			margin: '10px 0',
			lineHeight: '25px',
		},
	};

	return (
		<div style={styles.container}>
			<div style={styles.icon}>
				<i className='fa fa-frown-o' aria-hidden='true' />
			</div>

			<div style={styles.text}>
				Currently you do not have any saved passwords.
			</div>
			<div style={styles.text}>
				Go ahead and add a few passwords for future reference!
			</div>
		</div>
	);
}

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
		const userID = match.params.userID || generateRandomID();

		localStorage.setItem('userID', userID);

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
				(err) => {
					handleError(new Error('Could not check if user exists'))
				}
			);
	}

	componentDidMount() {
		const userID = localStorage.getItem('userID');

		firebase.getUserPasswords(userID)
			.map(extractData)
			.map(decryptUserPasswords)
			.subscribe(
				(passwords) => { this.setState({ passwords, showLoader: false }); },
				(err) => { 
					handleError(new Error('Could not retrieve user\'s passwords'))
				}
			);
	}

	deletePassword(passwordID) {
		const userID = localStorage.getItem('userID');

		firebase.deletePassword(userID, passwordID)
			.subscribe(
				(res) => {
					const copyOfPasswords = Object.assign({}, this.state.passwords);
					delete copyOfPasswords[passwordID];

					this.setState({ passwords: copyOfPasswords });
				},
				(err) => {
					handleError(new Error('Could not delete user\'s saved password'));
				}
			);
	}

	getListOfPasswords() {
		const { passwords } = this.state;
		const actions = {
			deletePassword: this.deletePassword,
		};

		if (passwords) {
			const temp = [];

			forIn(passwords, (value, key) => {
				temp.push({ id: key, ...value });
			});

			return temp.map(
				password => <PasswordItem key={password.id} {...password} {...actions} />
			);
		}

		return null;
	}

	getStyles() {
		return { height: '100%' };
	}

	render() {
		const currPath = this.props.location.pathname;
		const expectedPath = `/${localStorage.getItem('userID')}`;
		const passwordList = this.getListOfPasswords();
		const styles = this.getStyles();

		return (
			<div style={styles}>
				{ (currPath !== expectedPath) && <Redirect to={expectedPath} /> }

				{ this.state.showLoader && <Loader /> }

				{ passwordList ? (
					passwordList
				) : (
					<NoPasswords />
				) }
			</div>
		);
	}
}

export default PasswordList;
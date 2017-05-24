import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { forIn } from 'lodash';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import API from '../../utils/api';
import { generateRandomID } from '../../utils/generators';
import ErrorHandler from '../../utils/error-handler';
import UserUtils from '../../utils/user';

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
		</div>
	);
}

class PasswordList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showLoader: true,
			passwords: null,
		};
		this.deletePassword = this.deletePassword.bind(this);
		this.getListOfPasswords = this.getListOfPasswords.bind(this);
	}

	componentWillMount() {
		const { match } = this.props;
		const userID = match.params.userID || generateRandomID();

		this.checkIfUserExists = API.checkIfUserExists(userID)
			.subscribe(
				(user) => {
					let passwordProtected = false;

					if (user !== null) {
						passwordProtected = user.masterPassword ? true : false;
						API.updateUserLastAccess(userID);
					} else {
						API.createNewUser(userID);
					}

					UserUtils.login({ userID, passwordProtected });
				},
				err => ErrorHandler.log({
					err: new Error(`Coudln't check if user exists`),
					location: 'password-list.js:79',
				})
			);
	}

	componentDidMount() {
		const userID = UserUtils.getUserID();

		this.getUserPasswords = API.getUserPasswords(userID)
			.subscribe(
				passwords => this.setState({ passwords, showLoader: false }),
				err => ErrorHandler.log({
					err: new Error(`Couldn't get user passwords`),
					location: 'password-list.js:94',
				})
			);
	}

	componentWillUnmount() {
		// Cleanup
		this.checkIfUserExists.unsubscribe();
		this.getUserPasswords.unsubscribe();

		if (this.deletePassword) {
			this.deletePassword.unsubscribe();
		}
	}

	deletePassword(passwordID) {
		const userID = UserUtils.getUserID();

		this.deletePassword = API.deletePassword(userID, passwordID)
			.subscribe(
				response => {
					const updatedPasswordList = { ...this.state.passwords };
					delete updatedPasswordList[passwordID];
					this.setState({ passwords: updatedPasswordList });
				},
				err => ErrorHandler.log({
					err: new Error(`Couldn't delete password`),
					location: 'password-list.js:115',
				})
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

		if (UserUtils.isAccountPasswordProtected()) {
			// Return form
			console.log('Yes');
		}

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
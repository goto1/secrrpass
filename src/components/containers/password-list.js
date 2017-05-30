import React, { Component } from 'react';
import { Redirect } from 'react-router';
import * as _ from 'lodash';
import PasswordItem from '../containers/password-item';
import Loader from '../views/loader';
import { API, ErrorHandler, UserUtils, Generator } from '../../utils/utils';

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
			userID: props.match.params.userID,
		};

		this.deletePassword = this.deletePassword.bind(this);
		this.getListOfPasswords = this.getListOfPasswords.bind(this);
		this.deletePassword = this.deletePassword.bind(this);
	}

	componentDidMount() {
		const userID = API.checkIfValidUserID(this.state.userID) ? 
			this.state.userID : 
			Generator.generateRandomID();

		API.checkIfUserExists(userID).then(
			user => {
				if (user === null) { API.createUser(); }

				const mPassSet = user.masterPassword !== undefined ? true : false;

				if (UserUtils.getUserID() === null && UserUtils.getUserID() !== userID) {
					UserUtils.init(userID, mPassSet);
				}
			}
		)
		.catch(err => ErrorHandler.log({ err, location: 'password-list.js:74' }));

		API.getPasswords(userID)
			.then(passwords => this.setState({ passwords, showLoader: false }))
			.catch(err => ErrorHandler.log({ err, location: 'password-list.js:79' }));
	}
	
	deletePassword(passID) {
		API.deletePassword(passID)
			.then(res => {
				const passwords = _.filter(this.state.passwords,
					(password, id) => id !== passID);
				this.setState({ passwords });
			})
			.catch(err => ErrorHandler.log({ err, location: 'password-list.js:89' }));
	}

	getListOfPasswords() {
		const { passwords } = this.state;
		const actions = {
			deletePassword: this.deletePassword,
		};

		if (passwords) {
			const temp = [];

			_.forIn(passwords, (value, key) => {
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
		const userID = UserUtils.getUserID();
		const currPath = this.props.location.pathname;
		const expectedPath = `/${userID}`;
		const passwordList = this.getListOfPasswords();
		const styles = this.getStyles();

		if (UserUtils.isAccountProtected() && UserUtils.isSessionExpired()) {
			return <Redirect to='/login' />;
		}

		if (API.checkIfValidUserID(userID) && (currPath !== expectedPath)) {
			return <Redirect to={expectedPath} />;
		}

		return (
			<div style={styles}>
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
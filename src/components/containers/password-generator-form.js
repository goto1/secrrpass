import React, { Component } from 'react';
import PasswordGenerator from '../../utils/password-generator';

// TODO delete when CSS moved to App.css
import './add-password.css';

const PassGeneratorSlider = (props) => {
	const styles = {
		name: {
			fontSize: '17px',
			letterSpacing: '1.25px',
			fontWeight: '400'
		},
		slider: {
			WebkitAppearance: 'none',
			margin: '10px auto',
			width: '90%',
			':focus': { outline: 'none' }
		},
		count: {
			textAlign: 'right',
			fontSize: '16px',
		},
	};
	const { min, max, name, value, onChange, count } = props;
	return (
		<div style={{ color: '#202249' }}>
			<div style={styles.name}>{name}</div>
			<input
			 type='range'
			 style={styles.slider}
			 min={min}
			 max={max}
			 name={name.toLowerCase()}
			 value={value}
			 onChange={onChange} />
			 <div style={styles.count}>{count}</div>
		</div>
	);
}

class PasswordGeneratorForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			length: 15,
			digits: 3,
			symbols: 2,
		};
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		this.props.onGenerated(
			PasswordGenerator.generateNewPasswordWith(this.state)
		);
	}

	handleChange(event) {
		const target = event.target;
		const value = +target.value;
		const name = target.name;

		this.setState((prevState, currProps) => {
			const newState = {...prevState, [name]: value};
			this.props.onGenerated(
				PasswordGenerator.generateNewPasswordWith(newState)
			);
			return newState;
		});
	}

	render() {
		const styles = {
			borderRadius: '5px',
			background: '#F3F3F5',
			padding: '15px',
		};
		const { length, digits, symbols } = this.state;
		return (
			<div style={styles}>
				<PassGeneratorSlider 
					min='0'
					max='64'
					name='Length'
					value={length}
					onChange={this.handleChange}
					count={length} />
				<PassGeneratorSlider 
					min='0'
					max='10'
					name='Digits'
					value={digits}
					onChange={this.handleChange}
					count={digits} />
				<PassGeneratorSlider 
					min='0'
					max='10'
					name='Symbols'
					value={symbols}
					onChange={this.handleChange}
					count={symbols} />
			</div>
		);
	}
}

export default PasswordGeneratorForm;
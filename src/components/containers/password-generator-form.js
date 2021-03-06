import React, { Component } from 'react';
import { Slider } from '../views/input-field';
import { FormUtils, Generator } from '../../utils/utils';

class PasswordGeneratorForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			length: {
				min: '0',
				max: '64',
				name: 'length',
				value: 15,
				onChange: this.handleChange.bind(this),
			},
			digits: {
				min: '0',
				max: '10',
				name: 'digits',
				value: 3,
				onChange: this.handleChange.bind(this),
			},
			symbols: {
				min: '0',
				max: '10',
				name: 'symbols',
				value: 2,
				onChange: this.handleChange.bind(this),
			},
		};

		this.getStyles = this.getStyles.bind(this);
	}

	componentWillMount() {
		const recipe = FormUtils.getPasswordRecipe(this.state);

		this.props.onGenerated(Generator.generatePassword(recipe));
	}

	handleChange(event) {
		const { name, value } = event.target;

		this.setState((prevState, currProps) => {
			const newState = FormUtils.updateSliderValues({ name, value }, prevState);
			const recipe = FormUtils.getPasswordRecipe(newState);

			this.props.onGenerated(Generator.generatePassword(recipe));

			return newState;
		});
	}

	getStyles() {
		return { 
			borderRadius: '5px', 
			background: '#F3F3F5', 
			padding: '15px',
		};
	} 

	render() {
		const { length, digits, symbols } = this.state;
		const styles = this.getStyles();

		return (
			<div style={styles}>
				<Slider {...length} />
				<Slider {...digits} />
				<Slider {...symbols} />
			</div>
		);
	}
}

export default PasswordGeneratorForm;
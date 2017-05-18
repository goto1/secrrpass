import React from 'react';
import './buttons.css';

class ButtonBuilder {
	constructor() {
		this.state = { attributes: {} };

		this.render = this.render.bind(this);
		this.setName = this.setName.bind(this);
		this.setType = this.setType.bind(this);
		this.setAction = this.setAction.bind(this);
		this.setDisabled = this.setDisabled.bind(this);
		this.updateClassName = this.updateClassName.bind(this);
	}

	setName(name) {
		if (typeof name !== 'string') { return; }

		this.state['name'] = name;

		return this;
	}

	setType(type) {
		if (typeof type !== 'string') { return; }

		if (type.includes('submit') && type.length > 6) {
			this.state.attributes['type'] = 'submit';
			this.state.attributes['className'] = 'btn-submit-settings';
		} else {
			this.state.attributes['type'] = type;
		}

		return this;
	}

	setAction(action) {
		if (typeof action !== 'function') { return; }

		this.state.attributes['onClick'] = action;

		return this;
	}

	setDisabled(disabled) {
		if (typeof disabled !== 'boolean') { return; }

		this.state.attributes['disabled'] = disabled;

		return this;
	}

	updateClassName() {
		const type = this.state.attributes.type;

		if (this.state.attributes['className'] === undefined) {
			switch (type) {
				case 'submit':
					this.state.attributes['className'] = 'btn-submit';
					break;
				default:
					this.state.attributes['className'] = 'btn-default';
			}
		}
	}

	render() {
		this.updateClassName();

		const { attributes, name } = this.state;

		return <ButtonComponent attributes={attributes} name={name} />;
	}
}

function ButtonComponent({ attributes, name }) {
	return (
		<button {...attributes}>
			{name}
		</button>
	);
}

export default ButtonBuilder;
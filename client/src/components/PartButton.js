import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Button extends React.Component {
	constructor(props) {
		super(props);

		/* props looks like:
		{
			id
			onClick
			genre
		}
		*/
	}

	render() {
		return (
			<div className="ReviewButton" id={this.props.id} onClick={this.props.onClick}>
				Show All Parts
			</div>
		);
	}
}

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SetButton extends React.Component {
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
			<div className="minifigbtn" id={this.props.id} onClick={this.props.onClick}>
				<div className="title"> Set: {this.props.name}</div>
				<div className="number_of_parts"> Number of Parts: {this.props.num_parts}</div>
				<div class="frame">
					<img src={this.props.url} alt="centered image" className="image" />
				</div>
			</div>
		);
	}
}

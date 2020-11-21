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
			<div className="set" id={this.props.id} onClick={this.props.onClick}>
				<div className="title"> Set: {this.props.name}</div>
				<div className="year"> Year : {this.props.year}</div>
				<div className="similarity"> Similarity : {this.props.similarity}</div>
				<div className="sameParts"> Common Parts : {this.props.sameParts}</div>
				<div class="frame">
					<img src={this.props.url} alt="image" className="image" />
				</div>
			</div>
		);
	}
}

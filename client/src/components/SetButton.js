import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class SetButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="set" id={this.props.id} onClick={this.props.onClick}>
				<div className="title">{this.props.name}</div>
				<div className="year"> Year : {this.props.year}</div>
				<div className="year"> Number Of Parts : {this.props.num_parts}</div>
				<div class="frame">
					<img src={this.props.url} alt="" className="image" />
				</div>
			</div>
		);
	}
}

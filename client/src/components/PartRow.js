import React from 'react';
export default class ReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="PartRow">
			<div className="PartName">{this.props.name}</div>
			<div className="Quantity">X {this.props.quantity}</div>
			<div class="frame">
				<img src={this.props.url} alt="" className="image" />
			</div>
		</div>);
	}
}

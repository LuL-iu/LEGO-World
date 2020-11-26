import React from 'react';
export default class ReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="PartRow">
			<div className="text">{this.props.name}</div>
			<div className="text">{this.props.quantity}</div>
			<div class="frame">
				<img src={this.props.url} alt="centered image" className="image" />
			</div>
		</div>);
	}
}
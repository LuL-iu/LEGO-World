import React from 'react';
export default class ReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="ProductResults">
			<div className="text">{this.props.author}</div>
			<div className="text">{this.props.title}</div>
			<div className="text">{this.props.date}</div>
			<div className="text">{this.props.overall}</div>
			<div className="text">{this.props.review}</div>
		</div>);
	}
}

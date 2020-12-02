import React from 'react';
import Rating from '@material-ui/lab/Rating';
export default class ReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="ReviewRow">
			<div className="date"> {this.props.date}</div>
			
			<div className="title"> {this.props.title}</div>
			
			<div className="author">{this.props.author}</div>
			<Rating size="small"  value={this.props.overall} readOnly />
			<br></br>
			<div className="text">{this.props.review}</div>
		</div>);
	}
}

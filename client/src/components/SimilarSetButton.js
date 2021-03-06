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
			<div className="similarSet" id={this.props.id} onClick={this.props.onClick}>
				<div className = "similarSetText">
					<p className="title">{this.props.name}</p>
					<li className="setItem">Year : {this.props.year}</li>
					<li className="setItem">Similarity : {Math.round(this.props.similarity*100)} %</li>
					<li className="setItem">Common Parts : {this.props.sameParts}</li>
				</div>
				<div className = "bottomPart">
					<div class="frame">
						<img src={this.props.url} alt="" className="image" />
					</div>	
				</div>
				
			</div>
		);
	}
}

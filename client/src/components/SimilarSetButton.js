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
				<div class = "similarSetText">

						<div className = "setText">
							<div className="title">{this.props.name}
							<div className="ssYear">Year : {this.props.year}</div>
							<div className="similarity">Similarity : {Math.round(this.props.similarity*100)} %</div>
							<div className="sameParts">Common Parts : {this.props.sameParts}</div>
						</div>
					</div>
				</div>
				<div class="frame">
					<img src={this.props.url} alt="image" className="image" />
				</div>
			</div>
		);
	}
}

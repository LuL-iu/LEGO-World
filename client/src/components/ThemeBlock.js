import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ThemeBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="theme" id={this.props.id}>
				<div className = 'text-block'>
					<p className="lego"></p>
					<p className="title">{this.props.themes}</p>
				</div>
			</div>
		);
	}
}

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ThemeBlock extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="theme">
					<p className ='character'>{this.props.character}</p>
				<div className = 'categoryContainer'>
				
					{this.props.category}
					
				</div>
				<div className = 'text-block'>
					<p className="title">{this.props.themes}</p>
				</div>
			</div>
		);
	}
}

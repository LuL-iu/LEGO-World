import React from 'react';
export default class SimilarButton extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="SimilarButton" id={this.props.id} onClick={this.props.onClick}>
			Show Similar Sets
		</div>
		);
	}
}

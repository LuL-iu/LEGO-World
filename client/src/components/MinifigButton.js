import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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
			<div className="minifigbtn" id={this.props.id} onClick={this.props.onClick}>
				 <Link to={{
                            pathname: '/detail',
                            search: '?fig_num=' + this.props.fig_num,
                            state: { figNum: this.props.fig_num }
                        }}>
				<div className="title">{this.props.name}</div>
				<div className="year"> Number of Parts: {this.props.num_parts}</div>
				<div class="frame">
					<img src={this.props.url} alt="" className="image" url = {this.props.image_url}/>
				</div>
				</Link>
			
			</div>
		);
	}
}

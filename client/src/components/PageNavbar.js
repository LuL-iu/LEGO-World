import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: [],
			searchTerm: ""

		}
	}

	componentDidMount() {
		const pageList = ['Home'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
			else {
				return <a className="nav-item nav-link" key={i} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		})

		this.setState({
			navDivs: navbarDivs
		});
	}

	handleChange = e => {
		this.setState({searchTerm : e.target.value});
	};

	handleSubmit = e => {
		e.preventDefault();
		window.location.href = "/search?text="+ this.state.searchTerm
		// or you can send data to backend
	  };
	
	  handleKeypress = e => {

		if (e.keyCode === 13) {
			e.preventDefault();
		  this.btn.click();
		}
	  };

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
			      <span className="navbar-brand center">LEGO WORLD</span>
			      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
			        <div className="navbar-nav">
			        {this.state.navDivs}
			        </div>
			      </div>
			  
				<Form inline>
					<FormControl type="text" placeholder="Search" className="mr-sm-2" onChange = {this.handleChange} onKeyDown={this.handleKeypress} />
      				<Button variant="outline-success" ref={node => (this.btn = node)} onClick = {this.handleSubmit}>Search</Button>
				</Form>
				</nav>
			</div>
        );
	}
}
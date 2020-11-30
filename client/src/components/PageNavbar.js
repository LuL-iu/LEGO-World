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
		const pageList = ['sets',  'MinifigGame', 'Minifig'];

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

	editSearchTerm = (e) =>{
		this.setState({searchTerm : e.target.value})
	}
	
	showSets() {
		window.location.href = "/product?set_num="+ this.state.searchTerm
	}

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
					<FormControl type="text" placeholder="Search" className="mr-sm-2" onChange = {this.editSearchTerm} onKeyDown={ (e) => {if (e.key === 'Enter') {console.log('do validate');}}} />
      				<Button variant="outline-success" onClick = {() => this.showSets(this.state.searchTerm)}>Search</Button>
				</Form>
				</nav>
			</div>
        );
	}
}
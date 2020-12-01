import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import MinifigGame from './MinifigGame';
import Minifig from './Minifig';
import MinifigDetail from './MinifigDetail';
import Sets from './Sets';
import Product from './Product';
import Home from './Home';
import Search from './Search';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Home />
							)}
						/>
						<Route
							path='/sets/:themeId'
							component={Sets}
						/>
						<Route
							path="/product"
							render={() => (
								<Product />
							)}
						/>

						<Route
							path="/minifiggame"
							render={() => (
								<MinifigGame />
							)}
						/>

						<Route
							path="/Minifig"
							render={() => (
								<Minifig />
							)}
							
						/>
							
						<Route path="/detail" render={() => (
								<MinifigDetail />
							)}/>

						<Route
							path="/search"
							render={() => (
								<Search />
							)}
						/>

					</Switch>
				</Router>
			</div>
		);
	}
}
import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import MinifigGame from './MinifigGame';
import Sets from './Sets';
import Product from './Product';

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
								<Sets />
							)}
						/>
						<Route
							path="/sets"
							render={() => (
								<Sets />
							)}s
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
					</Switch>
				</Router>
			</div>
		);
	}
}
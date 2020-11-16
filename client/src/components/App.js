import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import MinifigGame from './MinifigGame';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
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
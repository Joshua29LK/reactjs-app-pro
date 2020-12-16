import React from 'react';
import {
	BrowserRouter,
	Route,
	Switch
} from "react-router-dom";

import List from './components/List';
import NotFoundPage from './components/NotFound';
import AboutUs from './components/AboutUs';
import Menu from './components/Menu';

const App: React.FC = () => {
  	return (
		<BrowserRouter>
			<div>
				<Menu />
				<Switch>
					<Route exact path='/' component={List} />
					<Route path="/about-us" component={AboutUs}/>
					<Route path="*" component={NotFoundPage} />
				</Switch>
			</div> 
		</BrowserRouter>
	);
}

export default App;
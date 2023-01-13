import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Error from './Pages/Error';
import AlbumPage from './Pages/AlbumPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.Fragment>
		<Router>
			<Routes>
				<Route path="/:id" element={<AlbumPage />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</Router>
	</React.Fragment>
);

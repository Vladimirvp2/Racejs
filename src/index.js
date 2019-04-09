import $ from "jquery"
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

$('.title').html('Race');


if (document.getElementById('app')) {
	ReactDOM.render(<App />, document.getElementById('app') );
}

import './css/style.css';
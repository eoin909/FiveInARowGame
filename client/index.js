'use strict';

require('!style!css!sass!../index.css');

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./containers/Layout');

ReactDOM.render(<App />, document.getElementById('app'));

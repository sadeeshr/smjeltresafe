// @flow

import React from 'react';
import { render } from 'react-dom';
import Smj from './components';
import Home from './components/home';
import Packages from './components/packages';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { Provider } from 'react-redux';

import { authorizationRequest } from './actions'
import rootReducer from './reducers';

const initialState = {
  app     : '',
  user    : {
    avatar : "picture.png",
    firstname : '',
    middlename : '',
    lastname : '',
    street: '',
    nr: '',
    ext : '',
    zip : '',
    town : ''
  },
  title : '',
  submittxt : '',
  hideitem  : false,
  hideitem2 : false,
  deleteB : true
};

// const store = createStore(rootReducer, initialState);
const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

// disable drag and drop
window.document.addEventListener('drop', function(e) {
  e.preventDefault();
  e.stopPropagation();
});
window.document.addEventListener('dragover', function(e) {
  e.preventDefault();
  e.stopPropagation();
});

store.subscribe(() => { console.log("store: ", store.getState())});
store.dispatch(authorizationRequest(store.getState()));

render(
  <Provider store={store}>
    <Router>
      <div>
      <Smj />
      <Route exact path="/" component={Smj}/>
      <Route exact path="/home" component={Home}/>
      <Route exact path="/packages" component={Packages}/>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);


// <ul>
// <li><Link to="/">Home</Link></li>
// <li><Link to="/about">About</Link></li>
// <li><Link to="/topics">Topics</Link></li>
// </ul>

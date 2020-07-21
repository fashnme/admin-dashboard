import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import App from './app';
import "./assets/css/animate.min.css";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import { isLoggedIn } from './helpers/login_helper';
import reducers from './reducers/index';
import { Login } from './views/Login';


const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={props => {
          if (!isLoggedIn()) {
            console.log('not loggrfin')
            return <Redirect from="/" to="/login" />
          }
          return <App {...props} />
        }} />
        <Route path="/login" render={props => {
          return <Login />
        }} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)




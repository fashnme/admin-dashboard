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
import reducers from './reducers/index';




const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" render={props => {

          return <App {...props} />

        }} />
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)




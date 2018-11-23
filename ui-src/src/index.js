import React from 'react';
import ReactDOM from 'react-dom';
import './styles/bootstrap.min.css';
import './styles/index.css';
import App from './components/App';
import {createStore} from 'redux';
import middleware from './middleware';
import {Provider} from 'react-redux';
import reducer from './reducers';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducer, middleware);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();

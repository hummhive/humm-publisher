import thunk from 'redux-thunk';
import { applyMiddleware } from 'redux';
import logger from './logger';

export default applyMiddleware(
  thunk,
  logger,
);

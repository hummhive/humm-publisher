import { RECEIVE_AGENT } from '../actions/agent';

export default function agent(state = null, action) {
  switch (action.type) {
  case RECEIVE_AGENT:
    return action.agent;
  default:
    return state;
  }
}

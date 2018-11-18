export const RECEIVE_AGENT = 'RECEIVE_AGENT';

export function receiveAgent(agent) {
  return {
    type: RECEIVE_AGENT,
    agent
  };
}

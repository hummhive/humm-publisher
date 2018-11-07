import { RECEIVE_QUESTIONS, ADD_QUESTIONS } from '../actions/questions';

export default function questions(state = {}, action) {
  switch (action.type) {
  case RECEIVE_QUESTIONS:
    return {
      ...state,
      ...action.questions,
    };
    case ADD_QUESTIONS:
      return {
        ...state,
        [action.question.id]: action.question,
      };
  default:
    return state;
  }
}

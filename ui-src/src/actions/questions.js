export const RECEIVE_QUESTIONS = 'RECEIVE_QUESTIONS'
export const ANSWER_QUESTIONS = 'ANSWER_QUESTIONS'
export const ADD_QUESTIONS = 'ADD_QUESTIONS'

export function receiveQuestions (questions) {
  return {
    type: RECEIVE_QUESTIONS,
    questions
  }
}

export function addNewQuestion (question) {
  return {
    type: ADD_QUESTIONS,
    question
  }
}

export function receiveQuestionAnswer ({ agent, qHash, answer }) {
  return {
    type: ANSWER_QUESTIONS,
    agent,
    qHash,
    answer
  }
}

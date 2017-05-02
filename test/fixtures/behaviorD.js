const { expect } = require('code');

const D = (state, behavior) => {

  expect(state).object();
  expect(state.messages).array();

  state.messages.push('BEFORE D');

  state.isD = true;

  return (state) => {

    state.messages.push('AFTER D');

  };
};

module.exports = D;
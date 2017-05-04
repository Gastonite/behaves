const { expect } = require('code');

const D = require('./behaviorD');

const C = (state, behavior) => {

  expect(state).object();
  expect(state.messages).array();

  state.messages.push('BEFORE C');

  state.isC = true;

  return (state) => {

    state.messages.push('AFTER C');

  };
};

C.behavior = [D];

module.exports = C;
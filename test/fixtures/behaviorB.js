const { expect } = require('code');

const C = require('./behaviorC');

const B = (state, behavior) => {

  expect(state).object();
  expect(state.messages).array();

  state.messages.push('BEFORE B');

  state.isB = true;

  return (state) => {

    state.messages.push('AFTER B');

  };
};

B.behavior = [C];

module.exports = B;
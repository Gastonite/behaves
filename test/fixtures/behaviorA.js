const { expect } = require('code');

const C = require('./behaviorC');

const A = (state, behavior) => {

  expect(state).object();
  expect(state.messages).array();

  state.messages.push('BEFORE A');

  state.isA = true;

  return (state) => {

    state.messages.push('AFTER A');

  };
};

A.behaviors = [C];

module.exports = A;
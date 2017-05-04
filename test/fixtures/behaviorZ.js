const { expect } = require('code');

const A = require('./behaviorA');
const B = require('./behaviorB');

const Z = (state, behavior) => {

  expect(state).object();
  expect(state.messages).array();

  state.messages.push('BEFORE Z');

  state.isZ = true;

  return (state) => {

    state.messages.push('AFTER Z');

  };
};

Z.behavior = [A, B];

module.exports = Z;
'use strict';

const Lab =  require('lab');
const { expect, fail } = require('code');

const BehaviorFactory = require('../lib/behavior');

const A = require('./fixtures/behaviorA');
const B = require('./fixtures/behaviorB');
const C = require('./fixtures/behaviorC');
const D = require('./fixtures/behaviorD');
const Z = require('./fixtures/behaviorZ');

exports.lab = Lab.script();

const { describe, it, beforeEach, afterEach, before, after } = exports.lab;

const shouldThrow = (fn, args, errorMessage) => {
  try {

    const result = fn(...args);

    expect(result).to.not.exist();

  } catch (err) {
    expect(err).to.exist();
    expect(err.message).to.equal(errorMessage);
  }
};

describe('BehaviorFactory', () => {

  const _shouldThrow = shouldThrow.bind(null, BehaviorFactory);

  it('should not accept invalid params', done => {

    _shouldThrow([], `"behavior" must be a function`);
    _shouldThrow([() => {}], `"behavior" function must have a name`);

    done();
  });

  it('does not accept a "behavior" with unknown "behaviors" dependencies', done => {

    _shouldThrow([C], `Unknown "D" behavior`);

    done();
  });

  it('creates unique behaviors', done => {

    const anotherReference = D;

    const makeD = BehaviorFactory(D);

    expect(makeD).to.be.function();

    _shouldThrow([anotherReference], `Behavior "D" already exists`);

    done();
  });

  it('creates behavior with unique name', done => {


    const anotherFunction = function D() {};

    _shouldThrow([anotherFunction], `Behavior "D" already exists`);

    done();
  });

  it('creates a behavior that inherits logic from other behaviors', done => {

    // const makeD = BehaviorFactory(D);
    const makeC = BehaviorFactory(C);
    const makeA = BehaviorFactory(A);
    const makeB = BehaviorFactory(B);
    const makeZ = BehaviorFactory(Z);

    const result = makeZ({messages: []});

    expect(result).object();
    expect(result.isA).true();
    expect(result.isB).true();
    expect(result.isC).true();
    expect(result.isD).true();
    expect(result.isZ).true();
    expect(result.messages).equal([
      'BEFORE Z',
      'BEFORE D',
      'BEFORE C',
      'BEFORE A',
      'BEFORE B',
      'AFTER Z',
      'AFTER D',
      'AFTER C',
      'AFTER A',
      'AFTER B',
    ]);

    done();
  });

});

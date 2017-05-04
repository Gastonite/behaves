'use strict';

const internals = {
  behaviors: []
};

internals.unique = array => {

  if (!internals.isArray(array))
    throw new Error('unique expects an array');

  return array.filter((elem, pos, arr) => arr.indexOf(elem) == pos);
};

internals.isArray = input => input instanceof Array;

internals.isFunction = input => typeof input === 'function';

internals.isString = input => typeof input === 'string';

internals.byName = input => item => item.name === input;

internals.Behavior = module.exports = (behavior) => {

  if (internals.isArray(behavior))
    return behavior.map(internals.Behavior);

  if (!internals.isFunction(behavior))
    throw new Error('"behavior" must be a function');

  if (!behavior.name)
    throw new Error('"behavior" function must have a name');

  if (!internals.isFunction(behavior) || !behavior.name)
    throw new Error('Behavior has invalid parameters');

  if (internals.behaviors.find(internals.byName(behavior.name)))
    throw new Error(`Behavior "${behavior.name}" already exists`);

  if (!behavior.behavior)
    behavior.behavior = [];

  if (!(behavior.behavior instanceof Array))
    throw new Error('"behaviors" must be an array');

  const _behaviors = internals.unique(behavior.behavior.reduce((behaviors, behavior) => {

    const _addBehavior = behavior => {

      if (internals.isString(behavior)) {

        const behaviorId = behavior;

        behavior = internals.behaviors.find(internals.byName(behaviorId));

        if (!behavior)
          throw new Error(`Unknown "${behaviorId}" behavior`);

      }

      if (!internals.isFunction(behavior))
        throw new Error('"behaviors" only accepts strings or functions');

      if (!internals.behaviors.find(item => item === behavior))
        throw new Error(`Unknown "${behavior.name}" behavior`);

      behavior.behavior.forEach(_addBehavior);

      behaviors.push(behavior);

    };


    _addBehavior(behavior);

    return behaviors;

  }, []));

  behavior.behavior = _behaviors; //.map(behavior => behavior.name);

  behavior.debug = () => _behaviors.map(behavior => behavior.name);
  internals.behaviors.push(behavior);

  return (state = {}) => {

    const _callbacks = [];

    const _applyBehavior = (factory) => {

      const returned = factory(state, behavior);

      if (internals.isFunction(returned))
        _callbacks.push(returned);

    };

    _applyBehavior(behavior);

    _behaviors.forEach(_applyBehavior);

    _callbacks.forEach(callback => callback(state, behavior));

    return state;
  };
};
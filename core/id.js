'use strict';

function createIdGenerator(prefix = 'id') {
  let counter = 0;
  return function nextId() {
    counter += 1;
    return `${prefix}-${String(counter).padStart(8, '0')}`;
  };
}

module.exports = {
  createIdGenerator
};

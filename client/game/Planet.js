'use strict';

const PlanetLib = require('../../lib/Planet');

function Planet ({ id, cellCount, controlledBy, x, y }) {
  return PlanetLib.create({
    id,
    cellCount,
    controlledBy,
    x,
    y
  });
}

module.exports = { create: Planet };

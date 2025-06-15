const BigNumber = require("bignumber.js");
const config = require("config");

const DECIMAL_PLACES = config.DECIMAL_PLACES || 4;
const ROUNDING_MODE = BigNumber.ROUND_HALF_DOWN;

BigNumber.set({
  DECIMAL_PLACES,
  ROUNDING_MODE,
});

function roundOff(value) {
  return Number(BigNumber(value).decimalPlaces(DECIMAL_PLACES, ROUNDING_MODE).toFixed());
}

function plus(a, b) {
  const result = BigNumber(a).plus(BigNumber(b));
  return roundOff(result);
}

function minus(a, b) {
  const result = BigNumber(a).minus(BigNumber(b));
  return roundOff(result);
}

module.exports = {
  roundOff,
  plus,
  minus
};

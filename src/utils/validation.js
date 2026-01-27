function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPositiveNumber(value) {
  if (value === null || value === undefined) {
    return false;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue > 0;
}

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isPositiveNumber
};

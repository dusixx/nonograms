const toStr = Object.prototype.toString;
export const getTypeName = (v) => toStr.call(v).slice(8, -1);

export const isStr = (v) => typeof v === 'string';
export const isNonEmptyStr = (v) => isStr(v) && !/^[\s]*$/.test(v);
export const isInt = (v) => Number.isInteger(Number(v));
export const isPositiveInt = (v) => isInt(v) && v >= 0;
export const isFunc = (v) => typeof v === 'function';
export const isArray = (v) => Array.isArray(v);
export const isMatrix = (v) => isArray(v) && isArray(v[0]);
export const isRegex = (v) => v instanceof RegExp;
export const isPrimitive = (v) => Object(v) !== v;

export const getId = () => Math.random().toString(24).slice(2);

export const checkArgument = (v, typeName, func) => {
  if (!isNonEmptyStr(typeName)) {
    return;
  }
  const success = isFunc(func) ? Boolean(func(v)) : getTypeName(v) === typeName;
  if (!success) {
    throw TypeError(`${typeName} expected`);
  }
};

export const JSONParse = (v) => {
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

export const sleep = async (tio) => {
  await new Promise((resolve) => setTimeout(resolve, tio));
};

export const rndInt = (min, max) => {
  return Math.round(min + Math.random() * (max - min));
};

export const msToDHMS = (ms) => {
  const secs = ms / 1000;
  return {
    secs: Math.floor(secs % 60),
    mins: Math.floor((secs / 60) % 60),
    hours: Math.floor((secs / 3600) % 24),
    days: Math.floor(secs / 3600 / 24),
  };
};

export const elapsedToTime = (seconds) => {
  const { secs, mins, hours } = msToDHMS(seconds * 1000);
  let res = `${mins}`.padStart(2, 0) + ':' + `${secs}`.padStart(2, 0);
  if (hours > 0) {
    res = `${hours}`.padStart(2, 0) + res;
  }
  return res;
};

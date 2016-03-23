
const EXRs = {
  ATTR: /^[a-z,A-Z,-]+\:\s/,
  ID: /^\#/,
  CLAS: /(^|\s+)\./g,
  DATA: /^\$/,
  EVENT: /^\!/,
  TRANS: /^\>/,
  IF: /^\?\s+/,
  FOR: /^\%\s+/,
  WRAP: /^\[[a-z,A-Z,0-9,-]+\]/
}

export const CHECK = (test,expression) => {
  return test.match(EXRs[expression]);
}

export const REPLACE = (val,expression,replacement) => {
  return val.replace(EXRs[expression],replacement);
}

export const GET = (expression) => {
  return EXRs[expression];
}

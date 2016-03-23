"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var EXRs = {
  ATTR: /^[a-z,A-Z,-]+\:\s/,
  ID: /^\#/,
  CLAS: /(^|\s+)\./g,
  DATA: /^\$/,
  EVENT: /^\!/,
  TRANS: /^\>/,
  IF: /^\?\s+/,
  FOR: /^\%\s+/,
  WRAP: /^\[[a-z,A-Z,0-9,-]+\]/
};

var CHECK = exports.CHECK = function CHECK(test, expression) {
  return test.match(EXRs[expression]);
};

var REPLACE = exports.REPLACE = function REPLACE(val, expression, replacement) {
  return val.replace(EXRs[expression], replacement);
};

var GET = exports.GET = function GET(expression) {
  return EXRs[expression];
};

import {
  CHECK
} from './exr';

import {
  applySelector
} from './utils';

export const applyAttribute = (el,attr,val) => {
  const build = attr + '="' + val +'" ';
  return el.replace('>', build + '>');
}

export const applySelector = (el,val) => {
  if(typeof val != 'string') return false;
  if(val.match(/\#/))
    val = val.replace('#','');
    el = applyAttribute(el,'id',val);
  else if(val.match(/\./))
    val = val.replace(/\./g,'');
    el = applyAttribute(el,'class',val);
  else return false;
  return el;
}

export const newDomElement = (type) => {
  var tag = type || 'span';
  var el = "<" + tag + ">" + "</" + tag + ">";
  el = applySelector(el,tag);
  return el;
}

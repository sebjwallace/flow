
import {CHECK, REPLACE} from './exr.js';

export const getAttribute = (obj,val) => {
  const attr = val.match(/^[a-z,A-Z,-]+/)[0];
  let value = REPLACE(val,'ATTR','');
  if(CHECK(value,'DATA')){
    value = getDataFromVar(obj,value);
  }
  return {value: value, attr: attr};
}

export const applySelector = (el,val) => {
  if(typeof val != 'string') return false;
  if(CHECK(val,'ID'))
      el.id = REPLACE(val,'ID','');
  else if(CHECK(val,'CLAS'))
      el.className = REPLACE(val,'CLAS',' ');
  else return false;
  return true;
}

export const getElementPath = (el) => {
  let path = el.nodeName;
  let current = el;
  let parent = el.parentNode;
  while(parent){
    for(var child in parent.children){
      if(parent.children[child] == current)
        path = parent.nodeName + '[' + child + ']' + '/' + path;
    }
    current = parent;
    parent = parent.parentNode;
  }
  return path;
}

export const getComponentId = (el) => {
  return getElementPath(el) + el.children.length;
}

export const getDataFromVar = (obj,value) => {
  const prop = REPLACE(value,'DATA','');
  let data = null;
  if(prop.match(/\./)){
    const path = prop.split(/\./);
    data = obj.data[path[0]][path[1]];
  }
  else data = obj.data[prop];
  return data;
}

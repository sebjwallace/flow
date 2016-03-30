
import {CHECK, REPLACE} from './exr.js';


export const generateKey = (length) => {
  var key = '';
  var chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  for(var i = 0; i < length; i++){
    key += chars[Math.floor((Math.random() * (chars.length-1)) + 1)];
  }
  return key;
}

export const getAttribute = (obj,val) => {
  const attr = val.match(/^[a-z,A-Z,-]+/)[0];
  // const attr = val.replace(/\s+/,'&').split('&')[0];
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

export const getDataFromVar = (obj,value) => {
  if(typeof value != 'string') return value;
  const prop = REPLACE(value,'DATA','');
  if(prop == value) return value;
  let data = null;
  if(prop.match(/\./) && prop !== undefined){
    const path = prop.split(/\./);
    data = obj.data[path[0]][path[1]];
  }
  else data = obj.data[prop];
  return data;
}

export const getTag = (elementArray) => {
  return elementArray[0];
}

export const getContent = (elementArray,component) => {
    let content = elementArray[elementArray.length -1];
    if(typeof content == 'function')
      return content(component);
    else return content;
}

export const validateContent = (content) => {
  if(typeof content == 'string' && !CHECK(content,'TRANS'))
    return content;
  else return '';
}

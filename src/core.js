
import {
  CHECK,
  REPLACE,
  GET
} from './exr';

import {
  getAttribute,
  applySelector,
  getDataFromVar,
  getComponentId
} from './utils';

import {render,traverse} from './renderer';

const Components = [];

export const newElement = (parent,type) => {
  var tag = type || 'span';
  if(CHECK(tag,'ID') || CHECK(tag,'CLAS')){
    var child = document.createElement('div');
    applySelector(child,tag);
  }
  else
    var child = document.createElement(tag);
  child.parent = parent;
  parent.appendChild(child);
  return child;
}

export const buildComponent = (dom,elementArray) => {
  const componentID = getComponentId(dom.parent);
  if(Components[componentID])
    return Components[componentID];
  else{
    const component = elementArray[0];
    const injectData = elementArray[1];
    const content = elementArray[elementArray.length-1];
    var instance = Object.create(component);
    if(component.data){
      instance.data = JSON.parse(JSON.stringify(component.data));
      for(var data in injectData){
        instance.data[data] = injectData[data];
      }
    }
    instance.content = content;
    Components[componentID] = instance;
    return instance;
  }
}

export const generateElement = (obj,dom,elementArray) => {
  const tag = elementArray[0];
  const content = elementArray[elementArray.length-1];
  dom.el = newElement(dom.parent,tag);
  if(typeof content == 'string' && !CHECK(content,'TRANS'))
    dom.el.innerHTML = content;
  dom.parent = dom.el;
  traverse(obj,dom,elementArray);
  dom.parent = dom.parent.parentNode;
}

export const buildElement = (obj,dom,elementArray) => {
  const tag = elementArray[0];
  if(typeof tag == 'object'){
    const sub = newElement(dom.parent,'div');
    const component = buildComponent(dom,elementArray);
    render(component,sub);
    for(var j = 1; j < elementArray.length; j++){
      applySelector(sub,elementArray[j]);
    }
  }
  else{
    generateElement(obj,dom,elementArray);
  }
}

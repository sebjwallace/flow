
import {
  CHECK,
  REPLACE,
  GET
} from './exr';

import {
  getAttribute,
  applySelector,
  getDataFromVar,
  getComponentId,
  getTag,
  getContent,
  validateContent
} from './utils';

import {
  isComponent,
  buildComponent
} from './component';

import {
  newDomElement
} from './element';

import {render,traverse} from './renderer';


const buildElement = (component,dom,elementArray) => {
  const tag = getTag(elementArray);
  const content = getContent(elementArray,component);

  dom.el = newDomElement(dom.parent,tag);
  dom.el.innerHTML = validateContent(content);

  dom.parent = dom.el;
  traverse(component,dom,elementArray);
  dom.parent = dom.parent.parentNode;
}

export const renderElementArray = (component,dom,elementArray) => {
  const tag = getTag(elementArray);
  if(isComponent(tag)){
    const subElement = newDomElement(dom.parent,'div');
    const subComponent = buildComponent(dom,elementArray,component);
    render(subComponent,subElement);
    for(var j = 1; j < elementArray.length; j++){
      applySelector(subElement,elementArray[j]);
    }
  }
  else{
    buildElement(component,dom,elementArray);
  }
}


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


const buildElement = (schema,elementArray) => {
  const tag = getTag(elementArray);
  const content = getContent(elementArray);

  schema.dom.el = newDomElement(schema.dom.parent,tag);
  schema.dom.el.innerHTML = validateContent(content);

  schema.dom.parent = schema.dom.el;
  traverse(schema,elementArray);
  schema.dom.parent = schema.dom.parent.parentNode;
}

// this junction takes the elementArray in one of two paths
// its either a component or an element
export const renderElementArray = (schema,elementArray) => {
  // the tag is the first iteratee of the elementArray
  // ie. 'div' or 'img' or SchemaObject
  const tag = getTag(elementArray);
  // if its a schema object it will instance it as a component
  // it will render nested within the current schema/component
  if(isComponent(tag)){
    const subElement = newDomElement(schema.dom.parent,'div');
    const subComponent = buildComponent(schema.dom,elementArray);
    render(subComponent,subElement);
    for(var j = 1; j < elementArray.length; j++){
      applySelector(subElement,elementArray[j]);
    }
  }
  else{
    // if its an elementArray it will setup the dom for another traversal
    buildElement(schema,elementArray);
  }
}

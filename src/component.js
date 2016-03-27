
import {
  getElementPath,
  getContent
} from './utils';

const Components = [];

const setComponent = (componentID,component) => {
  Components[componentID] = component;
}

const getComponent = (componentID) => {
  return Components[componentID];
}

const getComponentId = (el,key) => {
  return getElementPath(el) + el.children.length;
}

const instanciateComponent = (schema,injectData) => {
  const instance = Object.create(schema);
  if(schema.data){
    instance.data = JSON.parse(JSON.stringify(schema.data));
    for(var data in injectData){
      instance.data[data] = injectData[data];
    }
  }
  return instance;
}

export const isComponent = (tag) => {
  if(typeof tag == 'object') return true;
  else return false;
}

export const buildComponent = (dom,elementArray) => {
  const componentID = getComponentId(dom.parent);
  const component = getComponent(componentID);
  if(component)
    return component;
  else{
    const schema = elementArray[0];
    const injectData = elementArray[1];
    const content = getContent(elementArray);
    const instance = instanciateComponent(schema,injectData);
    instance.content = content;
    setComponent(componentID,instance);
    return instance;
  }
}

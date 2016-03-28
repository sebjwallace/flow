
import {render} from './renderer';

let models = [];
let history = [];

export const model = (model) => {
  let name;
  for(name in model) break;
  models[name] = model;
}

export const attachModel = (name,component) => {
  if(!models[name].__listeners)
    models[name].__listeners = {};
  models[name].__listeners[component.id] = component;
  component.data[name] = models[name][name];
  console.log(models);
}

export const updateModel = (name,method,values) => {
  const ctr = models[name];
  const updatedModel = ctr[method](ctr,values);
  ctr[name] = updatedModel;
  history.push(updatedModel);
  const listeners = ctr.__listeners;
  for(let _listener in listeners){
    const listener = listeners[_listener];
    listener.data[name] = updatedModel;
    render(listener,listener.root);
  }
  console.log(models)
}

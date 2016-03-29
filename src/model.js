
import {render} from './renderer';

let models = [];
let events = [];
let history = [];

export const model = (name,model) => {
  model.data = null;
  model.name = name;
  model.listeners = [];
  models[name] = model;
  for(let method in model){
    if(!events[method])
      events[method] = [];
    if(
      method != 'init'
      || method != 'save'
      || method != 'load'
    )
      events[method].push(model)
  }
  if(model.init)
    model.data = model.init(model.data);
}

export const attach = (modelName,component) => {
  models[modelName].listeners.push(component);
  return models[modelName].data;
}

export const dispatch = (action) => {
  events[action.type].forEach((model) => {
    const data = model[action.type](model.data,action,model);
    model.data = data;
    history.push(data);
    if(!model.listeners) return;
    model.listeners.forEach((listener) => {
      listener.models[model.name](model.data);
      render(listener,listener.root)
    })
  })
}

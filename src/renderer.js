
import {
  driveDirectives
} from './directives';

import {
  driveFilters
} from './filters';

import {
  renderCSS
} from './styles';

import {
  renderElementArray
} from './core';

import {
  applySelector,
  generateKey
} from './utils';

import {
  CHECK
} from './exr';

import{
  attach,
  dispatch
} from './model';

import{
  addRoute
} from './route';

export const render = (component,root) => {

  // the top most root (parent component) must be cleared on rerender
  root.innerHTML = '';
  component.root = root;

  // a key is used for style scope
  if(!component.key)
    component.key = generateKey(4);
  component.root.className = component.key;

  // dom object keeps track of dom parent/child relationships during traversal
  const dom = {
    parent: root,
    el: null
  };

  // attach setData to the schema object
  component.setData = (data) => {
    for(var item in data){
      component.data[item] = data[item];
    }
    render(component,component.root);
  }
  component.setStyles = (styles) => {
    renderCSS(styles,component)
  };
  component.emit = (action) => {
    dispatch(action);
  }

  if(!component.rendered){
    component.models = {};
    for(let data in component.data){
      let val = component.data[data];
      if(typeof val != 'string') continue;
      if(val[0] == '@'){
        const modelName = val.replace('@','');
        component.data[data] = attach(modelName,component)
        component.models[modelName] = (incomming) => {
          component.data[data] = incomming;
        }
      }
    }
    if(component.boot)
      component.boot(component)
    if(component.route)
      addRoute(component.route,component)
  }

  if(typeof component.template == 'function')
    traverse(component,dom,[component.template(component)]);
  else
    traverse(component,dom,[component.template]);

  if(component.styles)
    renderCSS(component.styles,component);

  if(component.init && !component.rendered){
    component.rendered = true;
    component.init(component);
  }

  component.rendered = true;

  // console.log(root.innerHTML);
}

export const traverse = (component,dom,template) => {

   for(let i = 0; i < template.length; i++){
     let val = template[i];

     if(typeof val == 'function'){
        val = val(component);
     }
     if(Array.isArray(val)){
       val = driveFilters(component,val,dom)
       if(val == true)
        return;
     }

     if(typeof val == 'string'){
      if(applySelector(dom.el,val)) continue;

      const skip = driveDirectives(val,dom,component,template);
      if(skip) i = template.length-1;

      if(CHECK(val,'TRANS')) val = component.content;
     }

     if(Array.isArray(val)){
       renderElementArray(component,dom,val);
     }

   }
};

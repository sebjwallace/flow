
import {
  driveDirectives
} from './directives';

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
  updateModel,
  attachModel
} from './model';

export const render = (component,root) => {

  // the top most root (parent component) must be cleared on rerender
  root.innerHTML = '';
  component.root = root;

  // a key is used for style scope
  if(!component.key)
    component.key = generateKey(8);
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
  component.attachModel = (name) => {
    attachModel(name,component);
  }
  component.updateModel = updateModel;

  if(component.boot && !component.rendered)
    component.boot(component);

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

  // console.log(root.innerHTML);
}

export const traverse = (component,dom,template) => {

   for(let i = 0; i < template.length; i++){
     let val = template[i];

     if(typeof val == 'function'){
        val = val(component);
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

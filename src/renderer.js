
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


import {JASS} from 'jass-js';
import {Directives} from './directives';

import {
  renderElementArray
} from './core';

import {
  applySelector
} from './utils';

import {
  CHECK
} from './exr';

export const render = (component,root) => {

  root.innerHTML = '';
  component.root = root;

  const dom = {
    parent: root,
    el: null
  };

  component.setData = (data) => {
    for(var item in data){
      component.data[item] = data[item];
    }
    render(component,component.root);
  }

  traverse(component,dom,[component.template]);

  if(component.styles){
    const styles = new JASS.Component(component.styles);
    component.root.className = styles.className();
    component.setStyles = (set) => { styles.setStyles(set) };
  }

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

         for(let directive in Directives){
           if(val.match(Directives[directive].regex)){
             const skip = Directives[directive].method(component,dom,val,template);
             if(skip) i = template.length-1;
           }
         }

         if(CHECK(val,'TRANS')) val = component.content;
     }
     if(Array.isArray(val)){
       renderElementArray(component,dom,val);
     }

   }
};

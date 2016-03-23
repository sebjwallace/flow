
import {JASS} from 'jass-js';
import {Directives} from './directives';

import {
  buildElement
} from './core';

import {
  applySelector
} from './utils';

import {
  CHECK
} from './exr';

export const render = (obj,root) => {

  root.innerHTML = '';
  obj.root = root;

  const dom = {};
  dom.parent = root;
  dom.el = null;

  obj.setData = (data) => {
    for(var item in data){
      obj.data[item] = data[item];
    }
    render(obj,obj.root);
  }

  traverse(obj,dom,[obj.template]);

  if(obj.styles){
    const styles = new JASS.Component(obj.styles);
    obj.root.className = styles.className();
    obj.setStyles = (set) => { styles.setStyles(set) };
  }

  if(obj.init && !obj.rendered){
    obj.rendered = true;
    obj.init(obj);
  }

  // console.log(root.innerHTML);
}

export const traverse = (obj,dom,node) => {

   for(let i=0; i < node.length; i++){
     let val = node[i];
     if(typeof val == 'string'){
         if(applySelector(dom.el,val)) continue;

         for(let directive in Directives){
           if(val.match(Directives[directive].regex)){
             const skip = Directives[directive].method(obj,dom,val,node);
             if(skip) i = node.length-1;
           }
         }

         if(CHECK(val,'TRANS')) val = obj.content;
     }
     if(Array.isArray(val)){
       buildElement(obj,dom,val);
     }

   }
};

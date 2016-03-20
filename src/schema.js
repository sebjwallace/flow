"use strict";

import {JASS} from 'jass-js';

var SchemaEngine = function(){

  var store = [];

  const HREF = /^\href:\s+/;
  const ID = /^\#/;
  const CLAS = /^\./;
  const DATA = /^\@/;
  const EVENT = /^\!/;
  const TRANS = /^\>/;

  let level = 0;

  const render = (obj,root,trans) => {

    root.innerHTML = '';
    obj.root = root;
    let parent = root;
    let el = null;
    const stack = [];

    obj.setData = (data) => {
      for(var item in data){
        obj.data[item] = data[item];
      }
      render(obj,obj.root,obj.trans);
    }

    const newElement = (parent,type) => {
      var tag = type || 'span';
      var child = document.createElement(tag);
      child.parent = el;
      parent.appendChild(child);
      return child;
    }

    const traverse = (node) => {

       for(let i=0; i < node.length; i++){

         const prop = i;
         let val = node[i];

         if(typeof val == 'string'){

             if(val.match(HREF))
                 el.href = val.replace(HREF,'');

             else if(val.match(ID))
                 el.id = val.replace(ID,'');

             else if(val.match(CLAS))
                 el.className = val.replace(CLAS,'');

             else if(val.match(DATA))
                 el.innerHTML = obj.data[val.replace(DATA,'')];

             else if(val.match(EVENT)){
               var format = val.replace('!','').replace(/\s/,'').split(':');
               el[format[0]] = (e) => {
                 obj[format[1]](obj,e);
               }
             }

             else if(val.match(TRANS)){
               val = trans;
               obj.trans = trans;
             }
         }

         if(Array.isArray(val)){
           if(typeof val[0] == 'object'){
             var sub = newElement(parent);
             if(store[el]){
               render(store[el],sub,val[val.length-1]);
             }
             else{
               var instance = Object.create(val[0]);
               instance.data = JSON.parse(JSON.stringify(val[0].data));
               for(var j = 1; j < val.length -1; j++){
                 const keyVal = val[j].replace(/\s+/g,'').split(':');
                 instance.data[keyVal[0]] = keyVal[1];
               }
               store[el] = instance;
               const styles = new JASS.Component(obj.styles);
               obj.root.className = styles.className();
               render(instance,sub,val[val.length-1]);
             }
           }
           else{
             el = newElement(parent,val[0]);
             const content = val[val.length-1];
             if(typeof content == 'string' && !content.match(TRANS))
               el.innerHTML = val[val.length-1];
             parent = el;
             stack[level] = el;
             level++;
             traverse(val);
             level--;
             parent = stack[level].parent;
           }
         }

       }
    };

    traverse([obj.template]);
  }

  this.render = render;

}

export default SchemaEngine;

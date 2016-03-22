"use strict";

import {JASS} from 'jass-js';

var SchemaEngine = function(){

  var components = [];

  const ATTR = /^[a-z,A-Z,-]+\:\s/;
  const ID = /^\#/;
  const CLAS = /(^|\s+)\./g;
  const DATA = /^\$/;
  const EVENT = /^\!/;
  const TRANS = /^\>/;
  const IF = /^\?\s+/;
  const FOR = /^\%\s+/;

  let level = 0;

  const render = (obj,root,trans) => {

    root.innerHTML = '';
    obj.root = root;

    const dom = {};
    dom.parent = root;
    dom.el = null;

    // for(var item in obj){
    //   if(typeof obj[item] == 'function')
    //     obj[item] = (arguments) => { obj[item](arguments).bind(obj); }
    // }

    if(obj.styles){
      const styles = new JASS.Component(obj.styles);
      obj.root.className = styles.className();
    }

    obj.setData = (data) => {
      for(var item in data){
        obj.data[item] = data[item];
      }
      render(obj,obj.root,obj.trans);
    }

    const newElement = (obj,parent,type) => {
      var tag = type || 'span';
      if(tag.match(ID)){
        var child = document.createElement('div');
        child.id = tag.replace(ID,'');
      }
      else if(tag.match(CLAS)){
        var child = document.createElement('div');
        child.className = tag.replace(CLAS,'');
      }
      else{
        var child = document.createElement(tag);
      }
      child.parent = parent;
      parent.appendChild(child);
      return child;
    }

    const buildElement = (obj,dom,val) => {
      const tag = val[0];
      const content = val[val.length-1];
      if(typeof tag == 'object'){
        const component = tag;
        const sub = newElement(obj,dom.parent,'div');
        const componentID = getComponentId(dom.parent);
        if(components[componentID])
          render(components[componentID],sub,content);
        else{
          var instance = Object.create(component);
          if(component.data){
            instance.data = JSON.parse(JSON.stringify(component.data));
            for(var data in val[1]){
              instance.data[data] = val[1][data];
            }
          }
          components[componentID] = instance;
          render(instance,sub,content);
        }
        for(var j = 1; j < val.length; j++){
          applySelector(sub,val[j]);
        }
      }
      else{
        dom.el = newElement(obj,dom.parent,tag);
        if(typeof content == 'string' && !content.match(TRANS))
          dom.el.innerHTML = content;
        dom.parent = dom.el;
        traverse(val);
        dom.parent = dom.parent.parent;
      }
    }

    const applySelector = (el,val) => {
      if(typeof val != 'string') return false;
      if(val.match(ID))
          el.id = val.replace(ID,'');
      else if(val.match(CLAS))
          el.className = val.replace(CLAS,' ');
      else return false;
      return true;
    }

    const getElementPath = (el) => {
      let path = el.nodeName;
      let current = el;
      let parent = el.parentNode;
      while(parent){
        for(var child in parent.children){
          if(parent.children[child] == current)
            path = parent.nodeName + '[' + child + ']' + '/' + path;
        }
        current = parent;
        parent = parent.parentNode;
      }
      return path;
    }

    const getComponentId = (el) => {
      return getElementPath(el) + el.children.length;
    }

    const traverse = (node) => {

       for(let i=0; i < node.length; i++){

         let val = node[i];

         if(typeof val == 'string'){

             if(applySelector(dom.el,val)) continue;

             if(val.match(ATTR))
                 dom.el.setAttribute([val.match(/^[a-z,A-Z,-]+/)[0]], val.replace(ATTR,''));

             else if(val.match(DATA)){
               const prop = val.replace(DATA,'');
               let data = null;
               if(prop.match(/\./)){
                 const path = prop.split(/\./);
                 data = obj.data[path[0]][path[1]];
               }
               else data = obj.data[prop];
               if(Array.isArray(data)) { val = data; dom.el.innerHTML = ''}
               else dom.el.innerHTML = data;
             }

             else if(val.match(EVENT)){
               var format = val.replace('!','').replace(/\s/,'').split(':');
               dom.el[format[0]] = (e) => {
                 obj[format[1]](obj,e);
               }
             }

             else if(val.match(TRANS)){
               val = trans;
               obj.trans = trans;
             }

             else if(val.match(IF)){
               const exp = val.replace(IF,'');
               if(exp.match(DATA)){
                 const data = obj.data[exp.replace(DATA,'')];
                 if(!data) dom.el.style.display = 'none';
               }
             }

             else if(val.match(FOR)){
               const args = val.replace(FOR,'').split(/\s+\in\s+/);
               const data = obj.data[args[1].replace(DATA,'')];
               const temp = args[0].replace(DATA,'');
               for(let item in data){
                 obj.data[temp] = data[item];
                 buildElement(obj,dom,node[node.length-1])
               }
               i = node.length;
             }
         }

         if(Array.isArray(val)){
           buildElement(obj,dom,val);
         }

       }
    };
    traverse([obj.template]);
    // console.log(root.innerHTML);
  }

  this.render = render;

}

export default SchemaEngine;

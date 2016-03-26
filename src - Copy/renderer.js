
import {JASS} from 'jass-js';

import {
  applyDirectives
} from './directives';

import {
  renderElementArray
} from './core';

import {
  applySelector
} from './utils';

import {
  CHECK
} from './exr';

const isElementArray = (val) => {
  return Array.isArray(val);
}

const isTransclusion = (val) => {
  return CHECK(val,'TRANS');
}

export const render = (schema,root) => {

  // clear out the content of root for re/rendering
  // note: it would be ideal not to clear everying, but overwrite each node
  root.innerHTML = '';

  // attach the root as reference for rerendering
  schema.root = root;

  // attach the setData method to the schema object
  schema.setData = (data) => {
    for(var item in data){
      schema.data[item] = data[item];
    }
    // after new data is set, rerender the schema component
    render(schema,schema.root);
  }

  // attach dom reference used in traversal
  schema.dom = {
    parent: root,
    el: null
  };

  // the template is the root elementArray for this component
  // traverse through it to render nested elementArrays and components
  traverse(schema,schema.template);

  // if the schema has styles, render them
  if(schema.styles){
    const styles = new JASS.Component(schema.styles);
    // bind the root to the BASE scope of the styles
    schema.root.className = styles.className();
    // attach setStyles to the schema object
    schema.setStyles = (set) => { styles.setStyles(set) };
  }

  // if the schema has an init method call it
  if(schema.init && !schema.rendered){
    // if the init method has a setData or setStyles it will rerender
    // to avoid recursion set rendered to true before the init method
    schema.rendered = true;
    schema.init(schema);
  }

  // console.log(root.innerHTML);
}


// the schema object is used in traversal to reference data and methods
// the elementArray is the array representation of the element to render
// ie. ['a', '.alink', 'href: http://github.com', 'Github']
//     [nodeName, className, attribute, content]
//     [nodeName always first, ...... , content always last]
export const traverse = (schema,elementArray) => {

  // an iteratee is either a string or array
  for(let i = 0; i < elementArray.length; i++){

     let val = elementArray[i];

     // if a string it is either an attribute or directive
     if(typeof val == 'string'){

         // check if class or id selector, then apply then skip
         if(applySelector(schema.dom.el,val)) continue;

         // attributes are also directives
         // ie. 'href:', 'src:', ect
         const skipContent = applyDirectives(schema,val,elementArray);
         // in case the content is used by the directive, skip the content
         // dont want to repeat rendering the content
         if(skipContent) i = elementArray.length-1;

         // transclusion is indicated by '>', so swap it with the content
         // isElementArray below will identify it as an elementArray and render it
         if(isTransclusion(val)) val = schema.content;
     }

     // if its an elementArray it will either be an plain element or a component
     // either way it will be setup with a subElement nested within this schema.dom.el
     // another level of traversal will occur, doing further down the nestings
     if(isElementArray(val))
       renderElementArray(schema,val);

   }
};

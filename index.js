"use strict";

const component = {
  data:{
    intro: 'intro'
  },
  template:
    ['section', '#intro',
        ['h1', '@intro'],
        ['p', '.text', { Intro: {title: 'hello world'} }]
    ],
  styles: {
    '#intro': {
      color: 'green',
      padding: '10px'
    }
  },
  clicked: (e) => {
    this.setData({intro: 'clicked'})
  }
}

class JAHL{

  constructor(){

  }

  render(obj){

    const HREF = /^\href:\s+/;
    const ID = /^\#/;
    const CLAS = /^\./;

    let root = document.getElementById('root');
    let parent = root;
    let el = null;
    const self = obj;

    const traverse = (node) => {

       for(let i=0; i < node.length; i++){

         const prop = i;
         const val = node[i];

         if(typeof val == 'string'){

             const href = val.match(HREF);
             if(href)
                 el.href = val.replace(HREF,'');

             const id = val.match(ID);
             if(id)
                 el.id = val.replace(ID,'');

             const clas = val.match(CLAS);
             if(clas)
                 el.className = val.replace(CLAS,'');
         }

         if(Array.isArray(val)){
           el = document.createElement(val[0]);
           if(typeof val[val.length-1] == 'string')
             el.innerHTML = val[val.length-1];
           el.parent = parent;
           parent.appendChild(el);
           parent = el;
           traverse(val);
         }
         else if(i == node.length-1) parent = el.parent;


       }
    };

    traverse(obj);
    console.log(root.innerHTML);
  }
}

const jahl = new JAHL();
jahl.render([component.template]);

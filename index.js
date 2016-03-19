"use strict";

const component = {
  data:{
    intro: 'this is it'
  },
  template:
    ['section', '#intro', ['!onclick', 'clicked'],
        ['h1', '@intro'],
        ['p', '.text']
    ],
  styles: {
    '#intro': {
      color: 'green',
      padding: '10px'
    }
  },
  clicked: (self,e) => {
    console.log('hovver');
    self.setData({intro: 'clicked'})
  }
}

class JAHL{

  constructor(){

  }

  render(obj){

    const HREF = /^\href:\s+/;
    const ID = /^\#/;
    const CLAS = /^\./;
    const DATA = /^\@/;
    const EVENT = /^\!/;

    let root = document.getElementById('root');
    root.innerHTML = '';
    let parent = root;
    let el = null;

    var jahl = this;
    obj.setData = (data) => {
      for(var item in data){
        obj.data[item] = data[item];
      }
      jahl.render(obj);
    }

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

             const data = val.match(DATA);
             if(data)
                 el.innerHTML = obj.data[val.replace(DATA,'')];
         }

         if(Array.isArray(val)){
           const event = val[0].match(EVENT);
           if(event){
             el[val[0].replace(EVENT,'')] = (e) => {
               obj[val[1]](obj,e);
             }
           }
           else{
             el = document.createElement(val[0]);
             if(typeof val[val.length-1] == 'string')
               el.innerHTML = val[val.length-1];
             el.parent = parent;
             parent.appendChild(el);
             parent = el;
             traverse(val);
           }
         }
         else if(i == node.length-1) parent = el.parent;


       }
    };

    traverse([obj.template]);
    console.log(root.innerHTML);
  }
}

const jahl = new JAHL();
jahl.render(component);

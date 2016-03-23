import {
  getAttribute,
  applySelector,
  getDataFromVar
} from './utils';

import {
  CHECK,
  REPLACE,
  GET
} from './exr';

import {
  buildElement
} from './core';

export const Directives = [

  {
    regex: GET('ATTR'),
    method: (obj,dom,val) => {
        const attribute = getAttribute(obj,val);
        dom.el.setAttribute(attribute.attr,attribute.value);
    }
  },

  {
    regex: GET('DATA'),
    method: (obj,dom,val) => {
      const data = getDataFromVar(obj,val);
       if(!applySelector(dom.el,data))
        dom.el.innerHTML = data;
    }
  },

   {
    regex: GET('EVENT'),
    method: (obj,dom,val) => {
      var format = val.replace('!','').replace(/\s/,'').split(':');
      dom.el[format[0]] = (e) => {
        obj[format[1]](obj,e);
      }
    }
  },

  {
    regex: GET('IF'),
    method: (obj,dom,val) => {
      const exp = val.replace(/^\?\s+/,'');
      if(CHECK(exp,'DATA')){
        const data = obj.data[REPLACE(exp,'DATA','')];
        if(!data) dom.el.style.display = 'none';
      }
    }
  },

  {
    regex: GET('FOR'),
    method: (obj,dom,val,node) => {
      const args = val.replace(GET('FOR'),'').split(/\s+\in\s+/);
      const data = obj.data[args[1].replace(GET('DATA'),'')];
      const temp = args[0].replace(GET('DATA'),'');
      for(let item in data){
        obj.data[temp] = data[item];
        buildElement(obj,dom,node[node.length-1])
      }
      return true;
    }
  }

]

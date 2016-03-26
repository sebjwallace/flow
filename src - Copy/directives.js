import {
  getAttribute,
  applySelector,
  getDataFromVar,
  getContent
} from './utils';

import {
  CHECK,
  REPLACE,
  GET
} from './exr';

import {
  renderElementArray
} from './core';

const Directives = [

  {
    regex: GET('ATTR'),
    method: (schema,val) => {
        const attribute = getAttribute(schema,val);
        schema.dom.el.setAttribute(attribute.attr,attribute.value);
    }
  },

  {
    regex: GET('DATA'),
    method: (schema,val) => {
      const data = getDataFromVar(schema,val);
       if(!applySelector(schema.dom.el,data))
        schema.dom.el.innerHTML = data;
    }
  },

   {
    regex: GET('EVENT'),
    method: (schema,val) => {
      var format = val.replace('!','').replace(/\s/,'').split(':');
      schema.dom.el[format[0]] = (e) => {
        schema[format[1]](schema,e);
      }
    }
  },

  {
    regex: GET('IF'),
    method: (schema,val) => {
      const exp = val.replace(/^\?\s+/,'');
      if(CHECK(exp,'DATA')){
        const data = schema.data[REPLACE(exp,'DATA','')];
        if(!data) schema.dom.el.style.display = 'none';
      }
    }
  },

  {
    regex: GET('FOR'),
    method: (schema,val,template) => {
      const args = val.replace(GET('FOR'),'').split(/\s+\in\s+/);
      const data = schema.data[args[1].replace(GET('DATA'),'')];
      const temp = args[0].replace(GET('DATA'),'');
      for(let item in data){
        schema.data[temp] = data[item];
        renderElementArray(schema,getContent(template))
      }
      return true;
    }
  }

]

export const applyDirectives = (schema,val,elementArray) => {
  let skipContent = false;
   for(let directive in Directives){
     if(val.match(Directives[directive].regex)){
       const skip = Directives[directive].method(schema,val,elementArray);
       if(skip) skipContent = true;
     }
   }
   return skipContent;
}

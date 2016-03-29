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
    method: (component,dom,val) => {
        const attribute = getAttribute(component,val);
        dom.el.setAttribute(attribute.attr,attribute.value);
    }
  },

  {
    regex: GET('DATA'),
    method: (component,dom,val) => {
      const data = getDataFromVar(component,val);
       if(!applySelector(dom.el,data))
        dom.el.innerHTML = data;
    }
  },

   {
    regex: GET('EVENT'),
    method: (component,dom,val) => {
      const format = val.replace('!','').replace(/\s/,'').split(':');
      const domEvent = format[0];
      let event = format[1];
      let params = event.match(/\([\$a-z,A-Z.]+\)/)
      event = event.replace(/\([\$a-z,A-Z.]+\)/,'')
      if(params){
        params = params[0].replace(/\(|\)/g,'').split(',');
        for(let param in params){
          params[param] = getDataFromVar(component,params[param])
        }
      }
      if(domEvent.match(/[0-9]/)){
        dom.el.addEventListener('keypress', (e) => {
          const key = e.which || e.keyCode;
          if(key == domEvent){
            let args = [component,e];
            args = args.concat(params);
            component[event].apply(this,args);
          }
        })
      }
      else{
        dom.el[domEvent] = (e) => {
          let args = [component,e];
          args = args.concat(params);
          component[event].apply(this,args);
        }
      }
    }
  },

  {
   regex: /^[a-z,A-Z]+\(\)/,
   method: (component,dom,val) => {
     dom.el[val.replace(/\(\)/,'')]()
   }
 },

  {
    regex: GET('IF'),
    method: (component,dom,val) => {
      const exp = val.replace(/^\?\s+/,'');
      if(CHECK(exp,'DATA')){
        const data = component.data[REPLACE(exp,'DATA','')];
        if(!data) dom.el.style.display = 'none';
      }
    }
  },

  {
    regex: GET('FOR'),
    method: (component,dom,val,template) => {
      const args = val.replace(GET('FOR'),'').split(/\s+\in\s+/);
      const data = component.data[args[1].replace(GET('DATA'),'')];
      const temp = args[0].replace(GET('DATA'),'');
      for(let item in data){
        component.data[temp] = data[item];
        component.data['$'] = item;
        renderElementArray(component,dom,getContent(template))
      }
      return true;
    }
  }

]

export const driveDirectives = (val,dom,component,template) => {
  let skipped = false;
    Directives.forEach((directive) => {
        if(val.match(directive.regex)){
          const skip = directive.method(component,dom,val,template);
          if(skip) skipped = true;
        }
    });
   return skipped;
}

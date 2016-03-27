
const events = {};
let nestings = [];

const setEvent = (event,fn) => {
  if(!events[event]) events[event] = [];
  events[event].push(fn);
}

const triggerEvent = (event) => {
  events[event].forEach((e) => {
    e()
  })
}

const directives = {
  '!': (arr,id,component) => {
    const event = arr[0].replace('!','');
    const morph = cloneSwitch(arr,id);
    const el = component.root.querySelectorAll(id)[0];
    const isTrigger = arr[1].match(/^\@/);
    if(isTrigger) el[event] = () => { triggerEvent(arr[1]) }
    else el[event] = () => { component.setStyles([morph]) };
    return '';
  },
  '@': (arr,id,component) => {
    const binding = arr[0].replace(/^\@/,'');
    const morph = cloneSwitch(arr,id);
    setEvent(arr[0],() => {
      component.setStyles([morph])
    })
    return '';
  },
  '>': (arr,id) => {
    arr[0] = id + arr[0].replace('>','');
    nestings.push(arr);
    return '';
  },
  'DEFAULT': (arr,id,component) => {
    return compile([arr],component)
  },
}

const cloneSwitch = (arr,selector) => {
  const morph = arr.slice();
  morph[0] = selector;
  return morph;
}

const isInclude = (test) => {
  return test.match(/^\*$/)
}

const compile = (styles,component,naked) => {
  var css = '';
  styles.map(function(style){
    const id = style[0];
    if(!naked) css += '.' + component.key + ' ' + id + '{';
    style.map(function(attr,i){
      if(i == 0) return;
      const token = attr[0][0];
      if(Array.isArray(attr)){
        if(isInclude(token))
          css += compile([attr],component,true)
        else
          (directives[token] || directives['DEFAULT'])(attr,id,component)
        return;
      }
      else{
        css += attr.replace(/\s+/,':') + ';';
      }
    })
    if(!naked) css += '}';
  })
  return css;
}

export const renderCSS = (styles,component) => {
  var css = '';
  css += compile(styles,component);
  if (nestings.length > 0){
    css += compile(nestings,component);
    nestings = [];
  }
  mount(css,component);
}

const mount = (cssString,component) => {
  const id = 'rs-'+ component.key + cssString.length;
  let mounted = document.getElementById(id);
  if(!mounted){
    const stylesContainer = document.getElementById('--rendered-styles');
    mounted = document.createElement('style');
    mounted.id = id;
    stylesContainer.appendChild(mounted);
  }
  mounted.innerHTML = cssString;
}

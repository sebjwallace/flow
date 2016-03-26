
const events = {};

const setEvent = (event,fn) => {
  if(!events[event]) events[event] = [];
  events[event].push(fn);
}

const triggerEvent = (event) => {
  events[event].forEach((e) => {
    e()
  })
}

let nestings = [];

const compile = (styles,component,naked) => {
  var css = '';
  styles.map(function(style){
    var id = style[0];
    if(!naked) css += '.' + component.key + ' ' + id + '{';
    style.map(function(attr,i){
      if(i == 0) return;
      if(Array.isArray(attr)){
        if(attr[0].match(/^\*$/))
          css += compile([attr],component,true)
        else if(attr[0].match(/^\>\s+/)){
          attr[0] = style[0] + attr[0].replace('>','');
          nestings.push(attr);
        }
        else if(attr[0].match(/^\!/)){
          const event = attr[0].replace('!','');
          const morph = attr.slice();
          morph[0] = style[0];
          const scope = document.getElementsByClassName(component.key)[0];
          const el = scope.querySelectorAll(style[0])[0];
          const isTrigger = attr[1].match(/^\@/);
          if(isTrigger) el[event] = () => { triggerEvent(attr[1]) }
          else el[event] = () => { component.setStyles([morph]) };
        }
        else if(attr[0].match(/^\@/)){
          const binding = attr[0].replace(/^\@/,'');
          const morph = attr.slice();
          morph[0] = style[0];
          setEvent(attr[0],() => {
            component.setStyles([morph])
          })
        }
        else css += compile([attr],component);
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

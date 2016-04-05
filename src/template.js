
Schema.render = (function(){

var storeComponent = Schema.components.storeComponent
var componentExists = Schema.components.componentExists


var reject = (val,type) => {
  if(typeof val != type) return true
}

var accept = (val,type) => {
  return !reject(val,type)
}

var rejectString = (val) => {
  return reject(val,'string')
}

var rejectFunction = (val) => {
  return reject(val,'function')
}

var rejectObject = (val) => {
  return reject(val,'object')
}

var rejectArray = (val) => {
  return !Array.isArray(val)
}

var isSchema = (val) => {
  return typeof val[0] == 'object'
}

var randomNumber = (limit) => {
  var num = (Math.random() * 10) + ''
  return num.replace('.','').substring(0,limit)
}

var ESCAPE_VAR = /\$|\!/


var nestedVariable = (v,component) => {
  if(!v.match(/\./)) return v

  var variable

  var nesting = v.split('.')
  var baseSpace = nesting
    .splice(0,1)
    .join('')
    .replace(ESCAPE_VAR,'')
  var base = component.data[baseSpace]

  if(!base) return undefined

  for(var s in nesting) {
    var escapedVar = nesting[s].replace(ESCAPE_VAR,'')
    base = base[escapedVar]
    if(s == nesting.length-1)
      variable = base
  }

  return variable

}

var getVariable = (val,component) => {
  if(typeof val != 'string') return val
  if(!val.match(/^\$/)) return val

  var nested = nestedVariable(val,component)
  if(nested == val)
    return component.data[val.replace(ESCAPE_VAR,'')]

  return nested

}


// #clone
var clone = (schema) => {

  var injectData = null
  if(schema.length == 2)
    injectData = schema[1]

  schema = schema[0]

  var clone = JSON.parse(JSON.stringify(schema))

  if(injectData){
    if(!clone.data)
      clone.data = {}
    for(var d in injectData){
      clone.data[d] = injectData[d]
    }
  }

  for(var key in schema){
    if(!rejectFunction(schema[key])){
      if(key == 'template')
        clone.template = schema[key](schema)
      else clone[key] = schema[key]
    }
  }

  return clone

}


// #initalize

var initalize = (clone) => {

  clone.key = randomNumber(4)
  clone.setData = (data) => {
    for(var item in data){
      clone.data[item] = data[item]
    }
    render([clone])
  }
  clone.setStyles = (styles) => {}
  clone.emit = Schema.emit

  clone.models = {};

  for(var data in clone.data){
    var modelBinding = clone.data[data]

    if(typeof modelBinding != 'string') continue
    if(modelBinding[0] != '@') continue

    var modelName = modelBinding.replace('@','')
    clone.data[data] = Schema.model.attach(modelName,clone)
    clone.models[modelName] = data
  }

  return clone

}



// #filters

var filters = {
  '==': (v,component) => {
    var m = v.map((e) => {
      return getVariable(e,component)
    })
    if(m[1] == m[2])
      return m[3]
    if(m[4])
      return m[4]
    return ''
  },
  '%': (val,component) => {
    var child = val[1].replace(ESCAPE_VAR,'')
    var parent = val[2]
    var parentData = getVariable(parent,component)
    var el = val[3]
    var html = ''
    for(var v in parentData){
      component.data[child] = parentData[v]
      component.data['i'] = v
      html += compile(el,component)
    }
    return html
  },
  '/': () => {
    if(window)
      return '/' + window.location.hash
  },
  '/==': (val) => {
    if(!window) return val
    if(val[1] == window.location.hash)
      return val[2]
    else return ''
  },
  '/|': (val,component) => {
    if(!window) return val
    var re = new RegExp(val[1])
    if(window.location.hash.match(re))
      return ''
    if(getVariable(val[2],component) != val[3])
      return 'style: display:none'
    else return ''
  },
  'DEFAULT': (val) => {
    return val
  }
}

var directives = {
  '!': (val,component) => {
    val = val.replace('!','')
    val = val.split(' ')

    var method = "Schema.event('"+ component.key +"','"+ val[1] +"',event)"
    var build = val[0] + ' ' + method

    if(val[0].match(/[0-9]/))
      return directives['!KEYBOARD'](val[0],method)
    return build
  },
  '!KEYBOARD': (keyCode,method) => {
    return 'onkeypress: '
      + 'if(event.keyCode == '+ keyCode.replace(':','') +'){'+ method +'}'
  },
  '[': () => {

  },
  'DEFAULT': (val) => {
    return val
  }
}


var processDirective = (val,component) => {
  if(rejectString(val)) return val
  return (directives[val[0]] || directives['DEFAULT'])(val,component)
}

var processFunction = (val,component) => {
  if(rejectFunction(val)) return val
  else return val(component)
}

var processFilter = (val,component) => {
  if(rejectArray(val)) return val
  var token = val[0]
  return (filters[token] || filters['DEFAULT'])(val,component)
}

var parseVariable = (val,component) => {
  if(rejectString(val)) return val

  var variables = val.match(/\$[a-zA-Z_\.]+(\!?)(|\s)/g)
  if(!variables) return val

  for(var vari in variables){
    var v = variables[vari]
    var variable = getVariable(v,component)
    val = val.replace(v, variable)
  }

  return val

}

var parseAttribute = (val) => {
  if(rejectString(val)) return val
  if(!val.match(/^[a-zA-Z_]+\:/)) return val
  var pair = val
    .replace(' ','')
    .replace(':','_:_')
    .split('_:_')
  return ' ' + pair[0] + '="' + pair[1] + '"'
}

var parseSelector = (val) => {
  if(rejectString(val)) return val

  if(val.match(/^\#/)){
    return ' id="' + val.replace('#','') + '"'
  }
  else if(val.match(/(\s|^)+\.[a-zA-Z_-]/g)){
    return ' class="' + val.replace(/\./g,'') + '"'
  }

  if(!val.match(/(\s|^)+\.[a-zA-Z_-]/g)) return val

}


var parseTag = (tag) => {

  var close = tag
  var open = parseSelector(tag)
  if(tag != open){
    open = 'div' + open
    close = 'div'
  }


  return (format) => {
    var split = format
      .replace('_$_','!$!')
      .replace(/\_\$\_/g,'')
      .split('!$!')

    var content = split[1] || ''

    return '<' + open + split[0] + '>' + content + '</' + close + '>'
  }
}


var stamp = (element,component,tracked) => {
  if(tracked){
    if(!Schema.TESTING){

      for(var c in component.current){
        if(element.indexOf(component.current[c]) != -1)
          return element
      }

      var sid = component.key + 'e' + component.current.length
      element = element.replace('>', ' scid="' + sid + '">')
    }
    component.current.push(element)
  }
  return element
}


var compile = (template,component,tracked) => {

  if(rejectArray(template))
    return template

  var wrapTags = parseTag(template[0])

  var composite = template.map((t,i) => {

    if(i == 0) return ''

    var item = t

    // functions and filters always return something to match below

    item = processFunction(item,component)

    // filters are also arrays, collapse them and send them down
    item = processFilter(item,component)


    item = processDirective(item,component)

    // a variable could be an attribute or content
    item = parseVariable(item,component)


    // all derivatives have been compiled

    // check if item is an attribute or selector
    var check = item

    item = parseAttribute(item)

    item = parseSelector(item)


    // if not an attribute, get its content
    if(check != item || check == "") return item

    // if its a schema get the string
    item = render(item)

    // if its an arrayElement get the string
    item = compile(item,component,true)


    return '_$_' + item


  }).join('')

  var element = wrapTags(composite)

  element = stamp(element,component,tracked)

  return element

}


// #render


var track = (component) => {
  if(!component.current)
    component.current = []
  if(!component.prev)
    component.prev = []
  else{
    component.prev = component.current
    component.current = []
  }
}

var diff = (component) => {
  var diff = []
  for(var i = 0; i < component.current.length; i++){
    if(component.current[i] != component.prev[i])
      diff.push({
        prev: component.prev[i],
        current : component.current[i]
      })
  }
  return diff
}

var render = (schema,root) => {

  if(!isSchema(schema))
    return schema

  var composite
  var component = componentExists(schema)

  if(component){
    track(component)
    composite = compile(
      component.template,
      component,
      true
    )
  }
  else {
    component = clone(schema)
    component = initalize(component)

    track(component)
    composite = compile(
      component.template,
      component,
      true
    )

    storeComponent(component)
    component.root = root
  }

  if(component.rendered && !Schema.TESTING){
    var diffs = diff(component)

    for(var d in diffs){
      var attr = diffs[d].current.match(/[0-9]+\e[0-9]+/)[0]
      var oldEl = document.querySelectorAll('[scid="' + attr + '"]')[0]
      oldEl.outerHTML = diffs[d].current
    }
  }
  else if(component.root)
    component.root.innerHTML = composite

  if(component.init && !component.rendered){
    component.rendered = true
    component.init(component)
  }

  diff(component)

  return composite

}


return render

})();


"use strict";


var test = (desc,fn) => {
  var equal = (a,b) => {
    if(a == b)
      console.log('%c *** ' + desc,'color: green')
    else{
      console.log('%c !!! ' + desc,'color: yellow') 
      console.log('%c expected ' + b,'color: yellow')
      console.log('%c but got ' + a,'color: yellow')
    }
  }
  fn(equal)
}






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

var alpha = (val) => {
  return val[0]
}



var clone = (schema) => {
  
  var clone = JSON.parse(JSON.stringify(schema))
  
  for(var key in schema){
    if(!rejectFunction(schema[key])){
      if(key == 'template')
        clone.template = schema[key](schema)
      else clone[key] = schema[key]
    }
  }
  
  return clone
  
}


var initalize = (clone) => {
  
  clone.key = 4
  clone.setData = (data) => {}
  clone.setStyles = (styles) => {}
  clone.emit = (action) => {}
  
  return clone
  
}







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
  '/|': () => {
    
  },
  'DEFAULT': (val) => {
    return val
  }
}

var directives = {
  '!': (val,component) => {
    val = val.replace('!','')
    val = val.split(' ')
    var build = val[0] + ' ' + val[1]
    return build
  },
  '%': () => {
    
  },
  '[': () => {
    
  },
  'DEFAULT': (val) => {
    return val
  }
}


var processDirective = (val,component) => {
  if(rejectString(val)) return val
  return (directives[alpha(val)] || directives['DEFAULT'])(val,component)
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

var getVariable = (val,component) => {
  if(rejectString(val)) return val
  if(!val.match(/\$/)) return val
  var vari = val.replace('$','')
  return component.data[vari]
}

var parseAttribute = (val) => {
  if(rejectString(val)) return val
  if(!val.match(/\:/)) return val
  var pair = val.replace(' ','').split(':')
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


var compile = (template,component) => {
    
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
    item = getVariable(item,component)

    
    // all derivatives have been compiled

    // check if item is an attribute or selector
    var check = item

    item = parseAttribute(item)

    item = parseSelector(item)


    // if not an attribute, its content
    if(check != item) return item

    // if its an arrayElement get the string
    item = compile(item,component)
    
    // if its a schema get the string
    item = render(item)

    return '_$_' + item


  }).join('')

  return wrapTags(composite)

}


var render = (schema) => {
  
  if(rejectObject(schema))
    return schema
  
  var component = clone(schema)
  
	component = initalize(component)
  
  return compile(
    component.template,
    component
  )
  
}








var Sub = {
  template: ['section', 'this is the sub']
}

var Schematic = {
  data: {
    title: 'This is the sub text'
  },
  template: (self) => {
    return ['div',
     '.header',
     ['==', 'a', 'a', 'href: yoyoyo'],
     '!onclick: func',
     ['div', '$title'],
     Sub
    ]
  },
  init: (self) => {
    console.log('this is working...' + self.data.title)
  }
}

var a = render(Schematic)

console.log(a)




test('can return variables', (equal) => {

  var s = {
    data: { body: 'this is body text' },
    template: ['div', '$body']
  }

  var r = render(s)

  equal(r,'<div>this is body text</div>')

})

test('can parse attributes', (equal) => {

  var s = {
    template: ['a', 'href: www.github.com', 'github']
  }

  var r = render(s)

  equal(r,'<a href="www.github.com">github</a>')

})

test('can nest elementArrays', (equal) => {

  var s = {
    template: ['a', 'href: www.github.com',
      ['h1', 'github']
    ]
  }

  var r = render(s)

  equal(r,'<a href="www.github.com"><h1>github</h1></a>')

})

test('can nest deep nested elementArrays', (equal) => {

  var s = {
    template: ['section',
      ['h1', 'Title'],
      ['ul',
        ['li',
          ['a', 'link1']
        ],
        ['li',
          ['a', 'link2']
        ]
      ]
    ]
  }

  var r = render(s)

  equal(r,'<section><h1>Title</h1><ul><li><a>link1</a></li><li><a>link2</a></li></ul></section>')

})

test('can compile filters', (equal) => {

  var s = {
    data: { name: 'tom' },
    template: ['div',
      ['==', '$name', 'tom', '.nameClass']
    ]
  }

  var r = render(s)

  equal(r,'<div class="nameClass"></div>')

})

test('can parse ids', (equal) => {

  var s = {
    template: ['div', '#anId', '']
  }

  var r = render(s)

  equal(r,'<div id="anId"></div>')

})

test('can parse classes', (equal) => {

  var s = {
    template: ['div', '.a', '']
  }

  var r = render(s)

  equal(r,'<div class="a"></div>')

})

test('can parse multiple classes', (equal) => {

  var s = {
    template: ['div', '.a .b', '']
  }

  var r = render(s)

  equal(r,'<div class="a b"></div>')

})

test('can parse id as the tag', (equal) => {

  var s = {
    template: ['#theId', '']
  }

  var r = render(s)

  equal(r,'<div id="theId"></div>')

})
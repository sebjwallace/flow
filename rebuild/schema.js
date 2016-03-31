
"use strict";


var test = (desc,fn) => {
  var success = () => {
    console.log('%c *** ' + desc,'color: green')
  }
  var failure = (a,b) => {
    console.log('%c !!! ' + desc,'color: yellow') 
    console.log('%c expected ' + b,'color: yellow')
    console.log('%c but got ' + a,'color: yellow')
  }
  var equal = (a,b) => {
    if(a == b)
      success()
    else{
      failure(a,b)
    }
  }
  var contains = (a,b) => {
    if(a.indexOf(b) != -1)
      success()
    else failure(a,b)
  }
  fn(equal,contains)
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

  for(var s in nesting) {
    var escapedVar = nesting[s].replace(ESCAPE_VAR,'')
    base = base[escapedVar]
    if(s == nesting.length-1)
      variable = base
  }

  return variable

}

var getVariable = (val,component) => {
  if(!val.match(/^\$/)) return val

  var nested = nestedVariable(val,component)
  if(nested == val)
    return component.data[val.replace(ESCAPE_VAR,'')]

  return nested
  
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
  
  clone.key = randomNumber(4)
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

    var method = "Schema.event('"+ component.key +"','"+ val[1] +"')"
    var build = val[0] + ' ' + method

    if(val[0].match(/[0-9]/))
      return directives['!KEYBOARD'](val[0],method)
    return build
  },
  '!KEYBOARD': (keyCode,method) => {
    return 'onkeypress: '
      + 'function(e){if(e.keyCode == '+ keyCode.replace(':','') +'){'+ method +'}}'
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
    item = parseVariable(item,component)

    
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

test('can parse classes as the tag', (equal) => {

  var s = {
    template: ['.a .b .c', '']
  }

  var r = render(s)

  equal(r,'<div class="a b c"></div>')

})

test('can parse attribute from variable', (equal) => {

  var s = {
    data: { color: 'color:blue' },
    template: ['span', 'style:$color ']
  }

  var r = render(s)

  equal(r,'<span style="color:blue"></span>')

})

test('can parse selector from variable', (equal) => {

  var s = {
    data: { id: '#thisId' },
    template: ['span', '$id']
  }

  var r = render(s)

  equal(r,'<span id="thisId"></span>')

})

test('can parse selector from variable with concatination', (equal) => {

  var s = {
    data: { id: 'thisId' },
    template: ['span', '#$id']
  }

  var r = render(s)

  equal(r,'<span id="thisId"></span>')

})

test('can parse nested variables', (equal) => {

  var s = {
    data: {
      person: {
        name: {
          first: 'tom',
          last: 'miller'
        },
        age: 24
      }
    },
    template: ['i', '$person.name.first $person.name.last is $person.age']
  }

  var r = render(s)

  equal(r,'<i>tom miller is 24</i>')

})

test('can loop through an array using a filter', (equal) => {

  var s = {
    data: {
      items: ['milk','bread','jelly']
    },
    template: ['ul',
      ['%', '$item', '$items',
        ['li', '$item']
      ]
    ]
  }

  var r = render(s)

  equal(r,'<ul><li>milk</li><li>bread</li><li>jelly</li></ul>')

})

test('can loop through an object using a filter', (equal) => {

  var s = {
    data: {
      items: {
        milk: '1.20',
        bread: '1.50',
        jelly: '0.90'
      }
    },
    template: ['ul',
      ['%', '$item', '$items',
        ['li', '$i : $item']
      ]
    ]
  }

  var r = render(s)

  equal(r,'<ul><li>milk : 1.20</li><li>bread : 1.50</li><li>jelly : 0.90</li></ul>')

})

test('can loop through nested objects using a filter', (equal) => {

  var s = {
    data: {
      items: {
        milk: { price: '1.20', quantity: 1 },
        bread: { price: '1.50', quantity: 2 },
        jelly: { price: '0.90', quantity: 1 }
      }
    },
    template: ['ul',
      ['%', '$item', '$items',
        ['li', '$item.quantity!x $i : $item.price']
      ]
    ]
  }

  var r = render(s)

  equal(r,'<ul><li>1x milk : 1.20</li><li>2x bread : 1.50</li><li>1x jelly : 0.90</li></ul>')

})

test('can render an event directive', (equal,contains) => {

  var s = {
    template: ['div', '!onclick: clicked()']
  }

  var r = render(s)

  contains(r,'<div onclick="Schema.event(')
  contains(r, ',\'clicked()\')"></div>')

})

test('can render a keyboard event directive', (equal,contains) => {

  var s = {
    template: ['div', '!13: clicked()']
  }

  var r = render(s)

  contains(r,'<div onkeypress="function(e){if(e.keyCode == 13){Schema.event(')
  contains(r, ',\'clicked()\')}}"></div>')
  
})

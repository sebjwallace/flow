
var testCount = 1

var test = (desc,fn) => {
  var success = () => {
    console.log('%c **'+ testCount +'** ' + desc,'color: green')
  }
  var failure = (a,b) => {
    console.log('%c !! ' + desc,'color: yellow')
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
  var match = (a,b) => {
    if(a.match(b))
      success()
    else failure(a,b)
  }
  fn(equal,contains,match)
  testCount++
}


var TESTING = false


var Sub = {
  template: ['section', 'this is the sub']
}

var Schematic = {
  data: {
    title: 'An example'
  },
  template: (self) => {
    return ['#main',
      ['h1', '$title'],
      [Sub, { title: 'this is a title' }],
      ['ul',
        ['li', ['a', 'href: www.github.com', 'github']],
        ['li', ['a', 'href: www.codepen.com', 'codepen']],
      ]
    ]
  },
  init: (self) => {
    self.setData({
      title: 'Updated'
    })
  }
}

var a = Schema.render([Schematic],document.getElementById('root'))

console.log(a)


TESTING = true


test('can return variables', (equal) => {

  var s = {
    data: { body: 'this is body text' },
    template: ['div', '$body']
  }

  var r = Schema.render([s])

  equal(r,'<div>this is body text</div>')

})

test('can parse attributes', (equal) => {

  var s = {
    template: ['a', 'href: www.github.com', 'github']
  }

  var r = Schema.render([s])

  equal(r,'<a href="www.github.com">github</a>')

})

test('can nest elementArrays', (equal) => {

  var s = {
    template: ['a', 'href: www.github.com',
      ['h1', 'github']
    ]
  }

  var r = Schema.render([s])

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

  var r = Schema.render([s])

  equal(r,'<section><h1>Title</h1><ul><li><a>link1</a></li><li><a>link2</a></li></ul></section>')

})

test('can compile filters', (equal) => {

  var s = {
    data: { name: 'tom' },
    template: ['div',
      ['==', '$name', 'tom', '.nameClass']
    ]
  }

  var r = Schema.render([s])

  equal(r,'<div class="nameClass"></div>')

})

test('can parse ids', (equal) => {

  var s = {
    template: ['div', '#anId', '']
  }

  var r = Schema.render([s])

  equal(r,'<div id="anId"></div>')

})

test('can parse classes', (equal) => {

  var s = {
    template: ['div', '.a', '']
  }

  var r = Schema.render([s])

  equal(r,'<div class="a"></div>')

})

test('can parse multiple classes', (equal) => {

  var s = {
    template: ['div', '.a .b', '']
  }

  var r = Schema.render([s])

  equal(r,'<div class="a b"></div>')

})

test('can parse id as the tag', (equal) => {

  var s = {
    template: ['#theId', '']
  }

  var r = Schema.render([s])

  equal(r,'<div id="theId"></div>')

})

test('can parse classes as the tag', (equal) => {

  var s = {
    template: ['.a .b .c', '']
  }

  var r = Schema.render([s])

  equal(r,'<div class="a b c"></div>')

})

test('can parse attribute from variable', (equal) => {

  var s = {
    data: { color: 'color:blue' },
    template: ['span', 'style:$color ']
  }

  var r = Schema.render([s])

  equal(r,'<span style="color:blue"></span>')

})

test('can parse selector from variable', (equal) => {

  var s = {
    data: { id: '#thisId' },
    template: ['span', '$id']
  }

  var r = Schema.render([s])

  equal(r,'<span id="thisId"></span>')

})

test('can parse selector from variable with concatination', (equal) => {

  var s = {
    data: { id: 'thisId' },
    template: ['span', '#$id']
  }

  var r = Schema.render([s])

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

  var r = Schema.render([s])

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

  var r = Schema.render([s])

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

  var r = Schema.render([s])

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

  var r = Schema.render([s])

  equal(r,'<ul><li>1x milk : 1.20</li><li>2x bread : 1.50</li><li>1x jelly : 0.90</li></ul>')

})


test('can render nested schemas', (equal) => {

  var c = {
    data: { title: 'This is the child...' },
    template: ['#child', '$title']
  }


  var p = {
    data: { title: 'This is the parent...' },
    template: ['#parent', '$title', [c] ]
  }

  var r = Schema.render([p])

  equal(r,'<div id="parent">This is the parent...<div id="child">This is the child...</div></div>')

})

test('can render nested schemas with injected data', (equal) => {

  var c = {
    data: { title: 'This is the child...' },
    template: ['#child', '$title with injected data: $injected']
  }


  var p = {
    data: { title: 'This is the parent...' },
    template: ['#parent', '$title', [c, {injected: 'injected!'}] ]
  }

  var r = Schema.render([p])

  equal(r,'<div id="parent">This is the parent...<div id="child">This is the child... with injected data: injected!</div></div>')

})


test('can render an event directive', (equal,contains) => {

  var s = {
    template: ['div', '!onclick: clicked()']
  }

  var r = Schema.render([s])

  contains(r,'<div onclick="Schema.event(')
  contains(r, ',\'clicked()\')"></div>')

})

test('can render a keyboard event directive', (equal,contains) => {

  var s = {
    template: ['div', '!13: clicked()']
  }

  var r = Schema.render([s])

  contains(r,'<div onkeypress="function(e){if(e.keyCode == 13){Schema.event(')
  contains(r, ',\'clicked()\')}}"></div>')

})

test('can store a model', (equal) => {

  model('model',{
    init: () => {
      return []
    }
  })

  equal(reach('model').name, 'model')

})

test('can emit an action to a model', (equal) => {

  model('model',{
    init: () => {
      return []
    },
    ADD: (items,args) => {
      items.push(args.val)
      return items
    }
  })

  emit('ADD',{
    val: 'first item'
  })

  equal(reach('model').data[0], 'first item')

})

test('can sync a component with a model', (equal) => {

  model('Item',{
    init: () => {
      return ''
    },
    SET_ITEM: (items,args) => {
      return args.item
    }
  })

  emit('SET_ITEM',{
    item: 'the item'
  })

  var c = {
    data: { item: '@Item' },
    template: ['h1', '$item']
  }

  var r = Schema.render([c])

  equal(r, '<h1>the item</h1>')

})

test('can emit an action from a component', (equal) => {

  model('EmitItem',{
    init: () => {
      return {item: 'no emit yet'}
    },
    SET_ITEM: (items,newItem) => {
      return newItem
    }
  })

  var c = {
    data: { item: '@EmitItem' },
    template: ['h1', '$item.item'],
    init: (self) => {
      self.emit('SET_ITEM', {
       item: 'item from component'
      })
    }
  }

  var r = Schema.render([c])

  equal(reach('EmitItem').data.item, 'item from component')

})


test('can have component access router', (equal) => {

  var s = {
    template: ['div',
      ['/']
    ]
  }

  var r = Schema.render([s])

  equal(r, '<div>/'+ window.location.hash +'</div>')

})

test('can have component render attribute if router condition truthy', (equal) => {

  var s = {
    template: ['a',
      ['/==', '#list', 'href: /link']
    ]
  }

  window.location.hash = 'list'

  var r = Schema.render([s])

  equal(r, '<a href="/link"></a>')

})

test('can have component render element if router condition truthy', (equal) => {

  var s = {
    template: ['div',
      ['/==', '#list',
        ['h1', 'hash is #list']
      ]
    ]
  }

  window.location.hash = 'list'

  var r = Schema.render([s])

  equal(r, '<div><h1>hash is #list</h1></div>')

})

test('can have component filter element by hash and condition', (equal) => {

  var s = {
    data: {
      items: [
        {title: 'milk', quantity: 2},
        {title: 'bread', quantity: 1},
        {title: 'ham', quantity: 1},
      ]
    },
    template: ['ul',
      ['%', '$item', '$items',
        ['li',
          ['/|', '#items', '$item.quantity', 1],
          '$item.title'
        ]
      ]
    ]
  }

  window.location.hash = 'items'

  var r = Schema.render([s])

  equal(r, '<ul><li style="display:none">milk</li><li>bread</li><li>ham</li></ul>')

})

test('keeps track of elements being rendered', (equal) => {

  var s = {
    data: {
      things: ['a', 'b', 'c']
    },
    template: ['ul',
        ['%', '$thing', '$things',
          ['li', '$thing']
        ]
      ]
  }

  var r = Schema.render([s])

  equal(Schema.components.getLastComponent().current.length, 1)

})


// test('keeps track of changed elements', (equal) => {
//
//   var s = {
//     data: {
//       title: 'original'
//     },
//     template: ['div',
//       ['h1', '$title'],
//       ['a', 'link']
//     ],
//     init: (self) => {
//       self.setData({
//         title: 'changed'
//       })
//     }
//   }
//
//   var r = Schema.render([s])
//
//   var diffEl = diff(Schema.components.getLastComponent())
//
//   equal(diffEl[0].current, '<h1>changed</h1>')
//
// })

// test('has data attribute tags to match the changed elements in the DOM', (equal,contains,match) => {
//
//   var s = {
//     data: {
//       title: 'original'
//     },
//     template: ['div',
//       ['h1', '$title'],
//       ['a', 'link']
//     ],
//     init: (self) => {
//       self.setData({
//         title: 'changed test1'
//       })
//     }
//   }
//
//   TESTING = false
//
//   var testEl = document.createElement('div')
//   testEl.id = "test1"
//   document.body.appendChild(testEl)
//
//   var r = Schema.render([s],testEl)
//
//   var diffEl = diff(Schema.components.getLastComponent())
//
//   match(diffEl[0].current, /(<h1 scid=")[0-9e]+(">changed test1<\/h1>)/)
//
// })

test('can switch old elements with new elements in the DOM', (equal,contains,match) => {

  var s = {
    data: {
      title: 'original'
    },
    template: ['h1', '$title'],
    init: (self) => {
      self.setData({
        title: 'changed test2'
      })
    }
  }

  TESTING = false

  var testEl = document.createElement('div')
  testEl.id = "test2"
  document.body.appendChild(testEl)

  var r = Schema.render([s],testEl)

  match(testEl.innerHTML,/(<h1 scid=")[0-9e]+(">changed test2<\/h1>)/)

})

test('can parse click event and delegate it to a component method', (equal,contains,match) => {

  var s = {
    data: {
      title: 'original'
    },
    template: ['#clicktest3', '!onclick: clicked', '$title'],
    clicked: (self) => {
      self.setData({
        title: 'changed test3'
      })
    }
  }

  TESTING = false

  var testEl = document.createElement('div')
  testEl.id = "test3"
  document.body.appendChild(testEl)

  var r = Schema.render([s],testEl)

  var clicker = document.getElementById('clicktest3')
  clicker.click()

  match(testEl.innerHTML,/(>changed test3<\/div>)/)

})




// #test

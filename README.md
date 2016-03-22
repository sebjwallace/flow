## Schema Engine

Schema is a front-end library for rendering object-literal components to the DOM. Object-literal components act as schemas that describe the HTML, CSS and JS that the component encapsulates.

A component is simply an object literal, acting like a schematic for the DOM structure it describes.

```javascript
const Button = {
  data: { label: 'Submit' },
  template: ['button', '.btn', '!onclick: submit', '$label'],
  styles: {
    '.btn': {
      color: '#333',
      padding: '10px'
    }
  },
  submit: (self) => {
    self.setData({ label: 'Submitted' });
    self.setStyles({ '.btn': { color: '#ddd' } });
  }
}
```

To render a component just pass it into the SchemaEngine, along with the element to mount it to.

```javascript
  const engine = new SchemaEngine;
  engine.render(Button, document.getElementById('root'));
```

What's with the template structure? It is just an array, or an array of arrays if there's nesting.

```javascript
  ['div', '.divClass', 'This is the content of the div']
```
Will be generated directly in the DOM, but the HTML representation would look like:
```html
  <div class='divClass'>This is the content of the div</div>
```

Some sugar can come into use.

```javascript
  ['.divClass', 'This is the content of the div']
```

Some nesting.

```javascript
  ['.divClass',
    ['.childDiv', 'This is a child div']
  ]
```

The first string in the array is always a tag (id or class for divs). The last string is always the content of the tag. Everything between are attributes.

```javascript
  ['.divClass', '#parentClass', 'data-id: p1',
    ['a', 'href: https://github.com', 'Github'],
    ['img', 'src: images/icon.png', '!onclick: clicked', '']
  ]
```

The data can be rendered to the DOM using directives. '?' is an 'if' query, and '%' is a 'for' loop.

```javascript
  FoodList = {
    data: {
      list: ['milk', 'bread', 'jam']
    },
    template:['.foodList', '? $list',
      ['ul', '% $item in $list',
        ['li', '$item']
      ]
    ]
  }
  
```

Another directive, wrap - wrap the element in a containing element. Brackets either side of a tag or selector will wrap the element.

```javascript
['.content', '[.container]', '$content']
```

Dataflow is uni-directional, so when data is set, the template re-renders. When the styles are set, only the styles are re-rendered.

```javascript
  Component = {
    data: {
      title: 'Welcome'
    },
    template: ['div',
      ['button', '!onclick: changeData', 'Change Data'],
      ['button', '!onclick: changeStyles', 'Change Styles']
    ],
    styles: {
      // styles
    },
    changeData: (self) => {
      self.setData({ title: 'Changed' })
    },
    changeStyles: (self) => {
      self.setStyles({ /*styles*/ });
    }
  }
```

## Schema Engine

Schema is a front-end library for rendering object-literal components to the DOM. Object-literal components act as schemas that describe the HTML, CSS and JS that the component encapsulates.

The original intention for Schema was to help organize the structure of a website with a standard data type - object-literal. Then using objects as components to compose larger components into pages. Although there are many frameworks available that offer component architecture, Schema aims to keep the development process light and fast.

<a href="https://www.npmjs.com/package/schema.engine">NPM schema.engine</a>

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

Schema aims to abstract away from XML/HTML syntax completely, resulting in more flexible and readable code using arrays. Each array represents an element, where the last item in the array is either the content of the element, or the nesting or other elements.

```javascript
  ['div', '.divClass', 'This is the content of the div']
```
Will be generated directly in the DOM, but the HTML representation would look like:
```html
  <div class='divClass'>This is the content of the div</div>
```

```javascript
  ['ul',
    ['li', 'list item 1'],
    ['li', 'list item 2'],
    ['li', 'list item 3']
  ]
```
```html
  <ul>
    <li>list item 1</li>
    <li>list item 2</li>
    <li>list item 3</li>
  </ul>
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
Will render:
```html
<div class='foodList'>
  <ul>
    <li>milk</li>
    <li>bread</li>
    <li>jam</li>
  </ul>
</div>
```

Another directive, wrap - wrap the element in a containing element. Brackets either side of a tag or selector will wrap the element.

```javascript
['.content', '[.container]', 'This element is wrapped']
```
```html
<div class='.container'>
  <div class='.content'>
    This element is wrapped
  </div>
</div>
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

# Flow

Examples:
- [Hello world](http://codepen.io/sebjwallace/pen/mPLKJp?editors=0010)
- [Simple slider](http://codepen.io/sebjwallace/pen/JXvJym?editors=0010)
- [Simple todos app](http://codepen.io/sebjwallace/pen/ONZMRg?editors=0010)
- [Ajax example](http://codepen.io/sebjwallace/pen/YqLZNq?editors=0010)

CDN

[https://gitcdn.xyz/repo/sebjwallace/flow/master/dist/flow.js](https://gitcdn.xyz/repo/sebjwallace/flow/master/dist/flow.js)

NPM
```
npm install --save flow-core
```

Flow is a framework for building and rendering HTML & CSS using the power of Javascript & the virtual-dom.

```javascript
  $('div')
    .color('#333')
    .padding(10)
    .children(
      $('h1')
        .color('orange')
        .text('Heading')
      ,
      $('p')
        .text('This is the content')
    )
    .render()
```

Elements can be extended, to mixin styles, children or any other attribute.

```javascript
  var box =
    $()
      .width('100%')
      .padding(20)
      .background(50,80,180)
      .border(1,'solid','rgba(70,100,220)')
      
    $('#derivative')
      .extend(box)
      .color('blue')
```

Style and event declarations come in various forms.

```javascript
  $('input')
    .onclick(function(){
      console.log('clicked')
    })
    .event('onfocus', function(){
      console.log('focus')
    })
    .style('text-decoration','line-through')
```

Styles can be directly manipulated from events.

```javascript
  $('button')
    .onclick(
      $(this)
        .opacity(0.5)
    )
```

Elements can communicate through actions. A common use is to change style of various elements from a single action.

```javascript
  $('div')
    .children(
      $('button')
        .onclick('@submit')
      ,
      $('input')
        .action('@submit',
          $(this)
            .opacity(0)
        )
      ,
      $('label')
        .color('red')
        .opacity(0)
        .text('Success')
        .action('@submit',
          $(this)
            .opacity(1)
        )
    )
```

Data can be transformed into text seamlessly.

```javascript
var people = [
  {first: 'John', last: 'Doe'},
  {first: 'Jane', last: 'Doe'}
]

$('ul')
  .map(data, function(person){
    return $('li')
      .text(person.first + person.last)
  })
```

Data can be updated from events by wrapping the virtual element in a function.

```javascript
  function element(data){
    return $()
      .text(data)
      .onclick(function(){
        element('clicked').render()
      })
  }
  
  element('not clicked yet').render()
```

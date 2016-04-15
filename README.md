# Schema

Schema is a library for building and rendering HTML & CSS using the power of Javascript & the virtual-dom.

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
      .width('100%)
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

There is much more to come, so watch this space!

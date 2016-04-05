
var Schema = {}

Schema.TESTING = false

/*

The elementArrays are only interpreted once. After that instead of an
array tree its an object tree. Each elementObject observes the data
its bound to. Only the elements that are bound to the changing data
render.

Each element is an observer of data. When the data updates the element
renders. So each element has remote state. Every part of the element
is a function: an attribute is a function, the tag name is a function.

data: { title: 'the thing' }

elementArray = [div .thing !clicked
  [h1 $title]
]

elementObject = (data) => {
  return string
}

Element{
  component
  array

  cache
  tagName
  attributes
  events
  data
  children
  render
}

*/

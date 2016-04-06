import {directives} from './directives'
import {getDataFromVar} from './utils'
import {compile} from './compile'

var virtualElement = require('virtual-dom/h')

const isString = (str) => {
  return typeof str == 'string'
}

const isArray = (arr) => {
  return Array.isArray(arr)
}

const isObject = (obj) => {
  if(isArray(obj)) return false
  return (typeof obj == 'object')
}

const isComponent = (obj) => {
  if(typeof obj == 'function') return true
  if(!isObject(obj)) return false
  if(obj.template) return true
  else return false
}

const isAttribute = (obj) => {
  if(!isObject(obj)) return false
  if(isComponent(obj)) return false
  else return true
}

const isDirective = (token) => {
  return directives[token]
}

const getToken = (arr) => {
  return arr[0]
}

const getLastSlot = (arr) => {
  return arr[arr.length -1]
}

const applyDirective = (arr,data,component) => {
  const token = getToken(arr)
  return directives[token](arr,data,component)
}

export const render = (arr,data,component) => {

  // arrays could either be a directive or an element
  // directive: ['==', 'a', 'b', [element] ]
  // component: [Object/Function, [params], [children] ]
  // element: ['div', 'content']
  // if its a directive apply and return

  const token = getToken(arr)

  if(isDirective(token))
    return applyDirective(arr,data,component)

  const nestedComponent = token

  if(isComponent(nestedComponent)){
    var args = arr[1].map((arg) => { return getDataFromVar(arg,data) })
    console.log(args)
    return compile(
      nestedComponent.apply(nestedComponent,args)
    )
  }

  // else the array is an element and shall be interpreted
  // each element is constructed of a tag, attributes and content
  // these constructs will be passed to a virtual element

  const tag = nestedComponent
  var attributes = {}
  var content = []

  // the content will be a result of rendering nested elements
  // the map method will return nested elements as rendered virtual elements
  // it will also mutate the attributes object additivly

  content = arr.map((slot) => {

    if(isArray(slot)){

      const token = getToken(slot)

      // directives can also be inline either returning elements or attributes
      // if it returns an object append it to attributes and return null

      if(isDirective(token)){

        var result = applyDirective(slot,data,component)

        // a directive can return an array of virtual elements
        // this can be nested inside the content array with no problem

        if(isArray(result))
          return result
    
        // a directive can return attributes, which are always objects
        // the attribute object needs to merge with the attributes object

        if(isAttribute(result)){
          for(var attr in result) break;
          attributes[attr] = result[attr]
          return null
        }

      }

      // if the array is not a directive then its an element
      // render the element and return it to content

      return render(slot,data,component)

    }

    // objects inline an array are attributes
    // i.e { href: 'www.google.com' }

    else if(isAttribute(slot)){

      // key is href:
      // value is 'www.google.com'

      for(var key in slot) break;
      var value = slot[key]

      // attributes can be events which have a more complex format
      // events can reference methods inside the component

      // either: { onclick: '>clickHandler' }
      // a '>' token is used to signify a method call

      if(value[0] == '>'){
        var method = value.replace('>','')
        value = component[method].bind(this,component)
      }

      // or: { onclick: { clickHandler: 'param' } }
      // if a paramater is supplied the '>' token is not needed

      else if(isObject(value)){
        for(var method in value) break;
        var args = value[method]
        args = getDataFromVar(args,data)
        value = component[method].bind(this,component,args)
      }
      
      // merge the attribute into the attrributes object

      attributes[key] = value
    }

  })

  // string content is always the last slot in an array
  // if it exists just concat is to the end of the content array

  var lastSlot = getLastSlot(arr)

  if(isString(lastSlot))
    content.push(getDataFromVar(lastSlot,data))

  // all the pieces are together to return as a virtual element

  return virtualElement(tag, attributes, content)

}
import {directives} from './directives'
import {getDataFromVar} from './utils'
import {parseString} from './utils'
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

const isIdSelector = (str) => {
  if(str.match(/^\#/))
    return str
}

const isClassSelector = (str) => {
  if(str.match(/^\.|\s\./g))
    return str
}

const isSelector = (str) => {
  if(!isString(str)) return false
  return (isIdSelector(str)
    || isClassSelector(str))
}

const getToken = (arr) => {
  return arr[0]
}

const getObjectKey = (obj) => {
  for(var key in obj) break;
  return key
}

const getLastSlot = (arr) => {
  return arr[arr.length -1]
}

const applySelector = (str) => {
  var key, value;
  if(isIdSelector(str)){
    key = 'id'
    value = str.replace('#','')
  }
  else if(isClassSelector(str)){
    key = 'className'
    value = str.replace('.','')
  }
  return { key: key, value: value }
}

const applyAttribute = (attr,data,component) => {

  if(!isObject(attr)) return attr

  // key is href:
  // value is 'www.google.com'

  var key = getObjectKey(attr)
  var value = getDataFromVar(attr[key],data)

  // attributes can be events which have a more complex format
  // events can reference methods inside the component

  // either: { onclick: '>clickHandler' }
  // a '>' token is used to signify a method call

  if(value[0] == '>'){
    var methodName = value.replace('>','')
    var method = component[methodName]
    if(isArray(method))
      value = () => { component.emit(method[0],method[1]) }
    else
      value = method.bind(this,component)
  }

  // or: { onclick: { '>clickHandler': 'param' } }
  // if a paramater is supplied

  else if(isObject(value)){
    var method = getObjectKey(value)
    if(method[0] == '>'){
      var args = value[method]
      args = getDataFromVar(args,data)
      value = component[method.replace('>','')]
        .bind(this,component,args)
    }
  }

  return { key: key, value: value }

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

    // any strings before the last slot in the array are id or class selectors
    // parse and transform them into attributes

    if(isString(slot)){

      if(isSelector(slot)){
        var selector = applySelector(slot)
        attributes[selector.key] = selector.value
      }

    }

    else if(isArray(slot)){

      const token = getToken(slot)

      // directives can also be inline either returning elements or attributes
      // if it returns an object append it to attributes and return null

      if(isDirective(token)){

        var result = applyDirective(slot,data,component)

        // a directive can return an array of virtual elements
        // this can be nested inside the content array with no problem

        if(isArray(result))
          return result

        // a directive can result a selector, which are always strings
        // merge the id or className with attributes

        else if(isSelector(result)){
          var selector = applySelector(result)
          attributes[selector.key] = selector.value
          return null
        }
    
        // a directive can return attributes, which are always objects
        // the attribute object needs to merge with the attributes object

        else if(isAttribute(result)){
          // var attr = getObjectKey(result)
          // attributes[attr] = result[attr]
          var attr = applyAttribute(result,data,component)
          attributes[attr.key] = attr.value
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

      var attr = applyAttribute(slot,data,component)

      // merge the attribute into the attrributes object

      attributes[attr.key] = attr.value

    }

  })

  // string content is always the last slot in an array
  // if it exists just concat is to the end of the content array

  var lastSlot = getLastSlot(arr)

  if(isString(lastSlot))
    content.push(parseString(lastSlot,data))

  // all the pieces are together to return as a virtual element

  return virtualElement(tag, attributes, content)

}
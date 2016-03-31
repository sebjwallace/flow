
/*

[tag, attributes, directives, functions, filters, variables, ...schemas/arrays/content]
<tag id className onclick> content </tag>

---

[tag, attributes, directives, functions, filters, variables, ...schemas/arrays/content]
meta - filters and functions may return variables or directives

[tag, attributes, variables, directives, ...schemas/arrays/content]
alpha - directives will reduce to attributes,
        variables will reduce to attributes or content

[tag, attributes, ...schemas/arrays/content]
delta - inner schemas or arrays need to be rendered to content strings

[tag, attributes, content]
'<tag attributes> content </tag>'
element - array is converted to a string


schemas are arrays (templates) but with their own scope of:
data, models, methods, styles and routes

schemas render themselves into strings

*/


var schematic = {
  data: {
    title: 'heyyo'
  },
  template: ['div','.header', 'this is the main content']
  init: () => {}
}


class Component{
  constructor(schema,data){
    this.schema = schema
    this.injectedData = data
    this.diff(data)
    this.key = generateKey()
  }
  toString(){}
  diff(){
    // compare old and new data to determine rerender
  }
}

var component = new Component(schema)
components[component.key] = component



























const instanceSchema = (schema) => {
  // retrieve component if stored
  // else
    // generate key
    // attach methods
    // render the styles
    // store component
  // inject data
  // render template into array if its a function
  // render the template
  // return template
}

const isVariable = (item) => {}
const isFilter = (item) => {}
const isDirective = (item) => {}
const isFunction = (item) => {}

const isAttribute = (item) => {}
const isContent = (item) => {}
const isElementArray = (item) => {}
const isSchema = (item) => {}

const arrayToElement = (elementArray) => {

  const meta = elementArray.map((item) => {
    if(isVariable()){
      // return a variable
    }
    if(isFilter()){
      // return a string or function
    }
    else if(isDirective()){
      // return a string or function
    }
    else if(isFunction()){
      // return a string or function
    }
  })

  const alpha = elementArray.map((item) => {
    if(isFilter()){
      // return a string or function
    }
    else if(isDirective()){
      // return a string or function
    }
    else return item
  })

  const element = new Element(elementArray[0])
  for(var i = 1; i < alpha.length; i++){
    const item = alpha[i]
    if(isAttribute(item)){
      element.appendAttribute(item)
    }
    else if(isSchema(item)){
      const template = instanceSchema(item)
      element.appendChild(template)
    }
    else if(isElementArray(item)){
      element.appendChild(item)
    }
    else if(isContent(item)){
      element.setContent(item)
    }
    else if(fn){
      // run function that may control this function
    }
  }

  return element;
}

class Element{
  constructor(tag){
    this.tag = tag
    this.attributes = []
    this.children = []
    this.content = ''
  }
  setContent(content){
    this.content = content
  }
  appendAttribute(attr){
    this.attributes.push(attr)
  }
  appendChild(element){
    this.children.push(element)
  }
  renderChildren(){
    const childrenToString = this.children.map((child) => {
      childEl = arrayToElement(child);
      return childEl.toString();
    })
    return childrenToString.merge('')
  }
  toString(){
    let elToString = this.renderTag()
    elToString = this.renderAttributes()
    elToString = this.renderChildren()
    return elToString
  }
}

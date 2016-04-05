
Schema.components = (function(){

  var components = {}
  var lastComponent = null

  var componentExists = (schema) => {
    return components[schema[0].key]
  }

  var storeComponent = (component) => {
    components[component.key] = component
    lastComponent = component
  }

  var getComponent = (key) => {
    return components[key]
  }

  var getLastComponent = () => {
    return lastComponent
  }

  return {
    componentExists: componentExists,
    storeComponent: storeComponent,
    getComponent: getComponent,
    getLastComponent: getLastComponent
  }

})()


var modelModule = (function(){

let models = [];
let events = [];
let history = [];

var model = (name,model) => {
  model.name = name;
  model.listeners = [];

  for(let method in model){
    if(!events[method])
      events[method] = [];
    if(
      method != 'init'
      || method != 'save'
      || method != 'load'
    )
      events[method].push(model)
  }

  models[name] = model;
  model.data = model.init(model.data);
}

var attach = (modelName,component) => {
  models[modelName].listeners.push(component);
  return models[modelName].data;
}

var reach = (modelName) => {
  return models[modelName]
}

var emit = (method,data) => {

  for(var m in events[method]){
    var model = events[method][m]
    var modelMethod = model[method]
    var previousData = model.data
    var newData = data
    var returnData = modelMethod(previousData,newData,model)
    model.data = returnData

    var listeners = model.listeners
    for(var c in listeners){
      var component = listeners[c]
      var dataKey = component.models[model.name]
      var callbackData = {}
      callbackData[dataKey] = model.data
      component.setData(callbackData)
    }
  }
}

return {
  model: model,
  attach: attach,
  emit: emit
}

})()

Schema.model = modelModule.model
Schema.emit = modelModule.emit
Schema.model.attach = modelModule.attach

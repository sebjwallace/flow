
Schema.event = (key,handler,e) => {
  var PARAMREGEX = /\([a-zA-z0-9$_,]+\)/
  var component = Schema.components.getComponent(key)
  var methodName = handler.replace(PARAMREGEX,'')
  var params = handler.match(PARAMREGEX)
  var args = [component,e]
  if(params){
    params = params[0].replace(/\(|\)/g,'').split(',')
    args = args.concat(params)
  }
  component[methodName].apply(this,args)
}

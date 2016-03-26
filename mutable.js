
var ENV = {
  dev: true,
  dist: false
};

var stack = [];

var activeFunction = undefined;

export var Mutable = {
  log: function(obj){
    if(obj){
      stack.map(function(log){
        if(log.mutatee == obj()){
          console.log(log);
        }
      })
    }
    else{
      stack.map(function(log){
        console.log(log)
      })
    }
  },
  trace: function(obj,name){
    stack.map(function(log){
      if(log.mutatee == obj()){
        console.log(
          '::: ' + log.mutator.name + '() => ' + name + '.' + log.property + ' :::'
          + '\n- ' + name + '.' + log.property + ' == ' + log.old
          + '\n+ ' + name + '.' + log.property + ' == ' + log.new
          + '\n> ' + log.source.substring(log.source.indexOf(log.mutator.name))
        );
        // console.log(log);
        console.log('::::::::::::::::');
      }
    })
  }
};

Mutable.ENV = function(mode){
  if(mode == 'dev')
  {ENV.dev = true; ENV.dist = false;}
  if(mode == 'dist')
  {ENV.dev = false; ENV.dist = true;}
}

Mutable.Function = function(title,fn){
  return function(a,b,c,d,e){
    activeFunction = {name: title, fn: fn};
    var er = new Error();
    er = er.stack.toString().replace('Error','Source');
    stack.push({
      type: 'function',
      title: title,
      source: title,
      arguments: [a,b,c,d,e],
      source: er
    });
    // console.log('::: ' + title + ' :::');
    // console.log('Arguments: ');
    // console.log(arguments);
    // console.log(er);
    fn(a,b,c,d,e);
  }
}

Mutable.Object = function(title,obj){
  var $ = obj;
  var lock = false;
  if(callback)
    var callback = callback;
  var mutableObject = function(prop,assign){
    if(prop && assign){

      if(ENV.dev){
        var er = new Error();
        er = er.stack.toString().replace('Error','Source');
        if(lock){
          stack.push({
            type: 'object:locked',
            name: title,
            property: prop,
            value: assign,
            source: er
          });
          return false;
        }
        stack.push({
          type: 'object',
          name: title,
          mutatee: $,
          mutator: activeFunction,
          property: prop,
          old: $[prop],
          new: assign,
          source: er
        });
      }

      $[prop] = assign;
      if(callback) callback();

    }
    else if(prop) return $[prop];
    else return $;
  }
  mutableObject.lock = function(){
    lock = true;
  }
  mutableObject.unlock = function(){
    lock = false;
  }
  mutableObject.observe = function(fn){
    callback = fn;
  }
  mutableObject.forEach = function(callback){
    for(var item in $){
      callback($[item],item,$);
    }
  }
  mutableObject.forInside = function(callback){
  }
  mutableObject.clone = function(){
    return JSON.parse(JSON.stringify($));
  }
  return mutableObject;
}


module.exports = function aTree(t){
  var tag = t[0], attributes, children;
  
  if(typeof t[1] == 'object' && !Array.isArray(t[1]))
      attributes = t[1];

  children = t.map(function(e,i){
    if(Array.isArray(e))
      return template(e);
    else if(typeof e == 'string' && i > 0)
      return e;
  });
    
  return h(tag,attributes,children);
}



export const parseString = (str,data) => {
  var vars = str.match(/\$[^(\s|\^)]+/)
  if(!vars) return str
  var values = vars.map( v => getDataFromVar(v,data) )
  for(var v in vars)
    str = str.replace(vars[v],values[v])
  return str
}

export const getDataFromVar = (v,data) => {
  if(typeof v != 'string')
    return v
  if(v[0] != '$')
    return v

  v = v.replace('$','')
  if(v.match(/\./))
    return deepValue(v,data)
  return data[v]
}

function deepValue(path, obj){
    for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
      if(!obj){
        console.error(path.join('.') + ': "' + path[i] + '" does not exist in data')
        return undefined
      }
      obj = obj[path[i]];
    };
    return obj;
}

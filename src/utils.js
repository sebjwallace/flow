
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
        obj = obj[path[i]];
    };
    return obj;
};

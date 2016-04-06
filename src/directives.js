import {render} from './render'
import {getDataFromVar} from './utils'

export const directives = {
  '%': function(c,data,component){
    var list = data[ c[1].replace('$','') ]
    var rendered = []
    for(var i in list){
      data[ c[2].replace('$','') ] = list[i]
      data['i'] = i
      rendered.push(render(c[3],data,component))
    }
    return rendered
  },
  '==': function(c,data,component){
    var conditionA = getDataFromVar(c[1],data)
    var conditionB = getDataFromVar(c[2],data)
    if(conditionA == conditionB){
      if(Array.isArray(c[3]))
        return render(c[3],data,component)
      return c[3]
    }
    return ''
  },
  '!=': function(c,data,component){
    var conditionA = getDataFromVar(c[1],data)
    var conditionB = getDataFromVar(c[2],data)
    if(conditionA != conditionB)
      return render(c[3],data,component)
    return ''
  }
}
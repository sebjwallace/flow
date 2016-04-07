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
    else return c[4]
    return ''
  },
  '!=': function(c,data,component){
    var conditionA = getDataFromVar(c[1],data)
    var conditionB = getDataFromVar(c[2],data)
    if(conditionA != conditionB)
      return render(c[3],data,component)
    return ''
  },
  '/#==': function(c,data,component){
    var hash = window.location.hash
    hash = hash.replace('#','')
    if(c[1] == hash)
      return c[2]
    else return ''
  },
  '/#|': function(c,data,component){
    var hash = window.location.hash
    if(!hash.match(c[1])) return ''
    var conditionA = getDataFromVar(c[2],data)
    var conditionB = getDataFromVar(c[3],data)
    if (conditionA != conditionB)
      return {style: {display: 'none'} }
  },
  'COUNT': function(c,data,component){
    var subject = getDataFromVar(c[1],data)
    if(!Array.isArray(subject)) return ''
    if(c[1].length == 0) return ''
    var count = 0
    subject.map(function(item){
      if(c[2](item) == true) count++
    })
    return count
  }
}
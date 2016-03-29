
import {
  getDataFromVar
} from './utils';

const filters = {
  '==': (filterArray,component) => {

    const f = filterArray.map((filter) => {
        return getDataFromVar(component,filter)
    })

    if(f[1] == f[2])
      return f[3]
    else if(f.length > 4)
      return f[4]
  }
}

export const driveFilters = (component,filterArray) => {
  const token = filterArray[0];
  if(filters[token])
    return filters[token](filterArray,component)
  else return filterArray
}

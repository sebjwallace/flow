
import {
  getDataFromVar
} from './utils';

import {
  matchRoute,
  currentHash
} from './route';

const filters = {
  '==': (filterArray,component) => {

    const f = filterArray.map((filter) => {
        return getDataFromVar(component,filter)
    })

    if(f[1] == f[2])
      return f[3]
    else if(f.length > 4)
      return f[4]
  },
  '/|': (filterArray,component) => {
    const exp = filterArray[1];
    const match = matchRoute(exp);
    if(!match) return false;
    const pa = getDataFromVar(component,filterArray[2]);
    const pb = getDataFromVar(component,filterArray[3]);
    if(pa != pb)
      return true
  },
  '#/?': (filterArray) => {
    const expected = filterArray[1];
    const r = filterArray[2];
    const uri = currentHash().replace(/\#|\//g,'');
    if(expected == uri) return r;
  }
}

export const driveFilters = (component,filterArray,dom) => {
  const token = filterArray[0];
  if(filters[token])
    return filters[token](filterArray,component,dom)
  else return filterArray
}

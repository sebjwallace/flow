
import {
  CHECK
} from './exr';

import {
  applySelector
} from './utils';

export const newDomElement = (parent,type) => {
  var tag = type || 'span';
  if(CHECK(tag,'ID') || CHECK(tag,'CLAS')){
    var child = document.createElement('div');
    applySelector(child,tag);
  }
  else
    var child = document.createElement(tag);
  child.parent = parent;
  parent.appendChild(child);
  return child;
}

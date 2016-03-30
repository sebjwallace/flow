
import{
  render
} from './renderer';

const routes = {};
let route = '';

export const addRoute = (exp,component) => {
  routes[exp] = component;
}

export const startRoute = () => {
  route = window.location.hash;

  window.onhashchange = () => {
    route = window.location.hash;

    for(let exp in routes){
      if(matchRoute(exp)){
        var component = routes[exp];
        render(component,component.root)
      }
    }
  }

}

export const matchRoute = (exp) => {
  var reex = new RegExp(exp);
  if(route.match(reex))
    return true
}

export const currentHash = () => {
  if(route == '' || route == '#')
    return '#'
  else return route;
}

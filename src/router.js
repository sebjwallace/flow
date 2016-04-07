
import * as dom from './dom'
import {compile} from './compile'

const routes = {}
let running = false

const start = () => {

	if(running) return

	window.addEventListener('hashchange', () => {

		var hash = window.location.hash.replace('#','')

		for(var route in routes){
			if(hash.match(route)){
				var matched = routes[route]
				for(var component in matched){
					var toRender = matched[component]
					dom.update( compile(toRender) )
				}
			}
		}

		console.log(hash)

	})

	running = true

}

export const route = (route, component) => {
	if(!routes[route]) routes[route] = []
	routes[route].push(component)
	start()
}
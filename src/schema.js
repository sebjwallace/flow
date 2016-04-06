
import * as dom from './dom'
import {compile} from './compile'
import {setController} from './controller'

export const Schema = {}

var domLoaded = false

Schema.render = (schema,root) => {

	var tree = compile(schema)

	if(!domLoaded){
		dom.load(tree,root)
		domLoaded = true
	}
	else
		dom.update(tree)

}

Schema.Controller = (controller) => {

	setController(controller)

}
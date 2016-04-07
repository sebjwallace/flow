
import * as dom from './dom'
import {compile} from './compile'
import {setController} from './controller'
import {model} from './model'

var domLoaded = false

export const render = (schema,root) => {

	var tree = compile(schema)

	if(!domLoaded){
		dom.load(tree,root)
		domLoaded = true
	}
	else
		dom.update(tree)

}

export const Controller = (controller) => {

	setController(controller)

}

export const Model = (schemaModel) => {
	return model(schemaModel)
}

export const Schema = {}

Schema.render = render
Schema.Controller = Controller
Schema.Model = Model
import * as dom from './dom'
import {render} from './render'
import {useController} from './controller'

/*

A schema is composed of { data, template, styles, methods }
The compile function simply mounts some 'self' methods onto the schema.
i.e 'self.setData()' can be used inside the schema.

This mutation of the schema/component object is additive.
It will only be applied once to each schema object.

*/

export const compile = (schema) => {

	var component = schema

	if(!component.compiled){

		component.setData = (data) => {
			for(var i in data){
			  component.data[i] = data[i]
			}
			dom.update(component)
		}

	  	component.emit = (label,data) => {
	  		if(!data) data = []
	  		useController(label,data)
	  	}

	  	component.compiled = true

	}

  	return render(
  		component.template,
  		component.data,
  		component
  	)

}

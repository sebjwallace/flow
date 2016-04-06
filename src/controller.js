
var Controller = null

export const setController = (controller) => {
	
	if(!Controller)
		Controller = controller
	else
		for(var method in controller)
			Controller[method] = controller[method]

	if(controller.INIT)
		controller.INIT()
}

export const useController = (label,data) => {
	if(!Controller[label])
		console.error(label + ': does not exist in controller')
	else Controller[label].apply(Controller,data)
}
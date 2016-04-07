
export const model = (model) => {
	var data = model.init()

	const cloneFn = (method,clone) => {
		return function(a,b,c,d){
			data = model[method].apply(model,[data,a,b,c,d])
			for(var o in clone.__observables)
				clone.__observables[o](data)
			return data
		}
	}

	var clone = {}
	for(var method in model)
		clone[method] = cloneFn(method,clone)

	clone.get = () => { return data }

	clone.__observables = []

	clone.subscribe = (fn) => {
		clone.__observables.push(fn)
	}

	return clone
}
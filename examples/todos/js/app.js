
var localStorageTodos = JSON.parse(localStorage.getItem('todosSchema')) || []

Schema.render(
	TodosComponent( localStorageTodos ),
	document.getElementById('root')
)

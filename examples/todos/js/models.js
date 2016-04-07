
var localStorageTodos = JSON.parse(localStorage.getItem('todosSchema')) || []

var TodosModel = Schema.Model({
  init: function(todos){
    return localStorageTodos
  },
  ADD_TODO: function(todos,newTodo){
    return todos.concat(newTodo)
  },
  REMOVE_TODO: function(todos,id){
    if(id == "true") return todos.filter(function(todo){
      return !todo.completed
    })
    todos.splice(id,1)
    return todos;
  },
  REASSIGN_TODO: function(todos,id,text){
    todos[id].title = text
    return todos
  },
  TOGGLE_TODO: function(todos,id){
    todos[id].completed = !todos[id].completed
    return todos;
  },
  TOGGLE_ALL: function(todos,toggle){
    return todos.map(function(todo){
      todo.completed = !toggle;
      return todo;
    })
  }
})

TodosModel.subscribe(function(todos){
  Schema.render( TodosComponent(todos) )
  localStorage.setItem('todosSchema', JSON.stringify(todos))
})


Schema.Controller(TodosModel)
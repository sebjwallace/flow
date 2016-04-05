
Schema.model('TodosModel',{
  init: function(todos){
    return []
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
  TOGGLE_TODO: function(todos,id){
    if(id == 'true' || id == 'false'){
      return todos.map(function(todo){
        todo.completed = (id == 'true');
        return todo;
      })
    }
    todos[id].completed = !todos[id].completed
    return todos;
  },
  load: {
    url: '...'
  },
  save: {
    url: '...'
  }
});


Schema.model('TodosModel',{
  init: function(todos){
    return []
  },
  ADD_TODO: function(todos,params){
    return todos.concat(params.todo)
  },
  REMOVE_TODO: function(todos,params){
    if(params.id == "true") return todos.filter(function(todo){
      return !todo.completed
    })
    todos.splice(params.id,1)
    return todos;
  },
  TOGGLE_TODO: function(todos,params){
    if(params.id == 'true' || params.id == 'false'){
      return todos.map(function(todo){
        todo.completed = (params.id == 'true');
        return todo;
      })
    }
    todos[params.id].completed = !todos[params.id].completed
    return todos;
  },
  load: {
    url: '...'
  },
  save: {
    url: '...'
  }
});


const TodosComponent = function(todos){
  return {
    route: '.*',
    data: {
      todos: todos,
      editing: null,
      toggleAll: false
    },
    template: ['#todoapp',
      ['header', '#header',
        ['h1', 'todos'],
        ['input', '#new-todo',
          {onkeydown: '>addTodo'},
          {placeholder: 'what needs to be done?'},
          {autofocus: true}
        ]
      ],
      ['section', '#main',
          ['==', '$todos.length', 0, {style: {display:'none'}}],
        ['input', '#toggle-all', {type: 'checkbox'}, {onclick: '>toggleAll'}],
        ['ul', '#todo-list',
          ['%', '$todos', '$todo',
            ['li',
              ['/#|', '\active$', '$todo.completed', false],
              ['/#|', '\completed$', '$todo.completed', true],
              ['==', '$todo.completed', true, '.completed'],
              ['==', '$editing', '$todo', '.editing'],
              ['.view',
                ['input', '.toggle', {type: 'checkbox'}, {onclick: {'>toggleTodo':'$i'} },
                  ['==', '$todo.completed', true, {checked: true}]
                ],
                ['label', {ondblclick: {'>editTodo':'$i'} }, '$todo.title'],
                ['button', '.destroy', {onclick: {'>removeTodo':'$i'} }],
              ],
              ['input', '.edit', {value: '$todo.title'},
                {onblur: {'>noEditing':'$i'} }, {onkeydown: {'>reassignTodo':'$i'} } ]
            ]
          ]
        ],
        ['footer', '#footer',
          ['span', '#todo-count', '$todos.length items left'],
          ['ul', '#filters',
            ['li', ['a', {href: '#'}, ['/#==', '', '.selected'], 'all'] ],
            ['li', ['a', {href: '#active'}, ['/#==', 'active', '.selected'], 'active'] ],
            ['li', ['a', {href: '#completed'}, ['/#==', 'completed', '.selected'], 'completed'] ]
          ],
          ['button', '#clear-completed', {onclick: {'>removeTodo': true} },
            ['span', 'Clear completed ('],
            ['span', ['COUNT', '$todos', function(todo){ return todo.completed } ] ],
            ['span', ')']
          ]
        ]
      ]
    ],
    addTodo: function(self,e){
      if(e.which != 13) return
      self.emit('ADD_TODO',
        [{ title: e.target.value, completed: false }] )
      e.target.value = ""
    },
    removeTodo: function(self,id){
      self.emit('REMOVE_TODO',[id])
    },
    reassignTodo: function(self,id,e){
      if(e.which != 13) return
      self.emit('REASSIGN_TODO',[id,e.target.value])
    },
    toggleTodo: function(self,id){
      self.emit('TOGGLE_TODO',[id])
    },
    toggleAll: function(self,id){
      self.emit('TOGGLE_ALL',[self.data.toggleAll])
      self.setData({ toggleAll: !self.data.toggleAll })
    },
    editTodo: function(self,id){
      self.setData({ editing: self.data.todos[id] })
    },
    noEditing: function(self){
      self.setData({ editing: null })
    }
  }
}
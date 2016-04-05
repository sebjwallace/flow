
const TodosComponent = {
  route: '.*',
  data: {
    todos: '@TodosModel',
    editing: null,
    toggleAll: false,
    completed: 1,
    // ' + ($.data.todos.length - $.incompleteCount($)) + '
    remaining: 0
    // function(){
    //   var completed = $.incompleteCount($);
    //   if(completed == 1)
    //     return '1 item left'
    //   else return completed + ' items left'
  },
  template: function($){ return ['#todoapp',
    ['header', '#header',
      ['h1', 'todos'],
      ['input', '#new-todo',
        '!13: addTodo',
        'autofocus: true',
        'placeholder: What needs to be done?',
        ''
      ]
    ],
    ['section', '#main',
        ['==', '$todos.length', 0, 'style: display:none'],
      ['input', '#toggle-all', 'type: checkbox',
        ['==', '$toggleAll', true,
          '!onclick: toggleTodo(false)', '!onclick: toggleTodo(true)'],
      ''],
      ['ul', '#todo-list',
        ['%', '$todo', '$todos',
          ['li',
            ['/|', '\active$', '$todo.completed', false],
            ['/|', '\completed$', '$todo.completed', true],
            ['==', '$todo.completed', true, '.completed'],
            ['==', '$editing', '$todo', '.editing'],
            ['.view',
              ['input', '.toggle', 'type: checkbox', '!onclick: toggleTodo($i)',
                ['==', '$todo.completed', true, 'checked: true']
              ],
              ['label', '!ondblclick: editTodo($i)', '$todo.title'],
              ['button', '.destroy', '!onclick: removeTodo($i)'],
            ],
            ['input', 'value: $todo.title', '.edit', '!onblur: noEditing($i)',
              ['==', '$editing', '$todo', 'autofocus: true']
            ]
          ]
        ]
      ],
      ['footer', '#footer',
          ['==', '$todos.length', 0, 'style: display:none'],
        ['span', '#todo-count', '$remaining'],
        ['ul', '#filters',
          ['li', ['a', 'href: #', ['/==', '', '.selected'], 'all'] ],
          ['li', ['a', 'href: #active', ['/==', 'active', '.selected'], 'active'] ],
          ['li', ['a', 'href: #completed', ['/==', 'completed', '.selected'], 'completed'] ]
        ],
        ['button', '#clear-completed', '!onclick: removeTodo(true)',
          'Clear completed ($completed)'
        ]
      ]
    ]
  ]},
  addTodo: function(self,e){
    self.emit('ADD_TODO',{
        title: e.target.value,
        completed: false
    });
  },
  removeTodo: function(self,e,id){
    self.emit('REMOVE_TODO',id)
  },
  toggleTodo: function(self,e,id){
    self.emit('TOGGLE_TODO',id)
    self.setData({
      toggleAll: !self.data.toggleAll
    })
  },
  editTodo: function(self,e,id){
    self.setData({
      editing: self.data.todos[id]
    });
  },
  noEditing: function(self){
    self.setData({
      editing: null
    })
  },
  incompleteCount: function($){
    return $.data.todos.reduce(function(total,todo){
      if(!todo.completed) return total + 1
      else return total
    },0)
  }
}

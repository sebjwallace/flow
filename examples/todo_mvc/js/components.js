
const TodosComponent = {
  route: '.*',
  data: {
    todos: '@TodosModel',
    editing: null,
    toggleAll: false
  },
  template: function($){ return ['#todoapp',
    ['header', '#header',
      ['h1', 'todos'],
      ['input', '#new-todo',
        '!13: addTodo',
        //'focus()',
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
      ['ul', '#todo-list', '% $todo in $todos',
        ['li',
          ['/|', '\active$', '$todo.completed', false],
          ['/|', '\completed$', '$todo.completed', true],
          ['==', '$todo.completed', true, '.completed'],
          ['==', '$editing', '$todo', '.editing'],
          ['.view',
            ['input', '.toggle', 'type: checkbox', '!onclick: toggleTodo($$)',
              ['==', '$todo.completed', true, 'checked: true']
            ],
            ['label', '$todo.title', '!ondblclick: editTodo($$)', ''],
            ['button', '.destroy', '!onclick: removeTodo($$)', ''],
          ],
          ['input', 'value: $todo.title', '.edit',
            ['==', '$editing', '$todo', 'focus()'], '!onblur: noEditing', ''
          ]
        ]
      ],
      ['footer', '#footer',
          ['==', '$todos.length', 0, 'style: display:none'],
        ['span', '#todo-count', function(){
          var completed = $.incompleteCount($);
          if(completed == 1)
            return '1 item left'
          else return completed + ' items left'
        }],
        ['ul', '#filters',
          ['a', 'href: #', '[li]', ['#/?', '', '.selected'], 'all'],
          ['a', 'href: #active', '[li]', ['#/?', 'active', '.selected'], 'active'],
          ['a', 'href: #completed', '[li]', ['#/?', 'completed', '.selected'], 'completed']
        ],
        ['button', '#clear-completed', '!onclick: removeTodo(true)',
          'Clear completed (' + ($.data.todos.length - $.incompleteCount($)) + ')'
        ]
      ]
    ]
  ]},
  addTodo: function(self,e){
    self.emit({
      type: 'ADD_TODO',
      todo: {
        title: e.target.value,
        completed: false
      }
    });
  },
  removeTodo: function(self,e,id){
    self.emit({
      type: 'REMOVE_TODO',
      id: id
    })
  },
  toggleTodo: function(self,e,id){
    self.emit({
      type: 'TOGGLE_TODO',
      id: id
    })
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

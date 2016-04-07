
import {Schema} from './src/Schema'



const CountersComponent = (counters) => {
  return {
    data: {
      counters: counters
    },
    template: ['#counters',
      ['%', '$counters', '$counter',
        [CounterComponent, ['$counter', '$i'] ]
      ],
      ['button', {onclick: '>addCounter'}, 'Add counter'],
      ['button', {onclick: '>removeCounter'}, 'Remove counter']
    ],
    addCounter: ['ADD_COUNTER'],
    removeCounter: ['REMOVE_COUNTER']
  }
}


const CounterComponent = (count,id) => {
  return {
    data: {
      count: count,
      id: id
    },
    template: ['#counter',
      ['h1', '$count'],
      ['button', {onclick: '>increment'}, '+'],
      ['button', {onclick: '>decrement'},
        ['==', '$count', 0, {disabled: true} ], '-'],
      ['input', {value: '$count'}, {onkeyup: '>set'}]
    ],
    increment: ['INCREMENT', ['$id'] ],
    decrement: ['DECREMENT', ['$id'] ],
    set: (self,e) => {
      self.emit('SET',
        [self.data.id, e.target.value]
      )
    }
  }
}


const Counters = Schema.Model({
  init: () => {
    return [ 0 ]
  },
  increment: (counters,id) => {
    counters[id]++
    return counters
  },
  decrement: (counters,id) => {
    counters[id]--
    return counters
  },
  set: (counters,id,count) => {
    counters[id] = count
    return counters
  },
  addCounter: (counters) => {
    return counters.concat([0])
  },
  removeCounter: (counters) => {
    counters.pop()
    return counters
  }
})


Counters.subscribe((data) => {
  Schema.render( CountersComponent(data) )
})



Schema.Controller({
  INIT: () => {
    Schema.render(
      CountersComponent( Counters.get() ),
      document.getElementById('root')
    )
  },
  INCREMENT: (id) => {
      Counters.increment(id)
  },
  DECREMENT: (id) => {
      Counters.decrement(id)
  },
  SET: (id,count) => {
      Counters.set(id,count)
  },
  ADD_COUNTER: () => {
      Counters.addCounter()
  },
  REMOVE_COUNTER: () => {
      Counters.removeCounter()
  }
})


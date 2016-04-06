
import {Schema} from './src/Schema'



const CountersComponent = (counters) => {
  return {
    data: {
      counters: counters
    },
    template: ['div',
      ['%', '$counters', '$counter',
        [CounterComponent, ['$counter', '$i'] ]
      ],
      ['button', {onclick: '>addCounter'}, 'Add counter']
    ],
    addCounter: (self) => {
      self.emit('ADD_COUNTER')
    }
  }
}

const CounterComponent = (count,id) => {
  return {
    data: {
      count: count,
      id: id
    },
    template: ['div',
      ['h1', '$count'],
      ['button', {onclick: '>increment'}, '+'],
      ['button', {onclick: '>decrement'},
        ['==', '$count', 0, {disabled: true} ], '-']
    ],
    increment: (self) => {
      self.emit(
        'INCREMENT',
        [self.data.id]
      )
    },
    decrement: (self) => {
      self.emit(
        'DECREMENT',
        [self.data.id]
      )
    }
  }
}


var CountersModel = (() => {
  var counters = [ 0, 0 ]
  var _counters = () => counters.concat()
  return{
    getCounters: () => {
      return _counters()
    },
    increment: (id) => {
      counters[id]++
      return _counters()
    },
    decrement: (id) => {
      counters[id]--
      return _counters()
    },
    addCounter: () => {
      counters.push(0)
      return _counters()
    }
  }
})()


const renderCounters = (counters) => {
  Schema.render(CountersComponent(counters))
}

Schema.Controller({
  INIT: () => {
    Schema.render(
      CountersComponent(CountersModel.getCounters()),
      document.getElementById('root')
    )
  },
  INCREMENT: (id) => {
    renderCounters(
      CountersModel.increment(id)
    )
  },
  DECREMENT: (id) => {
    renderCounters(
      CountersModel.decrement(id)
    )
  },
  ADD_COUNTER: () => {
    renderCounters(
      CountersModel.addCounter()
    )
  }
})


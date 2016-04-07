
import {Schema} from './src/Schema'


const CounterComponent = (count) => {
  return {
    data: {
      count: count
    },
    template: ['#counter',
      ['h1', '$count'],
      ['button', {onclick: '>increment'}, '+'],
      ['button', {onclick: '>decrement'},
        ['==', '$count', 0, {disabled: true} ], '-']
    ],
    increment: (self) => {
      self.setData({ count: self.data.count +1 })
    },
    decrement: (self) => {
      self.setData({ count: self.data.count -1 })
    }
  }
}


Schema.render(
  CounterComponent(0),
  document.getElementById('root')
)


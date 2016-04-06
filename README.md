# Schema

Schema is a modern framework for building web applications in a functional style. The framework structure is similar to MVC, yet encourages unidirectional data flow, purity and immutibility:

- Component

  Components act as the view of the application. They encapsulate HTML, CSS with private data and methods.

- Model

  A model is an encapsulated set of data with data-specific functions that privatly mutate the data. Only the model can mutate the data -   from the outside it is immutable. It is the single source of truth for the data in the application.
  
- Controller

  The controller stitches the components and models together through actions from components, and reactions from models.
  Neither components or models know about each other, neither do they know about the controller, but the controller knows about both.
  The controller reacts to actions that components emit by interfacing with models, then rerenders the components with the new data        returned by the models.
  
Schema is designed to be declarative, allowing the developer to describe and express their intent in a clear structure. Every line of code written is meant to progress development forward, minimizing boilerplate and framework-specific details.

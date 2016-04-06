
var diff = require('virtual-dom/diff')
var patch = require('virtual-dom/patch')
var createElement = require('virtual-dom/create-element')

let tree = null
var rootNode = null

export const load = (initTree,root) => {
	tree = initTree
	rootNode = createElement(tree)
	root.appendChild(rootNode)
}

export const update = (newTree) => {
  var patches = diff(tree, newTree)
  rootNode = patch(rootNode, patches)
  tree = newTree
}

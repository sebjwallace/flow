
var vdom = require('virtual-dom')
var h = vdom.h;

function DOM(){
    
  var tree = vdom.h('#root','');
  var rootNode = vdom.create(tree);
  document.body.appendChild(rootNode);

  function update(newTree){
    var patches = vdom.diff(tree, newTree);
    rootNode = vdom.patch(rootNode, patches);
    tree = newTree;
  }
  
  return{
      
    render: function(tree){
      update(tree);
    }
     
  };
    
}

var vDOM = new DOM()


export function $(tag,attributes,children){

    tag = tag || 'DIV'
    attributes = attributes || {}
    children = children || []
    var domElement = null
    var onload = function(){}
    var data = {}

    function addStyle(attr,value){
    	if(!attributes.style)
    		attributes.style = {}
    	attributes.style[attr] = value
    }

    function parseRGBA(rgba){
      rgba = parseArgs(rgba)
      if(rgba.length == 3)
        return 'rgb(' + rgba.join(',') + ')'
      else if(rgba.length == 4)
        return 'rgba(' + rgba.join(',') + ')'
    }

    function parseColor(color){
    	if(typeof color ==  'object')
      		color = color.rgbString()
      	return color
      return color
    }

    function parseArgs(args){
    	return Array.prototype.slice.call(args)
    }

    function parseUnits(args){
    	var args = parseArgs(args)
      	var unit = 'px'
      	if(typeof args[args.length-1] == 'string')
      		unit = args.splice(args.length-1)
      	return args.map(arg => arg += unit + ' ')
    }

    function createHook(callback){
    	var Hook = function(){}
    	Hook.prototype.hook = function(node){
    		callback(node)
    	}
    	return new Hook()
    }

    function onReturn(){
    	return chain
    }
    
    var chain = {
      attr: function(attr,val){
        attributes[attr] = val
        return onReturn()
      },
      id: function(id){
        attributes['id'] = id
        return onReturn()
      },
      class: function(className){
        attributes['className'] = className
        return onReturn()
      },
      children: function(){
      	var args = parseArgs(arguments)
      	args = args.map(arg => arg.vNode())
        children.push(args)
        return onReturn()
      },
      text: function(text){
      	children.push(text)
      	return onReturn()
      },
      event: function(event,fn){
      	if(typeof fn == 'string'){
      		attributes[event] = function(){
      			$action.push(fn).call()
      		}
      		return onReturn()
      	}
      	if(typeof fn == 'object')
	  		if(fn.type == 'vNodeChain'){
	  			attributes[event] = function(){
		      		var styles = fn.vNode().properties.style
		      		for(var style in styles)
		      			domElement.style[style] = styles[style]
		      	}
		      	return onReturn()
	  		}
      	attributes[event] = fn
      	return onReturn()
      },
      action: function(handler,vNode){
      	$action.pull(handler,function(){
      		var styles = vNode.vNode().properties.style
      		for(var style in styles)
      			domElement.style[style] = styles[style]
      	})
      	return onReturn()
      },
      onload: function(fn){
      	onload = fn
      	return onReturn()
      },
      color: function(color){
        if(arguments.length > 2)
          color = parseRGBA(arguments)
      	color = parseColor(color)
      	addStyle('color', color)
      	return onReturn()
      },
      background: function(color){
        if(arguments.length > 2)
          color = parseRGBA(arguments)
      	color = parseColor(color)
      	addStyle('background-color', color)
      	return onReturn()
      },
      opacity(value){
      	addStyle('opacity',value)
      	return onReturn()
      },
      size: function(){
      	var sizes = parseUnits(arguments)
      	addStyle('height',sizes[0])
      	if(sizes.length > 1)
	      	addStyle('width',sizes[1])
      	return onReturn()
      },
      padding: function(){
      	var padding = parseUnits(arguments).join('')
      	addStyle('padding',padding)
      	return onReturn()
      },
      margin: function(){
        var margin = parseUnits(arguments).join('')
        addStyle('margin',margin)
        return onReturn()
      },
      border: function(size,style,color){
      	addStyle('border', size + 'px ' + style + ' ' + color)
      	return onReturn()
      },
      transition: function(styles,duration){
      	if(!duration){
      		duration = styles
      		styles = 'all'
      	}
      	addStyle('transition', styles + ' ' + duration + 's')
      	return onReturn()
      },
      style: function(attr,value){
      	addStyle(attr,value)
      	return onReturn()
      },
      extend: function(abstract){
      	var vNode = abstract.vNode()
      	for(var prop in vNode.properties){
      		if(prop != 'style')
	      		attributes[prop] = vNode.properties[prop]
      	}
  		var styles = vNode.properties.style
      	if(styles){
      		if(!attributes.style)
      			attributes.style = {}
	      	for(var style in styles)
      			attributes['style'][style] = styles[style]
      	}
      	var abstractChildren = abstract.getChildren()
      	for(var child in abstractChildren)
      		children.push(abstractChildren[child])
      	return onReturn()
      },
      click: function(){
        domElement.click()
        return onReturn()
      },
      vNode: function(){
        var vNode = h(tag,attributes,children)
    	var onloadHook = createHook(function(node){
      		domElement = node
      		onload(node)
      	})
      	vNode.properties['onloadHook'] = onloadHook
      	return vNode
      },
      domNode: function(){
        return domElement
      },
      getChildren: function(){
      	return children
      },
      getAttributes: function(){
      	return attributes
      },
      render: function(){
      	var vNode = chain.vNode()
      	vDOM.render(vNode)
      	return onReturn()
      },
      type: 'vNodeChain'
    }
    
    return chain
    
}


var _actions = []

export var $action = {

	push:function(handler){
		return function(){
			for(var action in _actions[handler])
				_actions[handler][action]()
		}
	},
	pull:function(handler,fn){
		if(!_actions[handler])
			_actions[handler] = []
		_actions[handler].push(fn)
	}
	
}

export function Abstract(){
	return $('template')
}



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

    // function schema(){
    //   return{
    //     tag: tag || 'DIV',
    //     attributes: attributes || {},
    //     children: children || [],
    //     domElement: null,
    //     onload: function(){},
    //   }
    // }

    tag = tag || 'DIV'
    attributes = attributes || {}
    children = children || []
    var domElement = null
    var onload = function(){}

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
      event: function(event,fn,params){
      	if(typeof fn == 'string'){
      		attributes[event] = function(){
      			$action.push(fn,params).call()
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
          if(typeof vNode == 'function'){
            vNode = vNode.apply(this,arguments)
          }
      		var styles = vNode.vNode().properties.style
      		for(var style in styles)
      			domElement.style[style] = styles[style]
      	})
      	return onReturn()
      },
      onclick: function(fn,params){
        chain.event('onclick',fn,params)
        return onReturn()
      },
      onload: function(fn){
      	onload = fn
      	return onReturn()
      },
      display: function(display){
        addStyle('display',display)
        return onReturn()
      },
      hide: function(){
        addStyle('display','none')
        return onReturn()
      },
      show: function(){
        addStyle('display','block')
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
      height: function(height,unit){
        if(unit)
          height = height + unit
        else if(!isNaN(height))
          height = height + 'px'
        addStyle('height',height)
        return onReturn()
      },
      width: function(width,unit){
        if(unit)
          width = width + unit
        else if(!isNaN(width))
          width = width + 'px'
        addStyle('width',width)
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
      filterMap: function(data,filter,map){
        data = data.filter(filter)
        chain.map(data,map)
        return onReturn()
      },
      map: function(data,fn){
        var appending = data.map(function(item,i){
          return fn(item,i).vNode()
        })
        children.push(appending)
        return onReturn()
      },
      mapToText: function(data,fn){
        var text = data.map(function(item,i){
          return fn(item,i)
        }).join('')
        children.push(text)
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
      removeStyles: function(){
        if(domElement)
          domElement.removeAttribute('style')
        attributes.style = {}
        return onReturn()
      },
      click: function(){
        domElement.click()
        return onReturn()
      },
      remove: function(){
        domElement.parent.removeChild(domElement)
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


var actions = []

export var $action = {

	push:function(handler,params){
    if(!Array.isArray(params))
      params = [params]
		return function(){
			actions[handler].forEach(function(action){
        action.apply(this,params)
      })
		}
	},
	pull:function(handler,fn){
		if(!actions[handler])
			actions[handler] = []
		actions[handler].push(fn)
	},
  getActions: function(handler){
    return actions[handler]
  },
  removeAllActions: function(handler){
    actions = []
  }
	
}

export function Abstract(){
	return $('template')
}


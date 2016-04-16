
var vdom = require('virtual-dom')
var h = vdom.h;

var ajax = require('@fdaciuk/ajax')

var grid = require('./flexboxGrid')
grid.mount()

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


function isObject(obj){
  return (!Array.isArray(obj) && typeof obj == 'object')
}

function getInputType(input){
  if(!input)
    return 'NULL'
  if(typeof input == 'function')
    return 'NULL'
  if(input.window)
    if(input.window = window.window)
      return 'NULL'
  if(typeof input == 'string')
      if(input.match(/\http\:/))
        return 'HTTP'
      else return 'TAG'
  if(input.type)
    if(input.type == 'vNodeChain')
      return 'CHAIN'
  if(Array.isArray(input))
    return 'DATA'
  if(typeof input == 'object')
    if(Object.keys(input).length > 0)
      return 'DATA'
}

export function $(tag,attributes,children){

    function extend(abstracts){
      abstracts.forEach(function(abstract){
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
      })
    }

    attributes = attributes || {}
    children = children || []
    var domElement = null
    var onload = function(){}

    var _data = null
    var _http = null
    var _mediaSize = ''
    
    var _ajaxCallback = null
    var _ajaxSuccess = null
    var _ajaxError = null

    if(getInputType(tag) == 'DATA'){
      _data = tag
      tag = null
    }
    else if(getInputType(tag) == 'CHAIN'){
      tag = 'DIV'
      var abstracts = parseArgs(arguments)
      extend(abstracts)
    }
    else if(getInputType(tag) == 'NULL'){
      tag = 'DIV'
    }
    else if(getInputType(tag) == 'HTTP'){
      _http = tag
      tag = null
    }

    function addStyle(attr,value){
    	if(!attributes.style)
    		attributes.style = {}
    	attributes.style[attr] = value
    }

    function addClass(name){
      if(!attributes.className)
        attributes.className = ''
      attributes.className += name + ' '
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
      pipe: function(fn){
        _data = fn(_data)
        return onReturn()
      },
      attr: function(attr,val){
        attributes[attr] = val
        return onReturn()
      },
      id: function(id){
        attributes['id'] = id
        return onReturn()
      },
      class: function(className){
        addClass(className)
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
        if(getInputType(fn) == 'CHAIN'){
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
      onkeypress: function(fn,params){
        chain.event('onkeypress',fn,params)
        return onReturn()
      },
      onload: function(fn){
      	onload = fn
      	return onReturn()
      },
      placeholder: function(text){
        attributes.placeholder = text
        return onReturn()
      },
      value: function(value){
        attributes.value = value
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
      flex: function(){
        addStyle('display','flex')
        addStyle('flex-wrap','wrap')
        return onReturn()
      },
      row: function(){
        chain.flex()
        addStyle('flex-direction','row')
        if(arguments)
          parseArgs(arguments).forEach(function(child){
            children.push(child.vNode())
          })
        return onReturn()
      },
      column: function(){
        chain.flex()
        addStyle('flex-direction','column')
        if(arguments)
          parseArgs(arguments).forEach(function(child){
            children.push(child.vNode())
          })
        return onReturn()
      },
      justify: function(alignment){
        addStyle('justify-content',alignment)
        return onReturn()
      },
      order: function(order){
        addStyle('order',order)
        return onReturn()
      },
      shrink: function(shrink){
        addStyle('flex-shrink',shrink)
        return onReturn()
      },
      grow: function(grow){
        addStyle('flex-grow',grow)
        return onReturn()
      },
      wrap: function(reverse){
        if(reverse)
          addStyle('flex-wrap','wrap-reverse')
        else addStyle('flex-wrap','wrap')
        return onReturn()
      },
      align: function(align){
        if(align == 'start' || align == 'end')
          align = 'flex-' + align
        addStyle('align-self',align)
        return onReturn()
      },
      items: function(align){
        if(align == 'start' || align == 'end')
          align = 'flex-' + align
        addStyle('align-items',align)
        return onReturn()
      },
      content: function(align){
        if(align == 'start' || align == 'end')
          align = 'flex-' + align
        addStyle('align-content',align)
        return onReturn()
      },
      start: function(){
        return chain.align('flex-start')
      },
      end: function(){
        return chain.align('flex-end')
      },
      center: function(){
        return chain.align('center')
      },
      baseline: function(){
        return chain.align('baseline')
      },
      stretch: function(){
        return chain.align('stretch')
      },
      xs: function(size){
        if(size)
          addClass('col-xs-' + size)
        _mediaSize = 'xs'
        return onReturn()
      },
      sm: function(size){
        if(size)
          addClass('col-sm-' + size)
        _mediaSize = 'sm'
        return onReturn()
      },
      md: function(size){
        if(size)
          addClass('col-md-' + size)
        _mediaSize = 'md'
        return onReturn()
      },
      lg: function(size){
        if(size)
          addClass('col-lg-' + size)
        _mediaSize = 'lg'
        return onReturn()
      },
      offset: function(offset){
        addClass('col-' + _mediaSize + '-offset-' + offset)
        return onReturn()
      },
      style: function(attr,value){
      	addStyle(attr,value)
      	return onReturn()
      },
      if: function(condition,vNode){
        if(condition == true)
          extend([vNode])
        return onReturn()
      },
      filter: function(fn){
        if(isObject(_data)){
          var newObj = {}
          Object.keys(_data).filter(function(key){
            if(fn(_data[key],key))
              newObj[key] = _data[key]
          })
          _data = newObj
          return onReturn()
        }
        _data = _data.filter(fn)
        return onReturn()
      },
      filterMap: function(data,filter,map){
        data = data.filter(filter)
        chain.map(data,map)
        return onReturn()
      },
      map: function(data,fn){
        if(typeof data == 'function' && !fn){
          if(isObject(_data)){
            Object.keys(_data).map(function(key){
              _data[key] = data(_data[key],key)
            })
            return onReturn()
          }
          _data = _data.map(data)
          return onReturn()
        }
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
      toText: function(data){
        if(!data)
          data = _data
        return $().text(data.toString()).vNode()
      },
      contain: function(containerTag){
        tag = containerTag
        children = _data.map(function(child){
          if(getInputType(child) != 'CHAIN')
            return chain.toText(child)
          return child.vNode()
        })
        return onReturn()
      },
      get: function(){
        function proceed(vNodeChain){
          attributes = {}
          children = []
          extend([vNodeChain])
          chain.render()
        }
        ajax().get(_http)
          .always(function(res,xhr){
            if(_ajaxCallback)
              proceed(_ajaxCallback(res,xhr))
          })
          .then(function(res,xhr){
            if(_ajaxSuccess)
              proceed(_ajaxSuccess(res,xhr))
          })
          .catch(function(res,xhr){
            if(_ajaxError)
              proceed(_ajaxError(res,xhr))
          })
        return onReturn()
      },
      default: function(vNodeChain){
        extend([vNodeChain])
        chain.render()
        return onReturn()
      },
      return: function(fn){
        _ajaxCallback = fn
        return onReturn()
      },
      success: function(fn){
        _ajaxSuccess = fn
        return onReturn()
      },
      error: function(fn){
        _ajaxError = fn
        return onReturn()
      },
      extend: function(){
        var abstracts = parseArgs(arguments)
        extend(abstracts)
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
        domElement.style.display = 'none'
        domElement.innerHTML = ''
        if(domElement.parent)
          domElement.parent.removeChild(domElement)
      },
      vNode: function(){
        if(_data)
          chain.contain()
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
      getTag: function(){
        return tag
      },
      data: function(){
        return _data
      },
      render: function(){
        if(_data && !tag)
          chain.contain()
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



var vdom = require('virtual-dom')
var h = vdom.h;

var ajax = require('./ajax')
export var $ajax = ajax

var grid = require('./flexboxGrid')
grid.mount()

function DOM(){

  var _onchange = null
    
  var _tree = vdom.h('#root','')
  var _rootNode = vdom.create(_tree)
  document.body.appendChild(_rootNode)

  function update(newTree){
    var patches = vdom.diff(_tree, newTree)
    _rootNode = vdom.patch(_rootNode, patches)
    _tree = newTree
  }
  return{
    render: function(newTree){
      update(newTree)
    },
    update: function(){
      if(_onchange){
        var vTree = _onchange().vNode()
        update(vTree)
      }
      else console.warn('onchange() has not been set')
    },
    onchange: function(fn){
      _onchange = fn
      var vTree = _onchange.call().vNode()
      update(vTree)
    }
  }; 
}
var vDOM = new DOM()

window.onresize = function(){
  vDOM.update()
}

function isArray(arr){
  return Array.isArray(arr)
}

function isObject(obj){
  return (!Array.isArray(obj) && typeof obj == 'object')
}

function parseArgs(args){
  return Array.prototype.slice.call(args)
}

function toArray(obj){
  var arr = []
  for(var i in obj)
    arr.push(obj[i])
  return arr
}

function parseUnits(args){
  var args = parseArgs(args)
  var unit = 'px'
  return args.map(function(arg){
    if(arg == 'px' || arg == '%' || arg == 'em' || arg == 'rem')
      return ''
    if(isNaN(arg))
      return arg
    else return arg += unit + ' '
  })
}

function getInputType(input){
  if(!input)
    return 'NULL'
  if(typeof input == 'function')
    return 'NULL'
  if(input.window)
    if(input.window = window.window)
      return 'WINDOW'
  if(typeof input == 'string')
      return 'TAG'
  if(input.type)
    if(input.type == 'vNodeChain')
      return 'CHAIN'
  if(Array.isArray(input))
    return 'DATA'
  if(typeof input == 'object'){
    if(input['$tag']){
      return 'JSON'
    }
    if(Object.keys(input).length > 0){
      return 'DATA'
    }
  }
}

export function $(tag,attributes,children){

    /**********************************
    * Private Methods
    **********************************/

    function extend(abstracts){
      abstracts.forEach(function(abstract){
        if(typeof abstract == 'function')
          abstract = abstract()
        var vNode = abstract.vNode()
        for(var prop in vNode.properties){
          if(prop != 'style')
            _attributes[prop] = vNode.properties[prop]
        }
        var styles = vNode.properties.style
        if(styles){
          if(!_attributes.style)
            _attributes.style = {}
          for(var style in styles)
            _attributes['style'][style] = styles[style]
        }
        var abstractChildren = abstract.getChildren()
        for(var child in abstractChildren)
          _children.push(abstractChildren[child])
      })
    }

    function addAttribute(attr,value){
      _attributes[attr] = value
    }

    function addStyle(attr,value){
      if(!_attributes.style)
        _attributes.style = {}
      _attributes.style[attr] = value
    }

    function addClass(name){
      if(!_attributes.className)
        _attributes.className = ''
      _attributes.className += name + ' '
    }

    function addChild(child){
      _children.push(child)
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

    function createHook(callback){
      var Hook = function(){}
      Hook.prototype.hook = function(node){
        callback(node)
      }
      return new Hook()
    }

    function fromJSON(attrs){
      for(var attr in attrs){
        var args = attrs[attr]
        if(!isArray(args))
          args = [args]
        chain[attr].apply(this,args)
      }
    }

    function onReturn(){
      return chain
    }

    /**********************************
    * Private State
    **********************************/

    var _attributes = attributes || {}
    var _children = children || []
    var domElement = null
    var _container = null
    var onload = function(){}

    var _data = null
    var _mediaSize = ''

    var _chainState = null

    /**********************************
    * Initialize State
    **********************************/

    var type = getInputType(tag)

    if(type == 'DATA'){
      _data = tag
      tag = null
      _chainState = 'DATA'
    }
    else if(type == 'CHAIN'){
      tag = 'DIV'
      var abstracts = parseArgs(arguments)
      extend(abstracts)
      _chainState = 'ELEMENT'
    }
    else if(type == 'NULL'){
      tag = 'DIV'
      _chainState = 'ERROR'
    }
    else if(type == 'TAG'){
      if(isArray(attributes))
        _children.concat(attributes)
    }

    /*================================
    * CHAIN or Public Methods
    ================================*/
    
    var chain = {

      type: 'vNodeChain',

      /**********************************
      * Window / vDom
      **********************************/

      update: function(fn){
        if(fn)
          vDOM.onchange(fn)
        else vDOM.update()
      },

      /**********************************
      * Attributes
      **********************************/

      schema: function(attrs){
        fromJSON(attrs)
        return onReturn()
      },
      attr: function(attr,val){
        addAttribute(attr,val)
        return onReturn()
      },
      attribute: function(attr,val){
        addAttribute(attr,val)
        return onReturn()
      },
      addAttribute: function(attr,val){
        addAttribute(attr,val)
        return onReturn()
      },
      $tag: function(name){
        tag = name
        return onReturn()
      },
      id: function(id){
        addAttribute('id',id)
        return onReturn()
      },
      class: function(className){
        addClass(className)
        return onReturn()
      },
      src: function(path){
        addAttribute('src',path)
        return onReturn()
      },
      href: function(path){
        addAttribute('href',path)
        return onReturn()
      },
      placeholder: function(text){
        addAttribute('placeholder',text)
        return onReturn()
      },
      value: function(value){
        addAttribute('value',value)
        return onReturn()
      },

      /**********************************
      * Children
      **********************************/

      text: function(text){
        addChild(text)
      	return onReturn()
      },
      append: function(fn){
        addChild(fn.call().vNode())
        return onReturn()
      },
      children: function(){
        var args = parseArgs(arguments)
        args = args.map(arg => arg.vNode())
        addChild(args)
        return onReturn()
      },
      columns: function(){
        addStyle('display','flex')
        addStyle('flex-direction','row')
        if(arguments)
          parseArgs(arguments).forEach(function(child){
            addChild(child.vNode())
          })
        return onReturn()
      },
      rows: function(){
        addStyle('display','flex')
        addStyle('flex-direction','column')
        if(arguments)
          parseArgs(arguments).forEach(function(child){
            addChild(child.vNode())
          })
        return onReturn()
      },

      /**********************************
      * Events
      **********************************/

      event: function(event,fn,params){
      	if(typeof fn == 'string'){
      		addAttribute(event,function(){
      			$action.push(fn,params).call()
      		})
      		return onReturn()
      	}
        if(getInputType(fn) == 'CHAIN'){
          addAttribute(event,function(mouseEvent){
            var styles = fn.vNode().properties.style
            for(var style in styles)
              mouseEvent.target.style[style] = styles[style]
          })
          return onReturn()
        }
      	addAttribute(event,fn)
      	return onReturn()
      },
      onchange: function(fn,params){
        chain.event('onchange',fn,params)
        return onReturn()
      },
      onclick: function(fn,params){
        chain.event('onclick',fn,params)
        return onReturn()
      },
      ondbclick: function(fn,params){
        chain.event('ondbclick',fn,params)
        return onReturn()
      },
      onmouseenter: function(fn,params){
        chain.event('onmouseenter',fn,params)
        return onReturn()
      },
      onmouseleave: function(fn,params){
        chain.event('onmouseleave',fn,params)
        return onReturn()
      },
      onkeypress: function(fn,params){
        chain.event('onkeypress',fn,params)
        return onReturn()
      },
      onkeydown: function(fn,params){
        chain.event('onkeydown',fn,params)
        return onReturn()
      },
      onkeyup: function(fn,params){
        chain.event('onkeyup',fn,params)
        return onReturn()
      },
      onfocus: function(fn,params){
        chain.event('onfocus',fn,params)
        return onReturn()
      },
      onblur: function(fn,params){
        chain.event('onblur',fn,params)
        return onReturn()
      },
      onload: function(fn){
        onload = fn
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

      /**********************************
      * Styles
      **********************************/

      style: function(attr,value){
      	addStyle(attr,value)
      	return onReturn()
      },
      addStyle: function(attr,value){
        addStyle(attr,value)
        return onReturn()
      },
      position: function(position){
        addStyle('position',position)
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
      left: function(attr,value,unit){
        unit = unit || 'px'
        addStyle(attr + '-left', value + unit)
        return onReturn()
      },
      right: function(attr,value,unit){
        unit = unit || 'px'
        addStyle(attr + '-right', value + unit)
        return onReturn()
      },
      top: function(attr,value,unit){
        unit = unit || 'px'
        addStyle(attr + '-top', value + unit)
        return onReturn()
      },
      bottom: function(attr,value,unit){
        unit = unit || 'px'
        addStyle(attr + '-bottom', value + unit)
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
      margin: function(attr,value){
        var margin = parseUnits(arguments).join('')
        addStyle('margin',margin)
        return onReturn()
      },
      auto: function(attr){
        addStyle(attr,'auto')
        return onReturn()
      },
      offset: function(side,measure,unit){
        unit = 'px' || unit
        addStyle('margin-'+side,'-' + measure + unit)
        return onReturn()
      },
      border: function(size,style,color){
        if(typeof size == 'string')
          addStyle('border', size)
        else
          addStyle('border', size + 'px ' + style + ' ' + parseColor(color))
        return onReturn()
      },
      font: function(attr,value,unit){
        unit = unit || ' '
        addStyle('font-' + attr, value + unit)
        return onReturn()
      },
      textAlign: function(align){
        addStyle('text-align',align)
        return onReturn()
      },
      letter: function(attr,val,unit){
        unit = unit || 'em'
        addStyle('letter-' + attr, val + unit)
        return onReturn()
      },
      letterSpacing: function(space){
        addStyle('letter-spacing',space + 'px')
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
      uppercase: function(){
        addStyle('text-transform','uppercase')
        return onReturn()
      },
      overflow: function(val){
        addStyle('overflow',val)
        return onReturn()
      },
      hover: function(vNodeChain){
        chain.event('onmouseleave', $(chain))
        chain.event('onmouseenter', vNodeChain)
        return onReturn()
      },
      max: function(attr,value,unit){
        unit = unit || 'px'
        addStyle('max-' + attr, value + unit)
        return onReturn()
      },
      min: function(attr,value,unit){
        unit = unit || 'px'
        addStyle('min-' + attr, value + unit)
        return onReturn()
      },
      media: function(operator,width,vNodeChain){
        if(operator == '>'){
          if(window.outerWidth > width){
            if(vNodeChain == 'hide')
              addStyle('display','none')
            else if(vNodeChain == 'fill')
              addStyle('width','100%')
            else extend([vNodeChain])
          }
        }
        else if(operator == '<'){
          if(window.outerWidth < width){
            if(vNodeChain == 'hide')
              addStyle('display','none')
            else if(vNodeChain == 'fill')
              addStyle('width','100%')
            else extend([vNodeChain])
          }
        }
        return onReturn()
      },

      /**********************************
      * Flex
      **********************************/

      flex: function(value){
        addStyle('flex',value)
        return onReturn()
      },
      centered: function(){
        _container = h('div',{
          style:{
            height: '100%',
            display: 'flex',
            'align-items': 'center',
            'justify-content': 'center'
          }
        })
        return onReturn()
      },
      justify: function(align){
        if(align == 'start' || align == 'end')
          align = 'flex-' + align
        addStyle('justify-content',align)
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
      baseline: function(){
        return chain.align('baseline')
      },
      stretch: function(){
        return chain.align('stretch')
      },

      /**********************************
      * Grid
      **********************************/

      xs: function(size){
        addClass('col-xs-' + size)
        _mediaSize = 'xs'
        return onReturn()
      },
      sm: function(size){
        addClass('col-sm-' + size)
        _mediaSize = 'sm'
        return onReturn()
      },
      md: function(size){
        addClass('col-md-' + size)
        _mediaSize = 'md'
        return onReturn()
      },
      lg: function(size){
        addClass('col-lg-' + size)
        _mediaSize = 'lg'
        return onReturn()
      },

      /**********************************
      * Data
      **********************************/
      pipe: function(fn){
        _data = fn(_data)
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
        addChild(appending)
        return onReturn()
      },
      mapToText: function(data,fn){
        var text = data.map(function(item,i){
          return fn(item,i)
        }).join('')
        addChild(text)
        return onReturn()
      },
      toText: function(data){
        if(!data)
          data = _data
        return $().text(data.toString()).vNode()
      },

      /**********************************
      * Modifiers
      **********************************/

      contain: function(containerTag){
        tag = containerTag
        var data = _data
        if(isObject(data))
          data = toArray(data)
        _children = data.map(function(child){
          if(getInputType(child) != 'CHAIN')
            return chain.toText(child)
          return child.vNode()
        })
        return onReturn()
      },
      extend: function(){
        var abstracts = parseArgs(arguments)
        extend(abstracts)
      	return onReturn()
      },

      /**********************************
      * DOM Operators
      **********************************/

      removeStyles: function(){
        if(domElement)
          domElement.removeAttribute('style')
        _attributes.style = {}
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

      /**********************************
      * Renderers
      **********************************/

      vNode: function(){
        if(_data)
          chain.contain()
        var vNode = h(tag,_attributes,_children)
        if(_container){
          _container.children.push(vNode)
          vNode = _container
        }
    	  var onloadHook = createHook(function(node){
      		domElement = node
      		onload(node)
      	})
      	vNode.properties['onloadHook'] = onloadHook
      	return vNode
      },

      /**********************************
      * Getters
      **********************************/

      domNode: function(){
        return domElement
      },
      getChildren: function(){
      	return _children
      },
      getAttributes: function(){
      	return _attributes
      },
      getStyles: function(){
        return _attributes.style
      },
      getChainState: function(){
        return _chainState
      },
      getTag: function(){
        return tag
      },
      data: function(){
        return _data
      },

      /**********************************
      * Render
      **********************************/

      render: function(){
        if(_data && !tag)
          chain.contain()
      	var vNode = chain.vNode()
      	vDOM.render(vNode)
      	return onReturn()
      }
    }

    /**********************************
    * If JSON input
    **********************************/

    if(type == 'JSON'){
      fromJSON(tag)
      return onReturn()
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

var Color = require("color")

export var $color = function(color){
  if(arguments.length == 3)
    return Color().rgb(parseArgs(arguments))
  return Color(color)
}

var vdom = require('virtual-dom')
var h = vdom.h;

var ajax = require('./ajax')
export var $ajax = ajax

var grid = require('./flexboxGrid')
grid.mount()

function DOM(){
    
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
    reload: function(){
      document.body.removeChild(_rootNode)
      _rootNode = vdom.create(_tree)
      document.body.appendChild(_rootNode)
    }
  }; 
}
var vDOM = new DOM()


function isObject(obj){
  return (!Array.isArray(obj) && typeof obj == 'object')
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

function getInputType(input){
  if(!input)
    return 'NULL'
  if(typeof input == 'function')
    return 'NULL'
  if(input.window)
    if(input.window = window.window)
      return 'NULL'
  if(typeof input == 'string'){
    if(input == 'GET' || input == 'POST' || input == 'JSON')
      return 'HTTP'
  }
  if(typeof input == 'string')
      return 'TAG'
  if(input.type)
    if(input.type == 'vNodeChain')
      return 'CHAIN'
  if(Array.isArray(input))
    return 'DATA'
  if(typeof input == 'object'){
    if(Object.keys(input).length > 0)
      return 'DATA'
  }
}

export function $(tag,attributes,children){

    /**********************************
    * Private Methods
    **********************************/

    function extend(abstracts){
      abstracts.forEach(function(abstract){
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

    function replaceDomNode(vNodeChain){
      var vNode = vNodeChain.vNode()
      var el = vdom.create(vNode)
      domElement.innerHTML = ''
      domElement.removeAttribute('style')
      domElement.appendChild(el)
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
    var _http = null
    var _mediaSize = ''
    
    var _ajaxCallback = null
    var _ajaxSuccess = null
    var _ajaxError = null

    var _chainState = null

    /**********************************
    * Initialize State
    **********************************/

    if(getInputType(tag) == 'DATA'){
      _data = tag
      tag = null
      _chainState = 'DATA'
    }
    else if(getInputType(tag) == 'CHAIN'){
      tag = 'DIV'
      var abstracts = parseArgs(arguments)
      extend(abstracts)
      _chainState = 'ELEMENT'
    }
    else if(getInputType(tag) == 'NULL'){
      tag = 'DIV'
      _chainState = 'ERROR'
    }
    else if(getInputType(tag) == 'HTTP'){
      var method = tag.toLowerCase()
      var url = attributes
      var headers = children || {}
      _attributes = {}
      _children = []

      if(method == 'json'){
        ajax().json(url,function(data){
          replaceDomNode(_ajaxSuccess(data))
        })
      }
      else{
        ajax(headers)[method](url)
          .always(function(res,xhr){
            if(_ajaxCallback){
              replaceDomNode(_ajaxCallback(res,xhr))
              _chainState = 'DATA'
            }
          })
          .then(function(res,xhr){
            if(_ajaxSuccess){
              replaceDomNode(_ajaxSuccess(res,xhr))
              _chainState = 'DATA'
            }
          })
          .catch(function(res,xhr){
            if(_ajaxError){
              replaceDomNode(_ajaxError(res,xhr))
              _chainState = 'DATA'
            }
          })
      }
      tag = null
      _chainState = 'AJAX'
    }

    /*================================
    * CHAIN or Public Methods
    ================================*/
    
    var chain = {

      type: 'vNodeChain',

      pipe: function(fn){
        _data = fn(_data)
        return onReturn()
      },

      /**********************************
      * Attributes
      **********************************/

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
          addAttribute(event,function(){
            var styles = fn.vNode().properties.style
            for(var style in styles)
              domElement.style[style] = styles[style]
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
      offset: function(side,measure,unit){
        unit = 'px' || unit
        addStyle('margin-'+side,'-' + measure + unit)
        return onReturn()
      },
      border: function(size,style,color){
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

      /**********************************
      * Data
      **********************************/

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
        _children = _data.map(function(child){
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
      * Ajax
      **********************************/

      default: function(vNodeChain){
        extend([vNodeChain])
        vDOM.reload()
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
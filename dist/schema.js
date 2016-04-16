(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Schema = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**!
 * ajax - v1.0.10
 * Ajax module in Vanilla JS
 * https://github.com/fdaciuk/ajax

 * Sun Mar 06 2016 16:13:44 GMT-0300 (BRT)
 * MIT (c) Fernando Daciuk
*/
!function(e,t){"use strict";"function"==typeof define&&define.amd?define("ajax",t):"object"==typeof exports?exports=module.exports=t():(e.Ajax=t(),e.ajax=t())}(this,function(){"use strict";function e(t){void 0!==this&&console.warn(["Instance with `new` is deprecated. ","This will be removed in `v2.0.0` version."].join("")),this instanceof e&&console.warn(["Ajax constructor is deprecated. This will be removed in ","`v2.0.0`. Use ajax (lowercase version) without `new` ","keyword instead"].join("")),t=t||{};var n={},o={};return o.methods={then:function(){},"catch":function(){},always:function(){},done:function(){},error:function(){}},o.maybeData=function(e){return e||null},o.httpMethods=["get","post","put","delete"],o.httpMethods.forEach(function(e){n[e]=function(n,r){return o.xhrConnection(e,n,o.maybeData(r),t)}}),o.xhrConnection=function(e,t,n,r){var s=new XMLHttpRequest;return s.open(e,t||"",!0),o.setHeaders(s,r.headers),s.addEventListener("readystatechange",o.ready,!1),s.send(o.objectToQueryString(n)),o.promises()},o.setHeaders=function(e,t){t=t||{},o.hasContentType(t)||(t["Content-Type"]="application/x-www-form-urlencoded"),Object.keys(t).forEach(function(n){e.setRequestHeader(n,t[n])})},o.hasContentType=function(e){return Object.keys(e).some(function(e){return"content-type"===e.toLowerCase()})},o.ready=function(){var e=this;e.readyState===e.DONE&&(e.removeEventListener("readystatechange",o.ready,!1),o.methods.always.apply(o.methods,o.parseResponse(e)),e.status>=200&&e.status<300?(o.methods.then.apply(o.methods,o.parseResponse(e)),o.methods.done.apply(o.methods,o.parseResponse(e))):(o.methods["catch"].apply(o.methods,o.parseResponse(e)),o.methods.error.apply(o.methods,o.parseResponse(e))))},o.parseResponse=function(e){var t;try{t=JSON.parse(e.responseText)}catch(n){t=e.responseText}return[t,e]},o.promises=function(){var e={};return Object.keys(o.methods).forEach(function(t){e[t]=o.generatePromise.call(this,t)},this),e},o.generatePromise=function(e){return function(t){return o.generateDeprecatedMessage(e),o.methods[e]=t,this}},o.generateDeprecatedMessage=function(e){var t="@fdaciuk/ajax: `%s` is deprecated and will be removed in v2.0.0. Use `%s` instead.";switch(e){case"done":console.warn(t,"done","then");break;case"error":console.warn(t,"error","catch")}},o.objectToQueryString=function(e){return o.isObject(e)?o.getQueryString(e):e},o.getQueryString=function(e){return Object.keys(e).map(function(t){return[encodeURIComponent(t),"=",encodeURIComponent(e[t])].join("")}).join("&")},o.isObject=function(e){return"[object Object]"===Object.prototype.toString.call(e)},t.method&&t.url?o.xhrConnection(t.method,t.url,o.maybeData(t.data),t):n}return e});
},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],4:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],5:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":2}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],9:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":15}],10:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":35}],11:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":22}],12:[function(require,module,exports){
var diff = require("./diff.js")
var patch = require("./patch.js")
var h = require("./h.js")
var create = require("./create-element.js")
var VNode = require('./vnode/vnode.js')
var VText = require('./vnode/vtext.js')

module.exports = {
    diff: diff,
    patch: patch,
    h: h,
    create: create,
    VNode: VNode,
    VText: VText
}

},{"./create-element.js":9,"./diff.js":10,"./h.js":11,"./patch.js":13,"./vnode/vnode.js":31,"./vnode/vtext.js":33}],13:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":18}],14:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":26,"is-object":8}],15:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":24,"../vnode/is-vnode.js":27,"../vnode/is-vtext.js":28,"../vnode/is-widget.js":29,"./apply-properties":14,"global/document":5}],16:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],17:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":29,"../vnode/vpatch.js":32,"./apply-properties":14,"./update-widget":19}],18:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":15,"./dom-index":16,"./patch-op":17,"global/document":5,"x-is-array":36}],19:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":29}],20:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":4}],21:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],22:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":25,"../vnode/is-vhook":26,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vnode.js":31,"../vnode/vtext.js":33,"./hooks/ev-hook.js":20,"./hooks/soft-set-hook.js":21,"./parse-tag.js":23,"x-is-array":36}],23:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":3}],24:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":25,"./is-vnode":27,"./is-vtext":28,"./is-widget":29}],25:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],26:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],27:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":30}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":30}],29:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],30:[function(require,module,exports){
module.exports = "2"

},{}],31:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":25,"./is-vhook":26,"./is-vnode":27,"./is-widget":29,"./version":30}],32:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":30}],33:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":30}],34:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":26,"is-object":8}],35:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":24,"../vnode/is-thunk":25,"../vnode/is-vnode":27,"../vnode/is-vtext":28,"../vnode/is-widget":29,"../vnode/vpatch":32,"./diff-props":34,"x-is-array":36}],36:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.$ = $;
exports.Abstract = Abstract;

var vdom = require('virtual-dom');
var h = vdom.h;

var ajax = require('@fdaciuk/ajax');

var grid = require('./flexboxGrid');
grid.mount();

function DOM() {

  var tree = vdom.h('#root', '');
  var rootNode = vdom.create(tree);
  document.body.appendChild(rootNode);

  function update(newTree) {
    var patches = vdom.diff(tree, newTree);
    rootNode = vdom.patch(rootNode, patches);
    tree = newTree;
  }
  return {
    render: function render(tree) {
      update(tree);
    }
  };
}
var vDOM = new DOM();

function isObject(obj) {
  return !Array.isArray(obj) && typeof obj == 'object';
}

function getInputType(input) {
  if (!input) return 'NULL';
  if (typeof input == 'function') return 'NULL';
  if (input.window) if (input.window = window.window) return 'NULL';
  if (typeof input == 'string') return 'TAG';
  if (input.type) if (input.type == 'vNodeChain') return 'CHAIN';
  if (Array.isArray(input)) return 'DATA';
  if (typeof input == 'object') {
    if (input.GET) {
      return 'HTTP';
    } else if (Object.keys(input).length > 0) return 'DATA';
  }
}

function $(tag, attributes, _children) {

  function _extend(abstracts) {
    abstracts.forEach(function (abstract) {
      var vNode = abstract.vNode();
      for (var prop in vNode.properties) {
        if (prop != 'style') attributes[prop] = vNode.properties[prop];
      }
      var styles = vNode.properties.style;
      if (styles) {
        if (!attributes.style) attributes.style = {};
        for (var style in styles) attributes['style'][style] = styles[style];
      }
      var abstractChildren = abstract.getChildren();
      for (var child in abstractChildren) _children.push(abstractChildren[child]);
    });
  }

  attributes = attributes || {};
  _children = _children || [];
  var domElement = null;
  var _onload = function onload() {};

  var _data = null;
  var _http = null;
  var _mediaSize = '';

  var _ajaxCallback = null;
  var _ajaxSuccess = null;
  var _ajaxError = null;

  if (getInputType(tag) == 'DATA') {
    _data = tag;
    tag = null;
  } else if (getInputType(tag) == 'CHAIN') {
    tag = 'DIV';
    var abstracts = parseArgs(arguments);
    _extend(abstracts);
  } else if (getInputType(tag) == 'NULL') {
    tag = 'DIV';
  } else if (getInputType(tag) == 'HTTP') {
    (function () {
      var proceed = function proceed(vNodeChain) {
        attributes = {};
        _children = [];
        _extend([vNodeChain]);
        chain.render();
      };

      ajax().get(tag.GET).always(function (res, xhr) {
        if (_ajaxCallback) proceed(_ajaxCallback(res, xhr));
      }).then(function (res, xhr) {
        if (_ajaxSuccess) proceed(_ajaxSuccess(res, xhr));
      })['catch'](function (res, xhr) {
        if (_ajaxError) proceed(_ajaxError(res, xhr));
      });
      tag = null;
    })();
  }

  function addStyle(attr, value) {
    if (!attributes.style) attributes.style = {};
    attributes.style[attr] = value;
  }

  function addClass(name) {
    if (!attributes.className) attributes.className = '';
    attributes.className += name + ' ';
  }

  function parseRGBA(rgba) {
    rgba = parseArgs(rgba);
    if (rgba.length == 3) return 'rgb(' + rgba.join(',') + ')';else if (rgba.length == 4) return 'rgba(' + rgba.join(',') + ')';
  }

  function parseColor(color) {
    if (typeof color == 'object') color = color.rgbString();
    return color;
    return color;
  }

  function parseArgs(args) {
    return Array.prototype.slice.call(args);
  }

  function parseUnits(args) {
    var args = parseArgs(args);
    var unit = 'px';
    if (typeof args[args.length - 1] == 'string') unit = args.splice(args.length - 1);
    return args.map(function (arg) {
      return arg += unit + ' ';
    });
  }

  function createHook(callback) {
    var Hook = function Hook() {};
    Hook.prototype.hook = function (node) {
      callback(node);
    };
    return new Hook();
  }

  function onReturn() {
    return chain;
  }

  var chain = {
    pipe: function pipe(fn) {
      _data = fn(_data);
      return onReturn();
    },
    attr: function attr(_attr, val) {
      attributes[_attr] = val;
      return onReturn();
    },
    id: function id(_id) {
      attributes['id'] = _id;
      return onReturn();
    },
    'class': function _class(className) {
      addClass(className);
      return onReturn();
    },
    children: function children() {
      var args = parseArgs(arguments);
      args = args.map(function (arg) {
        return arg.vNode();
      });
      _children.push(args);
      return onReturn();
    },
    text: function text(_text) {
      _children.push(_text);
      return onReturn();
    },
    event: function event(_event, fn, params) {
      if (typeof fn == 'string') {
        attributes[_event] = function () {
          $action.push(fn, params).call();
        };
        return onReturn();
      }
      if (getInputType(fn) == 'CHAIN') {
        attributes[_event] = function () {
          var styles = fn.vNode().properties.style;
          for (var style in styles) domElement.style[style] = styles[style];
        };
        return onReturn();
      }
      attributes[_event] = fn;
      return onReturn();
    },
    action: function action(handler, vNode) {
      $action.pull(handler, function () {
        if (typeof vNode == 'function') {
          vNode = vNode.apply(this, arguments);
        }
        var styles = vNode.vNode().properties.style;
        for (var style in styles) domElement.style[style] = styles[style];
      });
      return onReturn();
    },
    onclick: function onclick(fn, params) {
      chain.event('onclick', fn, params);
      return onReturn();
    },
    onkeypress: function onkeypress(fn, params) {
      chain.event('onkeypress', fn, params);
      return onReturn();
    },
    onload: function onload(fn) {
      _onload = fn;
      return onReturn();
    },
    placeholder: function placeholder(text) {
      attributes.placeholder = text;
      return onReturn();
    },
    value: function value(_value) {
      attributes.value = _value;
      return onReturn();
    },
    display: function display(_display) {
      addStyle('display', _display);
      return onReturn();
    },
    hide: function hide() {
      addStyle('display', 'none');
      return onReturn();
    },
    show: function show() {
      addStyle('display', 'block');
      return onReturn();
    },
    color: function color(_color) {
      if (arguments.length > 2) _color = parseRGBA(arguments);
      _color = parseColor(_color);
      addStyle('color', _color);
      return onReturn();
    },
    background: function background(color) {
      if (arguments.length > 2) color = parseRGBA(arguments);
      color = parseColor(color);
      addStyle('background-color', color);
      return onReturn();
    },
    opacity: function opacity(value) {
      addStyle('opacity', value);
      return onReturn();
    },
    height: function height(_height, unit) {
      if (unit) _height = _height + unit;else if (!isNaN(_height)) _height = _height + 'px';
      addStyle('height', _height);
      return onReturn();
    },
    width: function width(_width, unit) {
      if (unit) _width = _width + unit;else if (!isNaN(_width)) _width = _width + 'px';
      addStyle('width', _width);
      return onReturn();
    },
    size: function size() {
      var sizes = parseUnits(arguments);
      addStyle('height', sizes[0]);
      if (sizes.length > 1) addStyle('width', sizes[1]);
      return onReturn();
    },
    padding: function padding() {
      var padding = parseUnits(arguments).join('');
      addStyle('padding', padding);
      return onReturn();
    },
    margin: function margin() {
      var margin = parseUnits(arguments).join('');
      addStyle('margin', margin);
      return onReturn();
    },
    border: function border(size, style, color) {
      addStyle('border', size + 'px ' + style + ' ' + color);
      return onReturn();
    },
    transition: function transition(styles, duration) {
      if (!duration) {
        duration = styles;
        styles = 'all';
      }
      addStyle('transition', styles + ' ' + duration + 's');
      return onReturn();
    },
    flex: function flex() {
      addStyle('display', 'flex');
      addStyle('flex-wrap', 'wrap');
      return onReturn();
    },
    row: function row() {
      chain.flex();
      addStyle('flex-direction', 'row');
      if (arguments) parseArgs(arguments).forEach(function (child) {
        _children.push(child.vNode());
      });
      return onReturn();
    },
    column: function column() {
      chain.flex();
      addStyle('flex-direction', 'column');
      if (arguments) parseArgs(arguments).forEach(function (child) {
        _children.push(child.vNode());
      });
      return onReturn();
    },
    justify: function justify(alignment) {
      addStyle('justify-content', alignment);
      return onReturn();
    },
    order: function order(_order) {
      addStyle('order', _order);
      return onReturn();
    },
    shrink: function shrink(_shrink) {
      addStyle('flex-shrink', _shrink);
      return onReturn();
    },
    grow: function grow(_grow) {
      addStyle('flex-grow', _grow);
      return onReturn();
    },
    wrap: function wrap(reverse) {
      if (reverse) addStyle('flex-wrap', 'wrap-reverse');else addStyle('flex-wrap', 'wrap');
      return onReturn();
    },
    align: function align(_align) {
      if (_align == 'start' || _align == 'end') _align = 'flex-' + _align;
      addStyle('align-self', _align);
      return onReturn();
    },
    items: function items(align) {
      if (align == 'start' || align == 'end') align = 'flex-' + align;
      addStyle('align-items', align);
      return onReturn();
    },
    content: function content(align) {
      if (align == 'start' || align == 'end') align = 'flex-' + align;
      addStyle('align-content', align);
      return onReturn();
    },
    start: function start() {
      return chain.align('flex-start');
    },
    end: function end() {
      return chain.align('flex-end');
    },
    center: function center() {
      return chain.align('center');
    },
    baseline: function baseline() {
      return chain.align('baseline');
    },
    stretch: function stretch() {
      return chain.align('stretch');
    },
    xs: function xs(size) {
      if (size) addClass('col-xs-' + size);
      _mediaSize = 'xs';
      return onReturn();
    },
    sm: function sm(size) {
      if (size) addClass('col-sm-' + size);
      _mediaSize = 'sm';
      return onReturn();
    },
    md: function md(size) {
      if (size) addClass('col-md-' + size);
      _mediaSize = 'md';
      return onReturn();
    },
    lg: function lg(size) {
      if (size) addClass('col-lg-' + size);
      _mediaSize = 'lg';
      return onReturn();
    },
    offset: function offset(_offset) {
      addClass('col-' + _mediaSize + '-offset-' + _offset);
      return onReturn();
    },
    style: function style(attr, value) {
      addStyle(attr, value);
      return onReturn();
    },
    'if': function _if(condition, vNode) {
      if (condition == true) _extend([vNode]);
      return onReturn();
    },
    filter: function filter(fn) {
      if (isObject(_data)) {
        var newObj = {};
        Object.keys(_data).filter(function (key) {
          if (fn(_data[key], key)) newObj[key] = _data[key];
        });
        _data = newObj;
        return onReturn();
      }
      _data = _data.filter(fn);
      return onReturn();
    },
    filterMap: function filterMap(data, filter, map) {
      data = data.filter(filter);
      chain.map(data, map);
      return onReturn();
    },
    map: function map(data, fn) {
      if (typeof data == 'function' && !fn) {
        if (isObject(_data)) {
          Object.keys(_data).map(function (key) {
            _data[key] = data(_data[key], key);
          });
          return onReturn();
        }
        _data = _data.map(data);
        return onReturn();
      }
      var appending = data.map(function (item, i) {
        return fn(item, i).vNode();
      });
      _children.push(appending);
      return onReturn();
    },
    mapToText: function mapToText(data, fn) {
      var text = data.map(function (item, i) {
        return fn(item, i);
      }).join('');
      _children.push(text);
      return onReturn();
    },
    toText: function toText(data) {
      if (!data) data = _data;
      return $().text(data.toString()).vNode();
    },
    contain: function contain(containerTag) {
      tag = containerTag;
      _children = _data.map(function (child) {
        if (getInputType(child) != 'CHAIN') return chain.toText(child);
        return child.vNode();
      });
      return onReturn();
    },
    'default': function _default(vNodeChain) {
      _extend([vNodeChain]);
      chain.render();
      return onReturn();
    },
    'return': function _return(fn) {
      _ajaxCallback = fn;
      return onReturn();
    },
    success: function success(fn) {
      _ajaxSuccess = fn;
      return onReturn();
    },
    error: function error(fn) {
      _ajaxError = fn;
      return onReturn();
    },
    extend: function extend() {
      var abstracts = parseArgs(arguments);
      _extend(abstracts);
      return onReturn();
    },
    removeStyles: function removeStyles() {
      if (domElement) domElement.removeAttribute('style');
      attributes.style = {};
      return onReturn();
    },
    click: function click() {
      domElement.click();
      return onReturn();
    },
    remove: function remove() {
      domElement.style.display = 'none';
      domElement.innerHTML = '';
      if (domElement.parent) domElement.parent.removeChild(domElement);
    },
    vNode: function vNode() {
      if (_data) chain.contain();
      var vNode = h(tag, attributes, _children);
      var onloadHook = createHook(function (node) {
        domElement = node;
        _onload(node);
      });
      vNode.properties['onloadHook'] = onloadHook;
      return vNode;
    },
    domNode: function domNode() {
      return domElement;
    },
    getChildren: function getChildren() {
      return _children;
    },
    getAttributes: function getAttributes() {
      return attributes;
    },
    getTag: function getTag() {
      return tag;
    },
    data: function data() {
      return _data;
    },
    render: function render() {
      if (_data && !tag) chain.contain();
      var vNode = chain.vNode();
      vDOM.render(vNode);
      return onReturn();
    },
    type: 'vNodeChain'
  };

  return chain;
}

var actions = [];

var $action = {

  push: function push(handler, params) {
    if (!Array.isArray(params)) params = [params];
    return function () {
      actions[handler].forEach(function (action) {
        action.apply(this, params);
      });
    };
  },
  pull: function pull(handler, fn) {
    if (!actions[handler]) actions[handler] = [];
    actions[handler].push(fn);
  },
  getActions: function getActions(handler) {
    return actions[handler];
  },
  removeAllActions: function removeAllActions(handler) {
    actions = [];
  }

};

exports.$action = $action;

function Abstract() {
  return $('template');
}

},{"./flexboxGrid":38,"@fdaciuk/ajax":1,"virtual-dom":12}],38:[function(require,module,exports){
'use strict';

var grid = ".container,.container-fluid{margin-right:auto;margin-left:auto}.container-fluid{padding-right:2rem;padding-left:2rem}.row{box-sizing:border-box;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-flex:0;-webkit-flex:0 1 auto;-ms-flex:0 1 auto;flex:0 1 auto;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-right:-.5rem;margin-left:-.5rem}.row.reverse{-webkit-box-orient:horizontal;-webkit-box-direction:reverse;-webkit-flex-direction:row-reverse;-ms-flex-direction:row-reverse;flex-direction:row-reverse}.col.reverse{-webkit-box-orient:vertical;-webkit-box-direction:reverse;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse}.col-xs,.col-xs-1,.col-xs-10,.col-xs-11,.col-xs-12,.col-xs-2,.col-xs-3,.col-xs-4,.col-xs-5,.col-xs-6,.col-xs-7,.col-xs-8,.col-xs-9,.col-xs-offset-1,.col-xs-offset-10,.col-xs-offset-11,.col-xs-offset-12,.col-xs-offset-2,.col-xs-offset-3,.col-xs-offset-4,.col-xs-offset-5,.col-xs-offset-6,.col-xs-offset-7,.col-xs-offset-8,.col-xs-offset-9{box-sizing:border-box;-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-xs{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-xs-1{-webkit-flex-basis:8.333%;-ms-flex-preferred-size:8.333%;flex-basis:8.333%;max-width:8.333%}.col-xs-2{-webkit-flex-basis:16.667%;-ms-flex-preferred-size:16.667%;flex-basis:16.667%;max-width:16.667%}.col-xs-3{-webkit-flex-basis:25%;-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-xs-4{-webkit-flex-basis:33.333%;-ms-flex-preferred-size:33.333%;flex-basis:33.333%;max-width:33.333%}.col-xs-5{-webkit-flex-basis:41.667%;-ms-flex-preferred-size:41.667%;flex-basis:41.667%;max-width:41.667%}.col-xs-6{-webkit-flex-basis:50%;-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-xs-7{-webkit-flex-basis:58.333%;-ms-flex-preferred-size:58.333%;flex-basis:58.333%;max-width:58.333%}.col-xs-8{-webkit-flex-basis:66.667%;-ms-flex-preferred-size:66.667%;flex-basis:66.667%;max-width:66.667%}.col-xs-9{-webkit-flex-basis:75%;-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-xs-10{-webkit-flex-basis:83.333%;-ms-flex-preferred-size:83.333%;flex-basis:83.333%;max-width:83.333%}.col-xs-11{-webkit-flex-basis:91.667%;-ms-flex-preferred-size:91.667%;flex-basis:91.667%;max-width:91.667%}.col-xs-12{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-xs-offset-1{margin-left:8.333%}.col-xs-offset-2{margin-left:16.667%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-4{margin-left:33.333%}.col-xs-offset-5{margin-left:41.667%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-7{margin-left:58.333%}.col-xs-offset-8{margin-left:66.667%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-10{margin-left:83.333%}.col-xs-offset-11{margin-left:91.667%}.start-xs{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-xs{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-xs{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-xs{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}.middle-xs{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.bottom-xs{-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end}.around-xs{-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around}.between-xs{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.first-xs{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.last-xs{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}@media only screen and (min-width:48em){.container{width:49rem}.col-sm,.col-sm-1,.col-sm-10,.col-sm-11,.col-sm-12,.col-sm-2,.col-sm-3,.col-sm-4,.col-sm-5,.col-sm-6,.col-sm-7,.col-sm-8,.col-sm-9,.col-sm-offset-1,.col-sm-offset-10,.col-sm-offset-11,.col-sm-offset-12,.col-sm-offset-2,.col-sm-offset-3,.col-sm-offset-4,.col-sm-offset-5,.col-sm-offset-6,.col-sm-offset-7,.col-sm-offset-8,.col-sm-offset-9{box-sizing:border-box;-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-sm{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-sm-1{-webkit-flex-basis:8.333%;-ms-flex-preferred-size:8.333%;flex-basis:8.333%;max-width:8.333%}.col-sm-2{-webkit-flex-basis:16.667%;-ms-flex-preferred-size:16.667%;flex-basis:16.667%;max-width:16.667%}.col-sm-3{-webkit-flex-basis:25%;-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-sm-4{-webkit-flex-basis:33.333%;-ms-flex-preferred-size:33.333%;flex-basis:33.333%;max-width:33.333%}.col-sm-5{-webkit-flex-basis:41.667%;-ms-flex-preferred-size:41.667%;flex-basis:41.667%;max-width:41.667%}.col-sm-6{-webkit-flex-basis:50%;-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-sm-7{-webkit-flex-basis:58.333%;-ms-flex-preferred-size:58.333%;flex-basis:58.333%;max-width:58.333%}.col-sm-8{-webkit-flex-basis:66.667%;-ms-flex-preferred-size:66.667%;flex-basis:66.667%;max-width:66.667%}.col-sm-9{-webkit-flex-basis:75%;-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-sm-10{-webkit-flex-basis:83.333%;-ms-flex-preferred-size:83.333%;flex-basis:83.333%;max-width:83.333%}.col-sm-11{-webkit-flex-basis:91.667%;-ms-flex-preferred-size:91.667%;flex-basis:91.667%;max-width:91.667%}.col-sm-12{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-sm-offset-1{margin-left:8.333%}.col-sm-offset-2{margin-left:16.667%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-4{margin-left:33.333%}.col-sm-offset-5{margin-left:41.667%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-7{margin-left:58.333%}.col-sm-offset-8{margin-left:66.667%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-10{margin-left:83.333%}.col-sm-offset-11{margin-left:91.667%}.start-sm{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-sm{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-sm{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-sm{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}.middle-sm{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.bottom-sm{-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end}.around-sm{-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around}.between-sm{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.first-sm{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.last-sm{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}}@media only screen and (min-width:64em){.container{width:65rem}.col-md,.col-md-1,.col-md-10,.col-md-11,.col-md-12,.col-md-2,.col-md-3,.col-md-4,.col-md-5,.col-md-6,.col-md-7,.col-md-8,.col-md-9,.col-md-offset-1,.col-md-offset-10,.col-md-offset-11,.col-md-offset-12,.col-md-offset-2,.col-md-offset-3,.col-md-offset-4,.col-md-offset-5,.col-md-offset-6,.col-md-offset-7,.col-md-offset-8,.col-md-offset-9{box-sizing:border-box;-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-md{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-md-1{-webkit-flex-basis:8.333%;-ms-flex-preferred-size:8.333%;flex-basis:8.333%;max-width:8.333%}.col-md-2{-webkit-flex-basis:16.667%;-ms-flex-preferred-size:16.667%;flex-basis:16.667%;max-width:16.667%}.col-md-3{-webkit-flex-basis:25%;-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-md-4{-webkit-flex-basis:33.333%;-ms-flex-preferred-size:33.333%;flex-basis:33.333%;max-width:33.333%}.col-md-5{-webkit-flex-basis:41.667%;-ms-flex-preferred-size:41.667%;flex-basis:41.667%;max-width:41.667%}.col-md-6{-webkit-flex-basis:50%;-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-md-7{-webkit-flex-basis:58.333%;-ms-flex-preferred-size:58.333%;flex-basis:58.333%;max-width:58.333%}.col-md-8{-webkit-flex-basis:66.667%;-ms-flex-preferred-size:66.667%;flex-basis:66.667%;max-width:66.667%}.col-md-9{-webkit-flex-basis:75%;-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-md-10{-webkit-flex-basis:83.333%;-ms-flex-preferred-size:83.333%;flex-basis:83.333%;max-width:83.333%}.col-md-11{-webkit-flex-basis:91.667%;-ms-flex-preferred-size:91.667%;flex-basis:91.667%;max-width:91.667%}.col-md-12{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-md-offset-1{margin-left:8.333%}.col-md-offset-2{margin-left:16.667%}.col-md-offset-3{margin-left:25%}.col-md-offset-4{margin-left:33.333%}.col-md-offset-5{margin-left:41.667%}.col-md-offset-6{margin-left:50%}.col-md-offset-7{margin-left:58.333%}.col-md-offset-8{margin-left:66.667%}.col-md-offset-9{margin-left:75%}.col-md-offset-10{margin-left:83.333%}.col-md-offset-11{margin-left:91.667%}.start-md{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-md{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-md{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-md{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}.middle-md{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.bottom-md{-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end}.around-md{-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around}.between-md{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.first-md{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.last-md{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}}@media only screen and (min-width:75em){.container{width:76rem}.col-lg,.col-lg-1,.col-lg-10,.col-lg-11,.col-lg-12,.col-lg-2,.col-lg-3,.col-lg-4,.col-lg-5,.col-lg-6,.col-lg-7,.col-lg-8,.col-lg-9,.col-lg-offset-1,.col-lg-offset-10,.col-lg-offset-11,.col-lg-offset-12,.col-lg-offset-2,.col-lg-offset-3,.col-lg-offset-4,.col-lg-offset-5,.col-lg-offset-6,.col-lg-offset-7,.col-lg-offset-8,.col-lg-offset-9{box-sizing:border-box;-webkit-box-flex:0;-webkit-flex:0 0 auto;-ms-flex:0 0 auto;flex:0 0 auto;padding-right:.5rem;padding-left:.5rem}.col-lg{-webkit-box-flex:1;-webkit-flex-grow:1;-ms-flex-positive:1;flex-grow:1;-webkit-flex-basis:0;-ms-flex-preferred-size:0;flex-basis:0;max-width:100%}.col-lg-1{-webkit-flex-basis:8.333%;-ms-flex-preferred-size:8.333%;flex-basis:8.333%;max-width:8.333%}.col-lg-2{-webkit-flex-basis:16.667%;-ms-flex-preferred-size:16.667%;flex-basis:16.667%;max-width:16.667%}.col-lg-3{-webkit-flex-basis:25%;-ms-flex-preferred-size:25%;flex-basis:25%;max-width:25%}.col-lg-4{-webkit-flex-basis:33.333%;-ms-flex-preferred-size:33.333%;flex-basis:33.333%;max-width:33.333%}.col-lg-5{-webkit-flex-basis:41.667%;-ms-flex-preferred-size:41.667%;flex-basis:41.667%;max-width:41.667%}.col-lg-6{-webkit-flex-basis:50%;-ms-flex-preferred-size:50%;flex-basis:50%;max-width:50%}.col-lg-7{-webkit-flex-basis:58.333%;-ms-flex-preferred-size:58.333%;flex-basis:58.333%;max-width:58.333%}.col-lg-8{-webkit-flex-basis:66.667%;-ms-flex-preferred-size:66.667%;flex-basis:66.667%;max-width:66.667%}.col-lg-9{-webkit-flex-basis:75%;-ms-flex-preferred-size:75%;flex-basis:75%;max-width:75%}.col-lg-10{-webkit-flex-basis:83.333%;-ms-flex-preferred-size:83.333%;flex-basis:83.333%;max-width:83.333%}.col-lg-11{-webkit-flex-basis:91.667%;-ms-flex-preferred-size:91.667%;flex-basis:91.667%;max-width:91.667%}.col-lg-12{-webkit-flex-basis:100%;-ms-flex-preferred-size:100%;flex-basis:100%;max-width:100%}.col-lg-offset-1{margin-left:8.333%}.col-lg-offset-2{margin-left:16.667%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-4{margin-left:33.333%}.col-lg-offset-5{margin-left:41.667%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-7{margin-left:58.333%}.col-lg-offset-8{margin-left:66.667%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-10{margin-left:83.333%}.col-lg-offset-11{margin-left:91.667%}.start-lg{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-align:start}.center-lg{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.end-lg{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;text-align:end}.top-lg{-webkit-box-align:start;-webkit-align-items:flex-start;-ms-flex-align:start;align-items:flex-start}.middle-lg{-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center}.bottom-lg{-webkit-box-align:end;-webkit-align-items:flex-end;-ms-flex-align:end;align-items:flex-end}.around-lg{-webkit-justify-content:space-around;-ms-flex-pack:distribute;justify-content:space-around}.between-lg{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between}.first-lg{-webkit-box-ordinal-group:0;-webkit-order:-1;-ms-flex-order:-1;order:-1}.last-lg{-webkit-box-ordinal-group:2;-webkit-order:1;-ms-flex-order:1;order:1}}";

module.exports = {
	mount: function mount() {
		var tag = document.createElement('style');
		tag.id = 'schema-flexboxgrid';
		tag.innerHTML = grid;
		document.head.appendChild(tag);
	},
	unmount: function unmount() {
		var el = document.getElementById('schema-flexboxgrid');
		el.innerHTML = '';
		el.parent.removeChild(el);
	}
};

},{}]},{},[37])(37)
});
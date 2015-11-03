'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.domContentIs = exports.domAttrsIsLike = exports.domAttrsIs = exports.domIsLike = exports.domIs = undefined;

var _emmet = require('emmet');

var _emmet2 = _interopRequireDefault(_emmet);

var _abbreviation = require('emmet/lib/parser/abbreviation');

var _abbreviation2 = _interopRequireDefault(_abbreviation);

var _domWhitespace = require('dom-whitespace');

var _domWhitespace2 = _interopRequireDefault(_domWhitespace);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _snippets = require('../assets/snippets.json');

var _snippets2 = _interopRequireDefault(_snippets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @module eminent */

/*
 * Reset Emmet snippets to snippets without blank attributes
 */
_emmet2.default.resetSnippets();
_emmet2.default.loadSnippets(_snippets2.default);

/**
 *
 * @private
 * @param  {nodelist} collection - DOM collection node list
 * @return {array}
 */
var _collectionToArray = function _collectionToArray(collection) {
    var ary = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = collection[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var node = _step.value;

            ary.push(node);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return ary;
};

/**
 * @private
 * @param  {jsdom} node - Node to parse to HTML
 * @param  {boolean} children - Whether to include children or not
 * @return {string}
 */
var _getNodeHTML = function _getNodeHTML(node, children) {
    if (!children) {
        node.innerHTML = '';
    } else {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = node.childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var child = _step2.value;

                child.innerHTML = '';
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        ;
    }

    return node.outerHTML;
};

/**
 * @private
 * @param  {emmet} tree - Tree to parse to HTML
 * @param  {boolean} children - Whether to include children or not
 * @return {string}
 */
var _getTreeHTML = function _getTreeHTML(tree, children) {
    var abbr = tree.abbreviation;

    if (children) {
        var childrenAbbrs = tree.children.map(function (child) {
            return child.abbreviation;
        }).join('+');
        abbr = abbr + '>' + childrenAbbrs;
    }

    return _abbreviation2.default.expand(abbr, { profile: 'plain' });
};

/**
 * Compare a jsdom node and a Emmet tree.
 *
 * @private
 * @param  {jsdom} node - jsdom node
 * @param  {emmet} tree - Emmet tree
 * @param  {boolean} hasAttrs - Compare attribute names
 * @param  {boolean} isAttrs - Compare attribute values
 * @param  {boolean} isContent - Compare content
 */
var compareNode = function compareNode(node, tree, hasAttrs, isAttrs, isContent) {
    var nodeChildren = _collectionToArray(node.childNodes),
        treeChildren = tree.children,
        isText = node._localName === undefined,
        isBody = node._localName === 'body';

    /*
     * If not text, compare the node names. Skip the body top level node,
     * as the body node is equivalent to the top level of the Emmet tree.
     */
    if (!isText && !isBody) {
        var nodeName = node._localName,
            treeName = tree._name;

        if (nodeName !== treeName) {
            _assert2.default.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), 'Expected \'' + treeName + '\' but got \'' + nodeName + '\'', '!=');
        }
    }

    if (hasAttrs || isAttrs && !isBody) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = tree._attributes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var attribute = _step3.value;

                var attrName = attribute.name,
                    attrValue = attribute.value;

                if (hasAttrs) {
                    if (!node.hasAttribute(attrName)) {
                        _assert2.default.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), 'Attribute \'' + attrName + '\' does not exist', '!=');
                    }
                } else if (isAttrs) {
                    if (attrName === 'class') {
                        var classNames = attrValue.split(/\s+/).filter(Boolean);

                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = classNames[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var className = _step4.value;

                                if (!node.classList.contains(className)) {
                                    _assert2.default.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), 'Element does not contain class \'' + className + '\'', '!=');
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    } else {
                        if (node.getAttribute(attrName) !== attrValue) {
                            _assert2.default.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), 'Value of attribute \'' + attrName + '\' is not \'' + attrValue + '\'', '!=');
                        }
                    }
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        ;
    }

    /*
     * In Emmet trees, div{Text} will generate a tree with one element,
     * with a content attribute 'Text' with no children. jsdom trees
     * on the other hand, correctly represent the div as a parent and the
     * text as a child node. To compare the two trees, prepend a text node to
     * Emmet tree children. The text node must handle the counter object.
     */
    if (isContent && tree.content !== '' && tree._name !== '') {
        var value = _emmet2.default.utils.common.replaceCounter(tree.content, tree.counter, tree.maxCount);

        treeChildren.unshift({
            content: value,
            children: [],
            _name: ''
        });
    }

    /*
     * Discard text child nodes if not checking for content.
     */
    if (!isContent) {
        nodeChildren = nodeChildren.filter(function (child) {
            return child._localName !== undefined;
        });
    }

    /*
     * If the node is a text node, there's no need to compare any further down
     * the tree.
     */
    if (isContent && isText) {
        if (node.textContent.trim() === tree.content.trim()) {
            return;
        } else {
            _assert2.default.fail(node.textContent.trim(), tree.content.trim(), 'DOM element content does not match', '!=');
        }
    }

    /*
     * If there are different numbers of children, stop comparing before
     * starting a recursive loop.
     */
    if (nodeChildren.length !== treeChildren.length) {
        _assert2.default.fail(_getNodeHTML(node, true), _getTreeHTML(tree, true), 'Expected ' + treeChildren.length + ' child nodes but got ' + nodeChildren.length, '!=');
    }

    for (var i in nodeChildren) {
        compareNode(nodeChildren[i], treeChildren[i], hasAttrs, isAttrs, isContent);
    };
};

/**
 * Strictly compare DOM to Emmet abbreviation. Not very useful as it compares
 * whitespace as well.
 *
 * @function
 * @param  {string} dom - DOM string 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @throws {exception} When DOM does not strictly match the Emmet abbreviation
 * @alias module:eminent.domIs
 * @example
```js
import * as eminent from 'eminent'

let html = '<div id="header"><div class="logo">Company</div></div>'

eminent.domIs(html, 'div#header>div.logo{Company}')
```
 */
var domIs = exports.domIs = function domIs(dom, abbr) {
    var tree = _abbreviation2.default.expand(abbr, { profile: 'plain' });

    if (dom !== tree) {
        _assert2.default.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=');
    }
};

/**
 * Compare DOM to Emmet abbreviation.
 * Ignores whitespace, attributes and content.
 *
 * @function
 * @param  {string} dom - DOM string
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @throws {exception} When DOM does not loosely match the Emmet abbreviation
 * @alias module:eminent.domIsLike
 * @example
```js
import * as eminent from 'eminent'

let html = `
    <div id="header">
        <div class="logo">
            Company
        </div>
    </div>
`

eminent.domIsLike(html, 'div>div')
```
 */
var domIsLike = exports.domIsLike = function domIsLike(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, false, false, false);
};

/**
 * Compare DOM to Emmet abbreviation, including attribute names and values.
 * Ignores whitespace and content.
 *
 * @function
 * @param  {string} dom - DOM string
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @throws {exception} When DOM does not loosely match the Emmet abbreviation, including attribute names and values.
 * @alias module:eminent.domAttrsIs
 * @example
```js
import * as eminent from 'eminent'

let html = `
    <div id="header">
        <div class="logo">
            Company
        </div>
    </div>
`

eminent.domAttrsIs(html, 'div#header>div.logo')
```
 */
var domAttrsIs = exports.domAttrsIs = function domAttrsIs(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, false, true, false);
};

/**
 * Compare DOM to Emmet abbreviation, including attribute names.
 * Ignores whitespace, attribute values and content.
 *
 * @function
 * @param  {string} dom - DOM string
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @throws {exception} When DOM does not loosely match the Emmet abbreviation, including attribute names.
 * @alias module:eminent.domAttrsIsLike
 * @example
```js
import * as eminent from 'eminent'

let html = `
    <div id="header">
        <div class="logo">
            Company
        </div>
    </div>
`

eminent.domAttrsIsLike(html, 'div#id>div.class')
```
 */
var domAttrsIsLike = exports.domAttrsIsLike = function domAttrsIsLike(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, true, false, false);
};

/**
 * Compare DOM to Emmet abbreviation, including content.
 * Ignores whitespace and attributes.
 *
 * @function
 * @param  {string} dom - DOM string
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @throws {exception} When DOM does not loosely match the Emmet abbreviation, including content.
 * @alias module:eminent.domContentIs
 * @example
```js
import * as eminent from 'eminent'

let html = `
    <div id="header">
        <div class="logo">
            Company
        </div>
    </div>
`

eminent.domContentIs(html, 'div#header>div.logo{Company}')
```
 */
var domContentIs = exports.domContentIs = function domContentIs(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, false, false, true);
};
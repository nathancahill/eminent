'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.domContentIs = exports.domAttrsIsLike = exports.domAttrsIs = exports.domIsLike = exports.domIs = undefined;

var _abbreviation = require('emmet/lib/parser/abbreviation');

var _abbreviation2 = _interopRequireDefault(_abbreviation);

var _domWhitespace = require('dom-whitespace');

var _domWhitespace2 = _interopRequireDefault(_domWhitespace);

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getNodeHTML = function getNodeHTML(node, children) {
    if (!children) {
        node.innerHTML = '';
    } else {
        for (var i = 0; i < node._childNodes.length; i++) {
            node._childNodes[i].innerHTML = '';
        };
    }

    return node.outerHTML;
};

var getTreeHTML = function getTreeHTML(tree, children) {
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
 * @param  {jsdom node} node - jsdom node
 * @param  {emmet tree} tree - Emmet tree
 * @param  {boolean} hasAttrs - Compare attribute names
 * @param  {boolean} isAttrs - Compare attribute values
 * @param  {boolean} isContent - Compare content
 */
var compareNode = function compareNode(node, tree, hasAttrs, isAttrs, isContent) {
    var i = undefined,
        nodeChildren = node._childNodes,
        treeChildren = tree.children,
        isText = node._localName === undefined;

    if (hasAttrs || isAttrs) {
        for (i = 0; i < tree._attributes.length; i++) {
            var attrName = tree._attributes[i].name,
                attrValue = tree._attributes[i].value;

            if (hasAttrs) {
                if (!node.hasAttribute(attrName)) {
                    _assert2.default.fail(getNodeHTML(node, false), getTreeHTML(tree, false), 'Attribute \'' + attrName + '\' does not exist', '!=');
                }
            } else if (isAttrs) {
                if (node.getAttribute(attrName) !== attrValue) {
                    _assert2.default.fail(getNodeHTML(node, false), getTreeHTML(tree, false), 'Value of attribute \'' + attrName + '\' is not \'' + attrValue + '\'', '!=');
                }
            }
        };
    }

    /*
     * In Emmet trees, div{Text} will generate a tree with one element,
     * with a content attribute 'Text' with no children. jsdom trees
     * on the other hand, correctly represent the div as a parent and the
     * text as a child node. To compare the two trees, prepend a text node to
     * Emmet tree children.
     */
    if (isContent && tree.content !== '' && tree._name !== '') {
        treeChildren.unshift({
            content: tree.content,
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
        _assert2.default.fail(getNodeHTML(node, true), getTreeHTML(tree, true), 'Different number of DOM child nodes', '!=');
    }

    for (i = 0; i < nodeChildren.length; i++) {
        compareNode(nodeChildren[i], treeChildren[i], hasAttrs, isAttrs, isContent);
    };
};

/**
 * Strictly compare DOM to Emmet abbreviation.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
var domAttrsIsLike = exports.domAttrsIsLike = function domAttrsIsLike(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, true, false, false);
};

/**
 * Compare DOM to Emmet abbreviation, including content.
 * Ignores whitespace, attributes and content.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
var domContentIs = exports.domContentIs = function domContentIs(dom, abbr) {
    var node = _domWhitespace2.default.remove(_jsdom2.default.jsdom(dom)).body,
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' });

    compareNode(node, tree, false, false, true);
};
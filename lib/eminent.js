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

/**
 * Compare a jsdom node and a Emmet tree.
 * 
 * @param  {jsdom node} node - jsdom node
 * @param  {emmet tree} tree - Emmet tree
 * @param  {boolean} hasAttrs - Compare attribute names
 * @param  {boolean} isAttrs - Compare attribute values
 * @param  {boolean} isContent - Compare content
 * @return {boolean}
 */
var compareNode = function compareNode(node, tree, hasAttrs, isAttrs, isContent) {
    var i = undefined,
        treeChildren = tree.children,
        isText = node._localName === undefined,
        match = true;

    if (hasAttrs || isAttrs) {
        for (i = 0; i < tree._attributes.length; i++) {
            if (hasAttrs) {
                if (!node.hasAttribute(tree._attributes[i].name)) {
                    return false;
                }
            } else if (isAttrs) {
                if (node.getAttribute(tree._attributes[i].name) !== tree._attributes[i].value) {
                    return false;
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
    if (tree.content !== '' && tree._name !== '') {
        treeChildren.unshift({
            content: tree.content,
            children: [],
            _name: ''
        });
    }

    /*
     * If the node is a text node, there's no need to compare any further down
     * the tree.
     */
    if (isContent && isText) {
        return node.textContent.trim() == tree.content.trim();
    }

    /*
     * If there are different numbers of children, stop comparing before
     * starting a recursive loop.
     */
    if (node._childNodes.length !== treeChildren.length) return false;

    for (i = 0; i < node._childNodes.length; i++) {
        match = match && compareNode(node._childNodes[i], treeChildren[i], hasAttrs, isAttrs, isContent);
    };

    return match;
};

/**
 * Strictly compare DOM to Emmet abbreviation.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
var domIs = exports.domIs = function domIs(dom, abbr) {
    var tree = _abbreviation2.default.expand(abbr, { profile: 'plain' }),
        result = dom === tree;

    if (!result) {
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
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' }),
        result = compareNode(node, tree, false, false, false);

    if (!result) {
        _assert2.default.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=');
    }
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
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' }),
        result = compareNode(node, tree, false, true, false);

    if (!result) {
        _assert2.default.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=');
    }
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
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' }),
        result = compareNode(node, tree, true, false, false);

    if (!result) {
        _assert2.default.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=');
    }
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
        tree = _abbreviation2.default.parse(abbr, { profile: 'plain' }),
        result = compareNode(node, tree, false, false, true);

    if (!result) {
        _assert2.default.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=');
    }
};
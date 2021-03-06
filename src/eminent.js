
import emmet from 'emmet'
import parser from 'emmet/lib/parser/abbreviation'
import whitespace from 'dom-whitespace'
import jsdom from 'jsdom'
import assert from 'assert'

import snippets from '../assets/snippets.json'

/** @module eminent */

/*
 * Reset Emmet snippets to snippets without blank attributes
 */
emmet.resetSnippets()
emmet.loadSnippets(snippets)

/**
 *
 * @private
 * @param  {nodelist} collection - DOM collection node list
 * @return {array}
 */
let _collectionToArray = collection => {
    let ary = [];

    for (let node of collection) {
        ary.push(node);
    }

    return ary;
}

/**
 * @private
 * @param  {jsdom} node - Node to parse to HTML
 * @param  {boolean} children - Whether to include children or not
 * @return {string}
 */
let _getNodeHTML = (node, children) => {
    if (!children) {
        node.innerHTML = ''
    } else {
        for (let child of node.childNodes) {
            child.innerHTML = ''
        }
    }

    return node.outerHTML;
}

/**
 * @private
 * @param  {emmet} tree - Tree to parse to HTML
 * @param  {boolean} children - Whether to include children or not
 * @return {string}
 */
let _getTreeHTML = (tree, children) => {
    let abbr = tree.abbreviation;

    if (children) {
        let childrenAbbrs = tree.children.map(child => child.abbreviation).join('+');

        abbr = abbr + '>' + childrenAbbrs;
    }

    return parser.expand(abbr, {profile: 'plain'})
}

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
let compareNode = (node, tree, hasAttrs, isAttrs, isContent) => {
    let nodeChildren = _collectionToArray(node.childNodes),
        treeChildren = tree.children,
        isText = node._localName === undefined,
        isBody = node._localName === 'body';

    /*
     * If not text, compare the node names. Skip the body top level node,
     * as the body node is equivalent to the top level of the Emmet tree.
     */
    if (!isText && !isBody) {
        let nodeName = node._localName,
            treeName = tree._name;

        if (nodeName !== treeName) {
            assert.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), `Expected '${treeName}' but got '${nodeName}'`, '!=')
        }
    }

    if (hasAttrs || isAttrs && !isBody) {
        for (let attribute of tree._attributes) {
            let attrName = attribute.name,
                attrValue = attribute.value;

            if (hasAttrs) {
                if (!node.hasAttribute(attrName)) {
                    assert.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), `Attribute '${attrName}' does not exist`, '!=')
                }
            } else if (isAttrs) {
                if (attrName === 'class') {
                    let classNames = attrValue.split(/\s+/).filter(Boolean)

                    for (let className of classNames) {
                        if (!node.classList.contains(className)) {
                            assert.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), `Element does not contain class '${className}'`, '!=')
                        }
                    }
                } else {
                    if (node.getAttribute(attrName) !== attrValue) {
                        assert.fail(_getNodeHTML(node, false), _getTreeHTML(tree, false), `Value of attribute '${attrName}' is not '${attrValue}'`, '!=')
                    }
                }
            }
        }
    }

    /*
     * In Emmet trees, div{Text} will generate a tree with one element,
     * with a content attribute 'Text' with no children. jsdom trees
     * on the other hand, correctly represent the div as a parent and the
     * text as a child node. To compare the two trees, prepend a text node to
     * Emmet tree children. The text node must handle the counter object.
     */
    if (isContent && tree.content !== '' && tree._name !== '') {
        let value = emmet.utils.common.replaceCounter(tree.content, tree.counter, tree.maxCount)

        treeChildren.unshift({
            content: value,
            children: [],
            _name: ''
        })
    }

    /*
     * Discard text child nodes if not checking for content.
     */
    if (!isContent) {
        nodeChildren = nodeChildren.filter(child => child._localName !== undefined)
    }

    /*
     * If the node is a text node, there's no need to compare any further down
     * the tree.
     */
    if (isContent && isText) {
        if (node.textContent.trim() === tree.content.trim()) {
            return
        } else {
            assert.fail(node.textContent.trim(), tree.content.trim(), `DOM element content does not match`, '!=')
        }
    }

    /*
     * If there are different numbers of children, stop comparing before
     * starting a recursive loop.
     */
    if (nodeChildren.length !== treeChildren.length) {
        assert.fail(_getNodeHTML(node, true), _getTreeHTML(tree, true), `Expected ${treeChildren.length} child nodes but got ${nodeChildren.length}`, '!=')
    }

    for (let i in nodeChildren) {
        compareNode(nodeChildren[i], treeChildren[i], hasAttrs, isAttrs, isContent)
    }
}

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
export var domIs = (dom, abbr) => {
    let tree = parser.expand(abbr, {profile: 'plain'});

    if (dom !== tree) {
        assert.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=')
    }
}

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
export var domIsLike = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, false, false, false);
}

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
export var domAttrsIs = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, false, true, false);
}

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
export var domAttrsIsLike = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, true, false, false);
}

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
export var domContentIs = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, false, false, true);
}

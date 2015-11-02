
import parser from 'emmet/lib/parser/abbreviation'
import whitespace from 'dom-whitespace'
import jsdom from 'jsdom'
import assert from 'assert'


let getNodeHTML = (node, children) => {
    if (!children) {
        node.innerHTML = '';
    } else {
        for (var i = 0; i < node._childNodes.length; i++) {
            node._childNodes[i].innerHTML = '';
        };
    }

    return node.outerHTML;
}

let getTreeHTML = (tree, children) => {
    let abbr = tree.abbreviation;

    if (children) {
        let childrenAbbrs = tree.children.map(child => child.abbreviation).join('+');
        abbr = abbr + '>' + childrenAbbrs;
    }

    return parser.expand(abbr, {profile: 'plain'});
}

/**
 * Compare a jsdom node and a Emmet tree.
 * 
 * @param  {jsdom node} node - jsdom node
 * @param  {emmet tree} tree - Emmet tree
 * @param  {boolean} hasAttrs - Compare attribute names
 * @param  {boolean} isAttrs - Compare attribute values
 * @param  {boolean} isContent - Compare content
 */
let compareNode = (node, tree, hasAttrs, isAttrs, isContent) => {
    let i,
        nodeChildren = node._childNodes,
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
            assert.fail(getNodeHTML(node, false), getTreeHTML(tree, false), `Expected '${treeName}' but got '${nodeName}'`, '!=')
        }
    }

    if (hasAttrs || isAttrs && !isBody) {
        for (i = 0; i < tree._attributes.length; i++) {
            let attrName = tree._attributes[i].name,
                attrValue = tree._attributes[i].value;

            if (hasAttrs) {
                if (!node.hasAttribute(attrName)) {
                    assert.fail(getNodeHTML(node, false), getTreeHTML(tree, false), `Attribute '${attrName}' does not exist`, '!=')
                }
            } else if (isAttrs) {
                if (node.getAttribute(attrName) !== attrValue) {
                    assert.fail(getNodeHTML(node, false), getTreeHTML(tree, false), `Value of attribute '${attrName}' is not '${attrValue}'`, '!=')
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
        nodeChildren = nodeChildren.filter(child => child._localName !== undefined);
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
        assert.fail(getNodeHTML(node, true), getTreeHTML(tree, true), `Different number of DOM child nodes`, '!=')
    }

    for (i = 0; i < nodeChildren.length; i++) {
        compareNode(nodeChildren[i], treeChildren[i], hasAttrs, isAttrs, isContent);
    };
}

/**
 * Strictly compare DOM to Emmet abbreviation.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
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
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
export var domAttrsIsLike = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, true, false, false);
}

/**
 * Compare DOM to Emmet abbreviation, including content.
 * Ignores whitespace, attributes and content.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
export var domContentIs = (dom, abbr) => {
    let node = whitespace.remove(jsdom.jsdom(dom)).body,
        tree = parser.parse(abbr, {profile: 'plain'});

    compareNode(node, tree, false, false, true);
}

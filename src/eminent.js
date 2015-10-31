
import parser from 'emmet/lib/parser/abbreviation'
import whitespace from 'dom-whitespace'
import jsdom from 'jsdom'
import assert from 'assert'


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
let compareNode = (node, tree, hasAttrs, isAttrs, isContent) => {
    let i,
        treeChildren = tree.children,
        isText = node._localName === undefined,
        match = true;

    if (hasAttrs || isAttrs) {
        for (i = 0; i < tree._attributes.length; i++) {
            if (hasAttrs) {
                if (!node.hasAttribute(tree._attributes[i].name)) {
                    return false
                }
            } else if (isAttrs) {
                if (node.getAttribute(tree._attributes[i].name) !== tree._attributes[i].value) {
                    return false
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

    return match
}

/**
 * Strictly compare DOM to Emmet abbreviation.
 * 
 * @param  {string} dom - DOM string to 
 * @param  {string} abbr - Emmet abbreviation to compare to
 * @return {boolean}
 */
export var domIs = (dom, abbr) => {
    let tree = parser.expand(abbr, {profile: 'plain'}),
        result = dom === tree;

    if (!result) {
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
        tree = parser.parse(abbr, {profile: 'plain'}),
        result = compareNode(node, tree, false, false, false);

    if (!result) {
        assert.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=')
    }
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
        tree = parser.parse(abbr, {profile: 'plain'}),
        result = compareNode(node, tree, false, true, false);

    if (!result) {
        assert.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=')
    }
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
        tree = parser.parse(abbr, {profile: 'plain'}),
        result = compareNode(node, tree, true, false, false);

    if (!result) {
        assert.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=')
    }
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
        tree = parser.parse(abbr, {profile: 'plain'}),
        result = compareNode(node, tree, false, false, true);

    if (!result) {
        assert.fail(dom, tree, 'DOM does not match Emmet abbreviation', '=')
    }
}

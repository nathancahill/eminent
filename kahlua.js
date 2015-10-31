
import parser from 'emmet/lib/parser/abbreviation'
import jsdom from 'jsdom'

import diff from 'virtual-dom/diff'


let compareNode = (node, tree) => {
    let match = true;

    // Compare attributes/text
    //
    // if (tree.className != node.className) {
    //     return false;
    // }

    if (node.childNodes.length !== tree.children.length) return false;

    for (let i = 0; i < node.childNodes.length; i++) {
        match = match && compareNode(node.childNodes[i], tree.children[i]);
    };

    return match
}


let kahlua = {
    domIsLike: (dom, abbr) => {
        let node = jsdom.jsdom(dom).body;
        let tree = parser.parse(abbr, {profile: 'plain'});

        return compareNode(node, tree);
    }
};

export default kahlua;

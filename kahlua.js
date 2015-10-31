
import parser from 'emmet/lib/parser/abbreviation';
import tabStops from 'emmet/lib/assets/tabStops';

import h from 'virtual-dom/h'
import diff from 'virtual-dom/diff'


let kahlua = {
    domIsLike: (dom, abbr) => {
        return parser.expand(abbr, {profile: 'plain'})
    },
    domIsEqual: (dom, abbr) => {
        let a = h(dom);
        let b = h(parser.expand(abbr, {profile: 'plain'}));

        return dom === parser.expand(abbr, {profile: 'plain'})
    }
};

export default kahlua;

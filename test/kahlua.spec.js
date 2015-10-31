
import assert from 'assert'
import kahlua from '../kahlua';


describe('domIsLike', () => {
    it('returns true when dom is like emmet', () => {
        let dom = '<table><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>';

        assert(kahlua.domIsLike(dom, 'table>tbody>tr*2>td*3'))
    });

    it('returns false when dom is not like emmet', () => {
        let dom = '<table><tbody><tr><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>';

        assert(!kahlua.domIsLike(dom, 'table>tbody>tr*2>td*3'))
    });
});

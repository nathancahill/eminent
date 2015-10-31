
import assert from 'assert'
import kahlua from '../kahlua';


describe('domIsEqual', () => {
    it('returns true when', () => {
        let dom = '<table><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>';

        assert(kahlua.domIsEqual(dom, 'table>tbody>tr*2>td*3'))
    });
});

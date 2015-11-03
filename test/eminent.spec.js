
import assert from 'assert'
import * as eminent from '../src/eminent';


describe('domIs', () => {
    it('passes when dom is the same as abbreviation', () => {
        let dom = '<table><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table>';

        eminent.domIs(dom, 'table>tbody>tr*2>td*3')
    });

    it('throws when dom is not the same as abbreviation', () => {
        let dom = `
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
        `

        assert.throws(() => {
            eminent.domIs(dom, 'table>tbody>tr*2>td*3')
        }, /DOM does not match Emmet abbreviation/)
    });
});

describe('domIsLike', () => {
    it('passes when dom is like abbreviation', () => {
        let dom = `
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
        `

        eminent.domIsLike(dom, 'table>tbody>tr*2>td*3')
    });

    it('throws when dom is not like abbreviation', () => {
        let dom = `
            <table>
              <tbody>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
        `

        assert.throws(() => {
            eminent.domIsLike(dom, 'table>tbody>tr*2>td*3')
        }, /Expected 2 child nodes but got 1/)
    });

    it('passes when dom has content but abbreviation does not', () => {
        let dom = `
            <div>Hello</div>
        `

        eminent.domIsLike(dom, 'div')
    });

    it('throws when dom nodes are different', () => {
        let dom = `
            <div>
                <span></span>
            </div>
        `

        assert.throws(() => {
            eminent.domIsLike(dom, 'span>div')
        }, /Expected 'span' but got 'div'/)
    });

    it('throws with a different number of child nodes', () => {
        let dom = `
            <select>
                <option>2005</option>
                <option>2006</option>
                <option>2007</option>
            </select>
        `

        assert.throws(() => {
            eminent.domIsLike(dom, 'select>option*4');
        }, /Expected 4 child nodes but got 3/)
    });
});

describe('domAttrsIs', () => {
    it('passes when attribute values match', () => {
        let dom = `
            <div id="page">
              <div class="logo"></div>
            </div>
        `

        eminent.domAttrsIs(dom, 'div#page>div.logo')
    });

    it('throws when attribute values do not match', () => {
        let dom = `
            <div id="logo">
                <div class="page"></div>
            </div>
        `

        assert.throws(() => {
            eminent.domAttrsIs(dom, 'div#page>div.logo')
        }, /Value of attribute 'id' is not 'page'/)
    });

    it('passes when class attributes match', () => {
        let dom = `
            <div class="logo  page"></div>
        `

        eminent.domAttrsIs(dom, 'div.page.logo')
    });

    it('throws when class attributes do not match', () => {
        let dom = `
            <div class="logo  page"></div>
        `

        assert.throws(() => {
            eminent.domAttrsIs(dom, 'div.page.footer')
        }, /Element does not contain class 'footer'/)
    });
});

describe('domAttrsIsLike', () => {
    it('passes when attributes exist', () => {
        let dom = `
            <div id="header">
                <div class="link"></div>
            </div>
        `

        eminent.domAttrsIsLike(dom, 'div#page>div.logo')
    });

    it('throws when attributes do not exist', () => {
        let dom = `
            <div>
                <div></div>
            </div>
        `

        assert.throws(() => {
            eminent.domAttrsIsLike(dom, 'div#page>div.logo')
        }, /Attribute 'id' does not exist/)
    });

    it('does not include default attributes', () => {
        let dom = `
            <img />
        `

        eminent.domAttrsIsLike(dom, 'img')
    });
});

describe('domContentIs', () => {
    it('passes when content matches', () => {
        let dom = `
            <div>
                Hello world
                <div>Testing</div>
            </div>
        `

        eminent.domContentIs(dom, 'div{Hello world}>div{Testing}')
    });

    it('throws when content does not match', () => {
        let dom = `
            <div>
                Testing
                <div>Hello world</div>
            </div>
        `

        assert.throws(() => {
            eminent.domContentIs(dom, 'div{Hello world}>div{Testing}')
        }, /DOM element content does not match/)
    });

    it('passes with two elements with content', () => {
        let dom = `
            <div>Hello</div>
            <div>World</div>
        `

        eminent.domContentIs(dom, 'div{Hello}+div{World}')
    });

    it('passes with disjoint content in element', () => {
        let dom = `
            <div>
                Hello
                <div></div>
                World
            </div>
        `

        eminent.domContentIs(dom, 'div{Hello}>div+{World}');
    });

    it('passes with single text content in element', () => {
        let dom = `
            <div>Hello</div>
        `

        eminent.domContentIs(dom, 'div{Hello}');
    });

    it('handles repeating content', () => {
        let dom = `
            <div>
                <span>1</span>
                <span>2</span>
                <span>3</span>
            </div>
        `

        eminent.domContentIs(dom, 'div>span{$}*3')
    });

    it('handles repeating content with children', () => {
        let dom = `
            <div>
                <span>1<span>Hello</span></span>
                <span>2<span>Hello</span></span>
                <span>3<span>Hello</span></span>
            </div>
        `

        eminent.domContentIs(dom, 'div>span{$}*3>span{Hello}')
    });
});

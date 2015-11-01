
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
        })
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
        })
    });

    it('passes when dom has content but abbreviation does not', () => {
        let dom = `
            <div>Hello</div>
        `

        eminent.domIsLike(dom, 'div')
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
        })
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
            <div><div>
            </div></div>
        `

        assert.throws(() => {
            eminent.domAttrsIsLike(dom, 'div#page>div.logo')
        })
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
        })
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
});

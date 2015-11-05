## Eminent

[![Build Status](https://travis-ci.org/nathancahill/eminent.svg?branch=master)](https://travis-ci.org/nathancahill/eminent)
[![Coverage Status](https://coveralls.io/repos/nathancahill/eminent/badge.svg?branch=master&service=github)](https://coveralls.io/github/nathancahill/eminent?branch=master)

Eminent is a DOM assertions library with [Emmet syntax](http://docs.emmet.io/abbreviations/syntax/) for JavaScript testing.

```js
describe('eminent', () => {
	it('uses easy to read abbreviations to verify DOM', () => {
		eminent.domIsLike(html, 'select>option*3')
	})

	it('intelligently compares attributes and content', () => {
		eminent.domAttrsIsLike(html, 'div.header.logo')
	})
})
```

![Screenshot](http://i.imgur.com/usTPpPa.png)


## Installation

```
$ npm install eminent
```

## API Reference

<a name="module_eminent.domIs"></a>
### eminent.domIs(dom, abbr)
Strictly compare DOM to Emmet abbreviation.

**Kind**: static method of <code>[eminent](#module_eminent)</code>  
**Throws**:

- <code>exception</code> When DOM does not strictly match the Emmet abbreviation


| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | DOM string |
| abbr | <code>string</code> | Emmet abbreviation to compare to |

**Example**  
```js
import * as eminent from 'eminent'

let html = '<div id="header"><div class="logo">Company</div></div>'

eminent.domIs(html, 'div#header>div.logo{Company}')
```
<a name="module_eminent.domIsLike"></a>
### eminent.domIsLike(dom, abbr)
Compare DOM to Emmet abbreviation.
Ignores whitespace, attributes and content.

**Kind**: static method of <code>[eminent](#module_eminent)</code>  
**Throws**:

- <code>exception</code> When DOM does not loosely match the Emmet abbreviation


| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | DOM string |
| abbr | <code>string</code> | Emmet abbreviation to compare to |

**Example**  
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
<a name="module_eminent.domAttrsIs"></a>
### eminent.domAttrsIs(dom, abbr)
Compare DOM to Emmet abbreviation, including attribute names and values.
Ignores whitespace and content.

**Kind**: static method of <code>[eminent](#module_eminent)</code>  
**Throws**:

- <code>exception</code> When DOM does not loosely match the Emmet abbreviation, including attribute names and values.


| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | DOM string |
| abbr | <code>string</code> | Emmet abbreviation to compare to |

**Example**  
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
<a name="module_eminent.domAttrsIsLike"></a>
### eminent.domAttrsIsLike(dom, abbr)
Compare DOM to Emmet abbreviation, including attribute names.
Ignores whitespace, attribute values and content.

**Kind**: static method of <code>[eminent](#module_eminent)</code>  
**Throws**:

- <code>exception</code> When DOM does not loosely match the Emmet abbreviation, including attribute names.


| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | DOM string |
| abbr | <code>string</code> | Emmet abbreviation to compare to |

**Example**  
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
<a name="module_eminent.domContentIs"></a>
### eminent.domContentIs(dom, abbr)
Compare DOM to Emmet abbreviation, including content.
Ignores whitespace and attributes.

**Kind**: static method of <code>[eminent](#module_eminent)</code>  
**Throws**:

- <code>exception</code> When DOM does not loosely match the Emmet abbreviation, including content.


| Param | Type | Description |
| --- | --- | --- |
| dom | <code>string</code> | DOM string |
| abbr | <code>string</code> | Emmet abbreviation to compare to |

**Example**  
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

## Eminent

DOM assertions with [Emmet syntax](http://docs.emmet.io/abbreviations/) for JavaScript testing.

```javascript
let html = `
  <table>
    <tbody>
      <tr>
        <td>Kahlua</td>
        <td>is</td>
        <td>awesome</td>
      </tr>
    </tbody>
  </table>
`

eminent.domIsLike(html, 'table>tbody>tr>td*3')
```

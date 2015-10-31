## Kahlua

DOM structure assertions for JavaScript testing.

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

kahlua.domIsLike(html, 'table>tbody>tr>td*3')
```

# Validators

A validator is a JavaScript function that accepts parsed Markdown content
and throws if there's any kind of perceived problem.

## Usage

```bash
[gg ...] -v VALIDATOR [PARAM:VALUE [...]] [...]
```

## Definition

```javascript
// .gg/validators/${validator}.js

module.exports = (match, params, config) => { /* ... */ }
```

## Example

Here's an example validator that complains if the value at keypath `"foo"` is less than 20
(which is ridiculous of course).

```javascript
module.exports = (match, params, config) => {
  for (const match of matches) {
    const n = parseInt(match.get('foo', 0), 10)
    if (isNaN(n) || n < 20) {
      throw new Error(`invalid foo in ${match.id}: must be at least 20`)
    }
  }
}
```

There are no default validators.

Multiple validators are supported and are invoked in the same order specified.


# Actions

An action is a JavaScript function exported from a Node.js module that can do whatever it wants
with Markdown files from the gg database that matched the query specified with the gg CLI.

## Usage

`gg [...] -a ACTION PARAM[:VALUE] [PARAM[:VALUE] [...]]`

## How action implementations are found

Actions can be "local" (`.gg/actions`), "global" (`$HOME/.gg/actions`), or
built-in (package with gg installation).  That is, if an action implementation
is not found in the nearest gg database (local), gg will attempt to find it in
the gg database in `$HOME/.gg` (global) and then in its own Node.js package
(built-in).

## Definition

```javascript
// .gg/actions/${action}.js

module.exports = (matches, params, config) => {}
```

### matches

An array of the parsed Markdown files that matched the queries provided on the commandline.

### params

An object whose keys are the `PARAM` from the commandline and whose corresponding value
is the corresponding `VALUE`.

`VALUE` is optional; it defaults to `true` meaning `-a SOMEACTION foo` treats `foo` as if it
were a flag.

The parameter `VALUE`s are parsed using the same inferred typing as described above.

If multiple identical `PARAM` names are specified for the same action, their
values are grouped into an array.  E.g. `-a A:1 B:2 A:3` would result in a
`params` parameter of `{ A: [1, 3], B: 2 }`.

### config

This is the merged (or not if `--no-global-config`) configuration as per above.

## Example: increment values at one or more keypaths

Let's say there's one file in the gg database:

```markdown
# description
Hello, world!

# priority
5

# likes
42
```

Run the action:

```sh
gg -a incr priority 3 likes 1
```

The contents of the file after running the action:

```markdown
# description
Hello, world!

# priority
8

# likes
43
```

The definition of the action is a Node.js module.
Let's say this one is local so its in `.gg/actions/incr.js`:

```javascript
// params = { priority: 3, likes: 1 }

module.exports = (matches, params, config) => {
  for (const match of matches) {
    for (const [k, v] of Object.entries(params)) {
      const currentValue = parseFloat(match.get(k, 0))
      const addend = v === undefined ? 1.0 : parseFloat(v)
      if (!isNaN(curr) && !isNaN(addend)) {
        match.set(k, currentValue + addend)
      }
    }
  }
}
```

Let's say `.gg/config.md` contained:

```markdown
# aaa
bbb

# ccc
ddd
```

Let's say `$HOME/.gg/config.md` contained:

```markdown
# aaa
zzz

# xxx
42
```

Then the `config` parameter will be:

```javascript
{
  aaa: "bbb",
  ccc: "ddd",
  xxx: 42
}
```

If `--no-global-config` is specified, then the `config` parameter will be:

```javascript
{
  aaa: "bbb",
  ccc: "ddd"
}
```

# Match object

A match object (e.g. an element of `matches` array) contains parsed Markdown
content along with methods for manipulating values at keypaths or the keypaths
themselves.

Methods

- `match.set(keypath, value)`
- `match.get(keypath, default)`
- `match.has(keypath)`
- `match.del(keypath)`

For instance, given the following Markdown file, here are some calls and what they would return:

```markdown
# id
yvVLzgWZP

## foo
42

## bar
- A
- 100
- C
```

call                     | return value
-------------------------|-----------------
`match.get('foo')`       | `42`
`match.get('bar')`       | `[ "A", 100, "B" ]`
`match.get('bar > [1]')` | `100`
`match.get('baz', 999)`  | `999`
`match.has('bar > [2]')` | `false`
`match.has('foo')`       | `true`


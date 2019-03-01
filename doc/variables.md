# Variables

A *variable* is a placeholder for a value determined by user-defined code.

When a Markdown value is a variable, gg will invoke the variable expander code
based on the variable name and will use the returned value instead.

## Usage

Variables take the form:

    ${identifier}

## Built-in Variables

gg has a number of built-in variables for dates:

$variable     |  Value
--------------|---------------------------------------------------
`${now}`      | Current date and time in whatever timezone is current.
`${mon}`      | The next occurrence of a Monday after the current day, at the current time.
`${tue}`      | The next occurrence of a Tuesday after the current day, at the current time.
`${wed}`      | The next occurrence of a Wednesday after the current day, at the current time.
`${thu}`      | The next occurrence of a Thursday after the current day, at the current time.
`${fri}`      | The next occurrence of a Friday after the current day, at the current time.
`${sat}`      | The next occurrence of a Saturday after the current day, at the current time.
`${sun}`      | The next occurrence of a Sunday after the current day, at the current time.

## Definition

A variable implementation is a Node.js module that exports a single function that
returns a value.  The function can be async.

Here's how `${now}` could be implemented (if it were not built-in):

```javascript
// .gg/vars/now.js

module.exports = config => require('moment')().format()
```

## Example

```sh
gg add -

# greet
hello, world!

# created
${now}

^D
```

```sh
gg --eq greet 'hello, world'

# id
1

# greet
hello, world!

# created
2019-02-17T09:53:51-05:00
```


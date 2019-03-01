# Queries

A query is specified with the CLI in the form of one or more *tests*.

A Markdown file is said to be a *match* if it passes *all* specified tests.

## Usage

```sh
gg --OPERATOR KEYPATH OPERAND [...]
```

test operator | how the value at `KEYPATH` *passes*
--------------|-------------------------------------------------------------
`--eq`        | value at `KEYPATH` is equal to `OPERAND`
`--ne`        | value at `KEYPATH` is not equal to `OPERAND`
`--gt`        | value at `KEYPATH` is greater than `OPERAND`
`--gte`       | value at `KEYPATH` is greater than or equal to `OPERAND`
`--lt`        | value at `KEYPATH` is less than `OPERAND`
`--lte`       | value at `KEYPATH` is less than or equal to `OPERAND`
`--in`        | value at `KEYPATH` is one of list of values in `OPERAND`
`--nin`       | value at `KEYPATH` is not any of list of values in `OPERAND`
`--ex`        | value at `KEYPATH` exists at label/label-path `OPERAND`
`--nex`       | value at `KEYPATH` does not exist at label/label-path `OPERAND`
`--re`        | value at `KEYPATH` matches regular expression `OPERAND`
`--nre`       | value at `KEYPATH` does not match regular expression `OPERAND`

### Relational operators

`gt`, `gte`, `lt`, `lte` work on numbers, text, and dates.

E.g. for a stored value in a file that is a date and `OPERAND` that is a date,
`gt` means *passes if the stored value is later than or after OPERAND*.

### Specifying multiple values

`in` and `nin` expect a list for `VALUE`.

A list can be *comma separated values*:
e.g. `gg --in xyz 42,44,45`;
e.g. `gg --in foo bar,baz`.

A list can be an *inclusive range*:
e.g. `gg --in xyz 42-44` (numeric range);
e.g. `gg --in xyz 2018/09/01-2018/12/31` (date range).

...or a mix of comma-separated values and numeric ranges:
e.g. `gg --in xyz 42-44,45,50-61,99`.

### ID shortcut

There's a shortcut for `--eq id NUMBER` and that's `gg NUMBER`.
e.g. `gg --eq id 999` is the same as `gg 999`.

Since ids are numeric, the LIST options (CSV, range) apply to the id shortcut.
e.g. `gg NUMBER,NUMBER,...` (list)
e.g. `gg NUMBER-NUMBER` (inclusive numeric range),
e.g. `gg NUMBER-NUMBER,NUMBER,NUMBER,...` (mix)


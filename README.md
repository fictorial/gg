# gg

gg is a CLI to import, query, act on, and report on local Markdown files with
support for user-defined JavaScript extensions.

gg is *generic* and can become whatever you want it to become: a task manager,
a journal, storage for notes about anything, code snippet manager, bookmark
manager, recipe manager, grocery list manager, and so on.

Why Markdown?  It's human readable, easy to learn, and is not some custom binary database format.

gg isn't postgres/sqlite -- it's a handy tool that you might find useful. Enjoy!

## Quickstart

```sh
$ npm i -g @fictorial/gg
```

```sh
$ cd /some/where
$ gg init
```

```sh
$ gg add -
# Description
Do the dishes.

# Tags
- chores
- ugh

# Priority
3

^D
```

```sh
$ gg --any Tags ugh -r picker Description
# Description
Do the dishes

$ gg --gt Priority 1 -r picker Description Priority
# Description
Do the dishes
# Priority
3
```

## Docs

- [create database](doc/init-db.md)
- [import data](doc/import-data.md)
- [keypaths](doc/keypaths.md)
- [type inference](doc/value-types.md)
- [queries](doc/queries.md)
- [configuration](doc/config.md)
- [actions](doc/actions.md)
- [variable expanders](doc/variables.md)
- [validators](doc/validators.md)

## Markdown

gg supports a subset of Markdown for parsing: headers and un-nested bullet
lists.  That's all that's really needed for queries, actions, variable
expanders, and validators.  If you wish to use more Markdown features for say
generating HTML from the matches to a query, or results of an action, by all
means go right ahead.  But for gg, Markdown is used as human-readable storage
format which is kind of handy (c.f. JSON, YAML, TOML).


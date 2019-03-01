# Databases

```sh
gg init
```

This creates a `.gg` directory in the current directory.

## Multiple databases

You can have multiple gg databases; e.g. one per logical project.

## Which database is used when?

gg will look in the current directory and then in parent directories to
find the closest gg database to use.

Actions, reporters, validations, and variable expanders can be located in a local
gg database (say for project-specific actions, etc.) or "globally" in `$HOME/.gg`
for trans-project actions, etc.

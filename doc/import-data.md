# Importing Data

## From a file

```bash
gg add FILE
```

## From STDIN

```bash
gg add -
```

## Using your favorite text editor

```bash
gg add
```

This launches your `$EDITOR` – the contents of the temporary file are imported after you quit.

Note: this is typically set in your `$HOME/.bashrc`:

```bash
# emacs, vim, nano, pico, vscode, etc

export EDITOR="vim"
```

## OS X Tips

Dragging a file from the Finder into your terminal and the path to the file will be pasted.

Paste Markdown content from the system "pasteboard" into gg via

```sh
pbpaste | gg add -
```

## File Identifiers

Each file has its own unique identifier found at as the data of header `# id`.

You can set this yourself if you want and gg will honor it but it's not recommended.

Note that identifiers are just integers starting from `1`.
The next number to use is stored per database in a file at `.gg/next-id`.

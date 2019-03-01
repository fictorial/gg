# Optional Configuration

gg has no required configuration.

However, you can add your own local and/or global configuration
that is parsed and passed to your user-defined JavaScript.

    .gg/config.md

is merged atop:

    $HOME/.gg/config.md

and passed to all user-defined Javascript.

Note: the `--no-global-config` CLI option disables such merging with any
configuration found in `$HOME/.gg/config.md`, using just that of `.gg/config.md`.


# Tuture

[![Build Status](https://travis-ci.com/tutureproject/cli.svg?branch=master)](https://travis-ci.com/tutureproject/cli)
[![Build status](https://ci.appveyor.com/api/projects/status/j1l7dkyhhyxfjdyr?svg=true)](https://ci.appveyor.com/project/mRcfps/tuture)

Command-line tool (CLI) for Tuture project.

## Commands

### Base command

```
Command-line tool for Tuture.

VERSION
  tuture-cli/0.4.4 darwin-x64 node-v8.11.2

USAGE
  $ tuture [COMMAND]

COMMANDS
  destroy  Delete all tuture files
  help     display help for tuture
  init     Initialize a tuture tutorial
  reload   Sync tuture files with current repo
  up       Render and edit tutorial in browser
```

### `tuture init`

```
Initialize a tuture tutorial

USAGE
  $ tuture init

OPTIONS
  -h, --help  show CLI help
  -y, --yes   do not ask for prompts
```

### `tuture up`

```
Render and edit tutorial in browser

USAGE
  $ tuture up
```

### `tuture reload`

```
Sync tuture files with current repo

USAGE
  $ tuture reload
```

### `tuture destroy`

Delete all tuture files

```
USAGE
  $ tuture destroy

OPTIONS
  -f, --force  destroy without confirmation
  -h, --help   show CLI help
```

## License

[MIT](LICENSE).

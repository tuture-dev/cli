# Changelog

## 0.2.1

### New Features

You can now run `init` command outside a Git repo or in a repository with no commit.

### Breaking Changes

`collapse` field within **tuture.yml** is not supported.

### Improvements

Tuture will now rely on **diff.json** and **tuture.json** for internal usage, which brings following benefits:

- Much faster `init` speed
- Better HMR (Hot Module Reloading) for tuture-renderer

### Bug Fixes

- Fix a bug when you run `tuture destroy` and answer no, the operation is not cancelled

## 0.2.0

### New Features

- Windows platform is now officially supported
- Add `tuture reload` for incrementally writing your tutorial
- Add `version` field in tuture.yml (will be prompted after running `tuture init`)

### Improvements

- `tuture init` is now nearly 10x faster, thanks to the detachment of [tuture-renderer](https://github.com/tutureproject/renderer)
- Much more user-friendly prompts (when running `init` or `destroy`)

### Bug Fixes

- Fix bug of ignoring commits with messages starting with `tuture: `

## 0.1.0

### New Features

- Add `tuture init` for initialization, supporting `-y, --yes` option
- Add `tuture up` to fire up the tutorial in browser
- Add `tuture destroy`, supporting `-f, --force` option

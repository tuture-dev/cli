# Tuture

[![Build Status](https://travis-ci.com/tutureproject/tuture.svg?branch=master)](https://travis-ci.com/tutureproject/tuture)
[![Build status](https://ci.appveyor.com/api/projects/status/j1l7dkyhhyxfjdyr?svg=true)](https://ci.appveyor.com/project/mRcfps/tuture)

Tuture is a tool for writing high-quality tutorials with both ease and speed based on Git repositories.

*Read this in other languages*: [简体中文](README.zh-CN.md).

## Installation

Make sure you have [Node.js](https://nodejs.org/) (>= 8.0.0) and [npm](https://www.npmjs.com/) (>= 5.0.0) on your machine.

- **install with npm**

```bash
$ npm i -g tuture
```

- **install from source**

Clone this repo to your machine, and run following command:

```bash
$ npm i -g
```

## Documentation

- [CLI Commands](docs/CLI_COMMANDS.md) is a detailed manual on using Tuture CLI.

- [tuture.yml Specification](docs/TUTURE_YML_SPEC.md) is a complete specification of **tuture.yml**.

## How to write a Tuture tutorial

Writing a Tuture tutorial is incredibly simple and delightful.

1. Initialize a Git repo (or start from an existing one)

2. Write some code and commit with a meaningful message

3. Run `tuture init` to initialize a Tuture tutorial

4. Write some instructions in related `explain` fields in **tuture.yml**

5. Run `tuture up` to see your tutorial live in the browser

6. Edit **tuture.yml** and save to change something

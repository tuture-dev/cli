# Tuture

[![Build Status](https://travis-ci.com/tutureproject/tuture.svg?branch=master)](https://travis-ci.com/tutureproject/tuture)
[![Build status](https://ci.appveyor.com/api/projects/status/j1l7dkyhhyxfjdyr?svg=true)](https://ci.appveyor.com/project/mRcfps/tuture)

Tuture is a tool for writing high-quality tutorials with both ease and speed based on Git repositories.

*Read this in other languages*: [简体中文](README.zh-CN.md).

## Features

Tuture revolutionizes the way of writing tech tutorials.

- **Generated directly from a live codebase**: Your tutorial will be a faithful mirror of your code. Just start from a Git repo, build something interesting with nicely-written commit messages, and Tuture will bring all the good things to your tutorial. Your codebase will grow as more inspiration come in, so will your tutorial.

- **Automatic extraction of code diff**: One of the greatest pain point of writing tutorials is the daunting manual work of collecting code snippets of each changed file for each step. Fortunately, Tuture will handle this boring and error-prone work for you, so you can just focus on writing amazing tuturials.

- **Writing in a programming way**: Writing is more of a casual and personal course in these good old days. But with Tuture, you can write tutorial in a way that greatly resembles programming. Your whole tutorial is exactly specified in a YAML file, so all you need is to fill in needed fields.

- **Eye-catching rendering in the browser**: Thanks to the blazingly fast development of JavaScript technologis, [tuture-renderer](https://github.com/tutureproject/renderer) is fully capable of rendering your tutorial in a beautiful and interactive way.

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

## License

Definitely [MIT](LICENSE).

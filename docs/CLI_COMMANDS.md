# CLI Commands

## `tuture init`

Initialize a Tuture tutorial.

Tuture will prompt you to answer following questions (if `-y` or `--yes` option is not given):

| Prompt             | Fields     | Required/Optional | Default            | Meaning                                                      |
| ------------------ | ---------- | ----------------- | ------------------ | ------------------------------------------------------------ |
| Tutorial Name?     | `name`     | Required          | My Awesome Project | Title of this tutorial                                       |
| Tutorial Language? | `language` | Required          | English            | Language of this tutorial                                    |
| Topics?            | `topics`   | Optional          | -                  | Topics of this tutorial, separated with spaces or commas, such as `express,mongodb` |
| Maintainer email?  | `email`    | Optional          | -                  | Maintainer email of this tutorial                            |

Afterwards following files will be generated:

- **tuture.yml**. This file is everthing you need to write your tutorial, and for detailed information please refer to [tuture.yml Specification](TUTURE_YML_SPEC.md).

- **.tuture** directory. This houses diff data of each commit used by Tuture.

```
.tuture
└── diff
    ├── 084a277.diff
    ├── e4a9539.diff
    ├── f898719.diff
    └── fefe569.diff
```

Meanwhile, following rules will be appended to your `.gitignore` (Tuture will create one if not exists):

```
# Tuture supporting files

.tuture
```

### Preconditions

Current working directory should be a Git repo with at least one commit.

### Options

#### `-y`, `--yes`

Do not ask for prompts and fill in default values.

#### `-h`, `--help`

Output usage information.

## `tuture up`

Render your tutorial in the browser.

This command will invoke `tuture-renderer` under the hood, which should have been installed before `tuture`. If `tuture-renderer` is not available on your machine somehow, you can manually install it with **npm**:

```bash
$ npm i -g tuture-renderer
```

### Preconditions

Current working directory should already be initialized with `tuture init`.

### Options

#### `-h`, `--help`

Output usage information.

## `tuture destroy`

Delete all tuture files.

Tuture will prompt you for confirmation. Type in truthy values (`y`, `yes` and `1`) will delete **.tuture** directory and **tuture.yml**. Type in falsy values (`n`, `no`, and `0`) or simply pressing Enter will cancel this command.

### Preconditions

Current working directory should already be initialized with `tuture init`.

### Options

#### `-f`, `--force`

Destroy without confirmation.

#### `-h`, `--help`

Output usage information.

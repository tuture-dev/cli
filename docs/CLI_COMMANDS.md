# CLI Commands

Following commands assume that you are working on a Git repo. If you does not have Git on your machine, please download it from [here](https://git-scm.com/downloads).

## `tuture init`

Initialize a Tuture tutorial.

Tuture will prompt you to answer following questions (if `-y` or `--yes` option is not given):

| Prompt             | Fields     | Required/Optional | Default            | Meaning                                                      |
| ------------------ | ---------- | ----------------- | ------------------ | ------------------------------------------------------------ |
| Tutorial Name?     | `name`     | Required          | My Awesome Tutorial | Title of this tutorial                                       |
| Version | `version` | Required          | 0.0.1            | Version of this tutorial        |
| Tutorial Language? | `language` | Required  | en           | Language of this tutorial |
| Topics? | `topics` | Optional  | javascript,  git, cli | Topics of this tutorial, separated with spaces or commas, such as `express, mongodb` |
| Maintainer email? | `email` | Optional | me@example.com | Maintainer email of this tutorial |

Afterwards Tuture will do three things for you:

1. Create **tuture.yml** which is everything you need to write your tutorial (refer to [tuture.yml Specification](TUTURE_YML_SPEC.md) for detailed information), and **.tuture** directory which houses diff data of each commit.

2. Append following rule to your `.gitignore` (Tuture will create one if not exists):

```
# Tuture supporting files

.tuture
```

3. Add Git post-commit hook for calling `tuture reload` after each commit (create one if not exists).

### Preconditions

Current working directory should be a Git repo with at least one commit.

### Options

#### `-y`, `--yes`

Do not ask for prompts and fill in default values.

#### `-h`, `--help`

Output usage information.

## `tuture reload`

Update Tuture files to the latest repo.

Tuture will do following two things by extracting latest changes from Git logs:

- Add diff file of new commits
- Append new steps to **tuture.yml**

Note that this command will be automatically invoked after each commit. You can also run this command manually.

### Preconditions

Current working directory should already be initialized with `tuture init`.

### Options

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

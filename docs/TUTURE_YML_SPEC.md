# tuture.yml Specification

**tuture.yml** contains metadata and everything needed to build your Tuture tutorial. Note that each field below can and should be written in the language claimed in the `language` field.

A full example:

```yaml
name: Name of this tutorial
language: en-US
version: 0.0.1
topics:
  - Topic A
  - Topic B
description: This is my first tutorial, come and read it!
maintainer: maintainer@example.com
steps:
  - name: Message of commit ae05546
    commit: ae05546
    explain: Explain what will be done in this step
    diff:
      - file: Changed file A
        intro: Introduction before doing something to A
        explain: Explain why this change happens
        collapse: true
      - file: Changed file B
        intro: Introduction before doing something to B
        explain: Explain why this change happens
  - name: Message of commit ae05546
    commit: a45bec1
    explain: Explain what will be done in this step
    diff:
      - file: Changed file A
        intro: Introduction before doing something to A
        explain: Explain why this change happens
      - file: Changed file B
        intro: Introduction before doing something to B
        explain: Explain why this change happens
      - file: Changed file C
        intro: Introduction before doing something to C
        explain: Explain why this change happens
```

---

## `name`

**[Required]** Name of your tutorial.

This will be displayed as the title of your tutorial in [tuture-renderer](https://github.com/tutureproject/renderer). By default it's *My Awesome Tutorial*.

**Advices**

- Try to be informative and attractive, such as *Build Your Own NoSQL Database with Python*
- Don't use general descriptions (or something like a book title), for instance *Learning JavaScript*.

## `language`

**[Required]** Language of your tutorial.

Tuture fully appreciates the importance of internationlization (aka i18n), so tutorials will be divided into different groups by languages.

**Notes**

- This field is about **natural languages** that your tutorial is written in, not **programming languages** you've utilized in your tutorial.

## `version`

**[Required]** Version of your tutorial.

## `topics`

Topics covered in this tutorial.

Programming languages, libraries, frameworks, tools, software engineering and everything in between can serve as a valid topic.

## `description`

Short description of your tutorial.

This helps people quickly discover your tutorial and get interested in it.

## `email`

Maintainer email.

## `steps`

**[Required]** Steps for readers to follow.

**Notes**

- This field should contain at least one step
- Each step corresponds with one commit in your Git repo strictly

**Advices**

- For each step, stick to the renowned and respected UNIX philosiphy - **Do One Thing and Do It Well**
- Adjust the order of diff files for better illustration

**Tips**

- For commits not intended to be tracked by Tuture, just start commit message with `tuture:`

Here is the specification of a single step.

### `name`

Name of this step. This will be automatically filled with corresponding commit message. You can rewrite this as you see fit.

### `commit`

Corresponding commit ID. Please **do not** manually edit this field.

### `explain`

Explanation for this step. Generally you can explain what will be done in this single step.

### `diff`

Added or changed files in this step.

**Notes**

- Changes to **tuture.yml** will not be tracked by default.

Each diff file has four fields:

#### `file`

Path to this changed file (from the tutorial root). Tuture will extract this information for you from Git logs.

#### `intro`

Introduction displayed before code change.

#### `explain`

This is similar to `explain` of a step. You should explain why this file is added or changed. Explanation will be displayed after code change.

#### `collapse`

Whether this file should be collapsed by default. Tuture will set `collapse: true` by default for following filename patterns:

- package-lock.json
- yarn.lock
- .gitignore

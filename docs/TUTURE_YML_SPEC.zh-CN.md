# tuture.yml 详细说明

**tuture.yml** 包含了元数据以及用于实现 Tuture 教程的一切信息。请注意，以下所有字段都可以并且应该用 `language` 字段中声明的语言书写。

一个完整的例子：

```yaml
name: 教程名称
language: zh-CN
version: 0.0.1
topics:
  - JavaScript
  - Express
description: 这是我写的第一篇教程，快来看看吧
maintainer: maintainer@example.com
steps:
  - name: ae05546 的提交信息
    commit: ae05546
    explain: 讲解第一步做了什么
    diff:
      - file: 发生变化的文件 A
        explain: 讲解为什么要增加或修改这个文件
        collapse: true
      - file: 发生变化的文件 B
        explain: 讲解为什么要增加或修改这个文件
  - name: ae05546 的提交信息
    commit: a45bec1
    explain: 讲解第二步做了什么
    diff:
      - file: 发生变化的文件 A
        explain: 讲解为什么要增加或修改这个文件
      - file: 发生变化的文件 B
        explain: 讲解为什么要增加或修改这个文件
      - file: 发生变化的文件 C
        explain: 讲解为什么要增加或修改这个文件
```

---

## `name`

**[必填]** 教程的名称。

所填的名称将作为 [tuture-renderer](https://github.com/tutureproject/renderer) 渲染出来的教程的标题。默认为 My Awesome Tutorial。

起名字时应当能充分概括教程的内容，并且具有一定的吸引力，例如《用 Python 实现一个自己的 NoSQL 数据库》，并且不要用空泛的词汇去描述（或者起一个本应是书名的标题），例如《学习 JavaScript》。

## `language`

教程的语言。

注意这里所说的教程是指写教程用的**自然语言**，而不是**编程语言**。Tuture 非常重视国际化，因此所有教程将会根据语言分类。

## `version`

教程的版本号。

## `topics`

教程涉及的主题。

所有与编程语言、库、框架、工具乃至软件工程有关的一切都可以作为主题。

## `description`

教程的简短描述。

这能帮助人们更快地发现你的教程并且产生兴趣。

## `email`

维护者的电子邮件。

## `steps`

**[必填]** 读者跟着阅读的步骤。

这个字段应当至少包含一个步骤。每一步与你的 Git 仓库的某一次提交严格对应。在每一步中，你应当遵循著名的 UNIX 哲学 —— **只做一件事并且把它做好**。最后，你可以为了讲解的方便自行调整 diff 文件的顺序。

接下来是每一步的详细说明。

### `name`

步骤的名称。这将用对应的提交信息自动填充，你可以酌情进行修改。

### `commit`

对应的提交 ID。请**不要**手动修改此字段。

### `explain`

此步骤的解释。通常你可以解释这一步将完成什么。

### `diff`

在这一步中添加或修改的文件。每个文件包括三个字段：

#### `file`

指向此文件的路径（从教程根目录开始）。Tuture 会为你从 Git 日志中提取此信息。

#### `explain`

与每一步的 `explain` 字段相似。你应当解释为什么这个文件被添加或修改。

#### `collapse`

此文件是否应当默认被折叠（不显示内容）。Tuture 将对以下文件名设置 `collapse: true`：

- package-lock.json
- yarn.lock
- .gitignore

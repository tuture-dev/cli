# CLI 命令

以下命令假定你处在一个 Git 仓库中。如果你还没有安装 Git，请从[此处](https://git-scm.com/downloads)下载。

## `tuture init`

初始化一个 Tuture 教程。

Tuture 会询问你以下问题（如果使用了 `-y` 或 `—yes` 则不会询问）：

| 询问               | 对应字段   | 必要/可选 | 默认值             | 含义                                                         |
| ------------------ | ---------- | --------- | ------------------ | ------------------------------------------------------------ |
| Tutorial Name?     | `name`     | 必要      | My Awesome Project | 此教程的标题                                                 |
| Version | `version` | 必要          | 0.0.1            | 此教程的版本        |
| Tutorial Language? | `language` | 必要      | en            | 此教程的语言                                                 |
| Topics?            | `topics`   | 可选      | -                  | 此教程的主题，不同的主题用空格或逗号分隔，例如 `express,mongodb` |
| Maintainer email?  | `email`    | 可选      | -                  | 此教程维护者的电子邮件                                       |

然后会生成以下文件：

-  **tuture.yml** 文件，用于记录教程的元数据和每一步的讲解，实例结构如下。

-  **.tuture** 目录，用于存放 Tuture 所需的 diff 数据。

```
.tuture
└── diff
    ├── 084a277.diff
    ├── e4a9539.diff
    ├── f898719.diff
    └── fefe569.diff
```

同时，会在你的 `.gitignore` 中添加以下规则（如果没有会为你创建）：

```
# Tuture supporting files
.tuture
```

### 前提条件

当前工作目录应当是一个 Git 仓库，并且至少包含一次提交。

### 选项

#### `-y`, `--yes`

不要询问任何问题，全部用默认值填充。

#### `-h`, `--help`

显示使用方法信息。

## `tuture up`

在浏览器中渲染教程。

这条命令内部会调用 `tuture-renderer` 命令，这个命令程序应当在安装 `tuture` 之前就已经安装完成了。如果你的机器上不知为何不能使用 `tuture-renderer`，你可以用 **npm** 手动安装;

```bash
$ npm i -g tuture-renderer
```

### 前提条件

当前工作目录应当已经用 `tuture init` 命令初始化完成。

### 选项

#### `-h`, `--help`

显示使用方法信息。

## `tuture destroy`

删除所有 Tuture 相关文件。

Tuture 会让你确认此次操作。如果输入真值（例如 `y`，`yes` 和 `1`），那么 **.tuture** 目录和 **tuture.yml** 就会被删除。如果输入非真值（例如 `n`，`no` 和 `0`）或者直接按回车，那么就会取消此命令的执行。

### 前提条件

当前工作目录应当已经用 `tuture init` 命令初始化完成。

### 选项

#### `-f`, `--force`

无需确认，直接强行删除。

#### `-h`, `--help`

显示使用方法信息。

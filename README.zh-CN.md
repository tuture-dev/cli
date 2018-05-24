# Tuture

Tuture 是一个基于 Git 仓库生成高质量技术教程的工具。

*其他语言版本*：[English](README.md)。

## 安装

确保你已经安装了 [Node.js](https://nodejs.org/) (>= 8.0.0) 和 [npm](https://www.npmjs.com/) (>= 5.0.0)。

- **通过 npm 安装**

```bash
$ npm i -g tuture
```

- **通过源代码安装**

将本仓库 clone 到本地后，执行以下命令安装：

```bash
$ npm i -g
```

## 使用 Tuture 命令行工具

### `tuture init`

初始化一个 Tuture 教程。

初始化过程中会触发一系列询问如下：

| 询问               | 对应字段   | 必要/可选 | 默认值             | 含义                                                         |
| ------------------ | ---------- | --------- | ------------------ | ------------------------------------------------------------ |
| Tutorial Name?     | `name`     | 必要      | My Awesome Project | 此教程的标题                                                 |
| Tutorial Language? | `language` | 必要      | English            | 此教程的语言                                                 |
| Topics?            | `topics`   | 可选      | -                  | 此教程的主题，不同的主题用空格或逗号分隔，例如 `express,mongodb` |
| Maintainer email?  | `email`    | 可选      | -                  | 此教程维护者的电子邮件                                       |

然后会生成以下文件：

-  **`tuture.yml`** 文件，用于记录教程的元数据和每一步的讲解，实例结构如下。

```yaml
name: 教程的名称
language: 教程的语言
topics:
  - 主题 A
  - 主题 B
maintainer: 教程维护者的电子邮箱
steps:
  - name: 第一步
    commit: ae05546
    explain: 讲解第一步做了什么
    diff:
      - file: 发生变化的文件 A
        explain: 讲解为什么要增加或修改这个文件
      - file: 发生变化的文件 B
        explain: 讲解为什么要增加或修改这个文件
  - name: 第二步
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

-  **`.tuture`** 目录，用于存放 Tuture 所需的 diff 数据和渲染器。

```
.tuture
├── diff
│   ├── 023d311.diff
│   ├── 032b996.diff
│   └── ff3ec89.diff
└── renderer
```

同时，会在你的 `.gitignore` 中添加以下规则（如果没有会为你创建）：

```
# Tuture supporting files
.tuture
```

### `tuture up`

生成教程并在浏览器打开。

### `tuture destroy`

删除所有 Tuture 相关文件。

## 如何编写 Tuture 教程

编写 Tuture 教程是一件非常轻松愉悦的事情。

1. 初始化一个 Git 仓库（或者在一个已有的仓库中展开）
2. 编写代码并提交，Tuture 会提取您的每次提交，提交信息（commit message）将作为**教程中每一步的标题**
3. 填写 tuture.yml 中相应的 `explain` 字段

在输入 `tuture up` 打开浏览器时，如果您想要修改某处讲解，只需编辑 `tuture.yml` 后保存，改变将会加载到教程中。

# Tuture

Tuture 是一个基于 Git 仓库生成交互式教程的工具。

## 命令行工具

将仓库 clone 到本地后，执行以下命令安装命令行工具：

```bash
$ npm i -g
```

### `tuture init`

初始化一个 Tuture 教程。

调用此命令后，会执行一系列询问：

1. Tutorial Name? 询问此教程的标题
2. Language Code? 询问此教程的语言代码（例如 `zh-hans` 为简体中文）
3. Topics? 询问此教程的主题（例如 `javascript,react`）
4. Maintainer email? 询问此教程维护者的电子邮件（例如 pftom@powerformer.com）

然后会调用 git 命令并根据相应的日志生成以下文件：

-  `tuture.yml` 文件，用于记录教程的元数据和每一步的讲解。具体说明参见 tuture.yml 一节。

-  `.tuture` 目录，用于存储教程中所需的 diff 数据。

### `tuture up`

生成交互式教程并在浏览器打开。

## `tuture.yml`

样例结构如下：

```yaml
name: My Awesome Tutorial
language: zh-hans
topics:
  - javascript
  - express
maintainer: me@me.com
steps:
  - name: Init project
    commit: 46ae055
    explain: <YOUR EXPLANATION HERE>
    diff:
      - file: .gitignore
        explain: <YOUR EXPLANATION HERE>
      - file: README.md
        explain: <YOUR EXPLANATION HERE>
  - name: Roughly implements cli
    commit: a45bec1
    explain: <YOUR EXPLANATION HERE>
    diff:
      - file: cli/__init__.py
        explain: <YOUR EXPLANATION HERE>
      - file: cli/setup.py
        explain: <YOUR EXPLANATION HERE>
      - file: cli/tuture.py
        explain: <YOUR EXPLANATION HERE>
      - file: cli/utils.py
        explain: <YOUR EXPLANATION HERE>
```

注意所有的 `explain` 字段都是可选的。

## .tuture 目录

样例结构如下：

```
.tuture
└── diff
    ├── ee2688f.diff
    ├── b80f04c.diff
    └── b63ddf5.diff
```

每个 diff 文件存储了对应 commit 的变化信息。

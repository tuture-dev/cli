# Tuture

Tuture 是一个基于 Git 仓库生成交互式教程的工具。

## 命令结构

### `tuture init`

初始化一个 Tuture 教程。

调用此命令后，会执行一系列询问：

1. Language code? 询问此教程的语言代码（例如 `zh-hans` 为简体中文）
2. Topic? 询问此教程的主题（例如 `javascript,react`）
3. Maintainer email? 询问此教程维护者的电子邮件（例如 pftom@powerformer.com）

然后会调用 git 命令并根据相应的日志生成以下文件：

-  `Tuturefile` 文件，用于记录教程的元数据和每一步的讲解。具体说明参见 Tuturefile 一节。

-  `.tuture` 目录，用于存储教程中所需的 diff、示例图片等数据。

### `tuture up`

生成交互式教程并在浏览器打开。

每次执行时检查 Tuturefile 和 .tuture 的内容是否改变，如果改变则重新生成后打开，否则直接打开。

## Tuturefile

样例结构如下：

```yaml
---
# 教程名称
name: Building a blog with React & Express
# 教程语言
language: zh-hans
# 维护者电子邮箱
maintainer: pftom@powerformer.com
# 教程涉及主题
topics:
  - javascript
  - react
  - express
# 步骤
steps:
  - name: Init project  # 此步骤的标题
    commit: ee2688f91841b5e8d1e478a228b03b9df8e7d2db  # 对应的 commit
    explain: Initialize with create-react-app  # 此步骤的解说
    fig: .tuture/fig/step-1.png  # 完成此步骤后的示例图
    diff:  # 此步骤的代码变化
      - file: app.js  # 文件名称
        explain: Entrance of the application.  # 改动此文件的解说
      - file: package.json
        explain: Keeping track of dependencies and other stuff.
  - name: Build the router
    commit: b80f04c4cdde727168fe9c1dc19c963cda779ea2
    diff:
      - file: routers/user.js
        explain: Add router for users.
```

注意所有的 `explain` 和 `fig` 字段都是可选的。

## .tuture 目录

样例结构如下：

```
.tuture
├── diff
│   ├── ee2688f91841b5e8d1e478a228b03b9df8e7d2db
│   ├── b80f04c4cdde727168fe9c1dc19c963cda779ea2
│   └── b63ddf5d6a526769648bc6cab0f36e772f97c931
└── fig
    ├── step-1.png
    ├── step-2.png
    └── step-3.png
```

里面有两个子目录：diff 用于存储每一个 commit 的变化信息，fig 用于存储每个 commit 的示意图。

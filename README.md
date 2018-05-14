# Tuture

Tuture 是一个基于 Git 仓库生成交互式教程的工具。

## 命令行工具

将仓库 clone 到本地后，执行以下命令安装命令行工具：

```bash
$ pip3 install -e cli
```

### `tuture init`

初始化一个 Tuture 教程。

调用此命令后，会执行一系列询问：

1. Language code? 询问此教程的语言代码（例如 `zh-hans` 为简体中文）
2. Topic? 询问此教程的主题（例如 `javascript,react`）
3. Maintainer email? 询问此教程维护者的电子邮件（例如 pftom@powerformer.com）

然后会调用 git 命令并根据相应的日志生成以下文件：

-  `tuture.json` 文件，用于记录教程的元数据和每一步的讲解。具体说明参见 tuture.json 一节。

-  `.tuture` 目录，用于存储教程中所需的 diff、示例图片等数据。

### `tuture up`

生成交互式教程并在浏览器打开。

每次执行时检查 Tuturefile 和 .tuture 的内容是否改变，如果改变则重新生成后打开，否则直接打开。

## `tuture.json`

样例结构如下：

```json
{
  // 教程名称
  "name": "Build a blog with React & Express",
  // 教程语言
  "language": "zh-hans",
  // 维护者电子邮箱
  "maintainer": "email@example.com",
  // 教程涉及主题
  "topics": [
    "python",
    "click"
  ],
  // 步骤
  "steps": [
    {
      "name": "Init project",
      "commit": "46ae055",
      "explain": "[YOUR EXPLAINATION HERE]",
      "fig": "[YOUR FIGURE HERE]",
      "diff": [
        {
          "file": "cli.py",
          "explain": "[YOUR EXPLAINATION HERE]"
        },
        {
          "file": "README.md",
          "explain": "[YOUR EXPLAINATION HERE]"
        }
      ]
    },
    {
      "name": "Implement parser",
      "commit": "12e3vt6",
      "explain": "[YOUR EXPLAINATION HERE]",
      "fig": "[YOUR FIGURE HERE]",
      "diff": [
        {
          "file": "parser.py",
          "explain": "[YOUR EXPLAINATION HERE]"
        }
      ]
    }
    // More steps...
  ]
}
```

注意所有的 `explain` 和 `fig` 字段都是可选的。

## .tuture 目录

样例结构如下：

```
.tuture
└── diff
    ├── ee2688f.diff
    ├── b80f04c.diff
    └── b63ddf5.diff
```

里面有两个子目录：diff 用于存储每一个 commit 的变化信息，fig 用于存储每个 commit 的示意图。

# Tuture

Tuture 是一个基于 Git 仓库、轻松且快速编写高质量技术教程的工具。

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

## 文档

- [CLI 命令](docs/CLI_COMMANDS.zh-CN.md) 详细地介绍了 Tuture 命令行工具的使用

- [tuture.yml 规格说明](docs/TUTURE_YML_SPEC.zh-CN.md) 是关于 tuture.yml 的详尽说明

## 如何编写 Tuture 教程

编写 Tuture 教程是一件非常轻松愉悦的事情。

1. 初始化一个 Git 仓库（或者在一个已有的仓库中展开）

2. 编写代码并提交，每次提交信息应有意义

3. 运行 `tuture init` 来初始化 Tuture 教程

4. 在 tuture.yml 的相应 `explain` 字段中填写你的讲解

5. 运行 `tuture up` ，就会打开浏览器并渲染你的教程

6. 编辑 `tuture.yml` 并保存，即可修改教程中的内容

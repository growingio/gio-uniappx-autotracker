# GrowingIO uni-app x Autotracker Demo

![GrowingIO](https://www.growingio.com/vassets/images/home_v3/gio-logo-primary.svg)

## 介绍

本仓库是 `gio-uniappx-autotracker` 的 demo 工程，仓库根目录就是可以直接用 HBuilderX 打开的 uni-app x 示例项目。

SDK 本体不放在仓库根目录，而是以 `uni_modules` 集成包形态内置在：

```text
uni_modules/gio-uniappx-autotracker
```

这样的目录结构是为了方便开发、调试和验证 SDK：你可以直接运行根目录 demo，观察 SDK 在 Web、App 和微信小程序等端上的初始化、生命周期采集、事件上报、用户身份、ABTest 和分享采集效果。业务工程正式接入时，只需要使用 `uni_modules/gio-uniappx-autotracker` 这个 SDK 包。

## SDK 文档

SDK 的接入方式、初始化参数、API 和插件说明请看包内文档，根 README 不重复展开 SDK 细节：

| 文档 | 说明 |
| --- | --- |
| [SDK 使用指南](./uni_modules/gio-uniappx-autotracker/docs/README.md) | SDK 能力概览、平台范围和文档导航 |
| [集成与初始化配置](./uni_modules/gio-uniappx-autotracker/docs/integration.md) | 如何把 SDK 放进业务工程、如何初始化和验证 |
| [数据采集 API](./uni_modules/gio-uniappx-autotracker/docs/apis.md) | 自定义事件、用户身份、用户属性、动态开关、地理位置 |
| [功能插件](./uni_modules/gio-uniappx-autotracker/docs/plugins.md) | ABTest 和微信小程序分享采集插件 |

SDK 包入口 README：

- [uni_modules/gio-uniappx-autotracker/README.md](./uni_modules/gio-uniappx-autotracker/README.md)

## Demo 工程

根目录 demo 主要用于 SDK 开发和联调，包含最小初始化、常用 API 页面、ABTest 页面和微信小程序分享采集示例。

运行要求：

- 根目录 demo 包含 `uni-link-x` 示例组件，需使用 HBuilderX / uni-app x `5.07` 或更高版本打开和编译。
- SDK 发布包只包含 `uni_modules/gio-uniappx-autotracker`，不包含根目录 demo 和 `uni-link-x` / `uts-openSchema` 示例依赖；业务工程接入 SDK 时以 SDK 包内 `package.json` 声明的版本范围为准。

打开 demo：

```bash
npm run demo:open
```

这条命令等价于：

```bash
open -a HBuilderX .
```

打开后，在 HBuilderX 里选择目标平台运行或编译：

- `web`
- `mp-weixin`
- `app-android`
- `app-ios`
- `app-harmony`

demo 的初始化入口在 [main.uts](./main.uts)，页面示例在 [pages](./pages)。如果你只是想了解 SDK 如何集成到业务工程，请优先阅读上面的 SDK 文档，而不是从 demo 页面反推完整用法。

## 目录说明

```text
.
├── App.uvue                         # demo 应用入口
├── main.uts                         # demo 初始化入口
├── pages/                           # demo 页面
├── uni_modules/
│   └── gio-uniappx-autotracker/     # SDK 集成包
├── scripts/
│   └── release-sdk.mjs              # SDK 发布包检查与打包脚本
└── docs/                            # SDK 设计和内部实现文档
```

`docs/` 目录主要面向 SDK 维护者，用于记录设计、协议和实现细节。普通 SDK 使用者请从 `uni_modules/gio-uniappx-autotracker/docs/README.md` 开始阅读。

## 获取 SDK 包

业务工程接入时，使用完整的 SDK 包目录：

```text
uni_modules/gio-uniappx-autotracker
```

你可以从 GitHub Release 下载发布包，或从本仓库复制该目录到业务工程的 `uni_modules/` 下。

## 本地打包检查

维护 SDK 或准备发布前，可以在仓库根目录执行：

```bash
npm run sdk:check
npm run sdk:release
```

`sdk:check` 会检查 SDK 包结构和关键入口是否齐全。`sdk:release` 会生成发布包：

```text
dist/release/gio-uniappx-autotracker-<version>.tgz
```

发布包只包含 `uni_modules/gio-uniappx-autotracker`，不会包含根目录 demo 工程。

## 发布

发布前先确认 `uni_modules/gio-uniappx-autotracker/package.json` 里的 `version` 已更新，并且本地检查通过：

```bash
npm run sdk:check
npm run sdk:release
```

推送 `v<version>` 格式的 tag 到 `origin` 后，GitHub Actions 会自动生成 SDK 发布包并上传到对应的 GitHub Release。tag 版本必须和 SDK `package.json` 版本一致，例如当前 `0.1.0` 对应：

```bash
git tag v0.1.0
git push origin v0.1.0
```

## 开源说明

GrowingIO uni-app x Autotracker Lite 用于演示和验证 uni-app x 场景下的基础采集 SDK 能力。请在接入前阅读 SDK 文档，并根据你的业务工程平台范围完成真实编译和上报验证。

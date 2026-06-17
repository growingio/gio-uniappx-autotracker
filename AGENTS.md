# Project Constraints

本文件是 `gio-uniappx-autotracker` 的项目级硬性规则文档。

## 官方规则来源

- UTS 官方文档：<https://doc.dcloud.net.cn/uni-app-x/uts/>
- UTS 与 TypeScript 差异：<https://doc.dcloud.net.cn/uni-app-x/uts/uts_diff_ts.html>
- UTS 插件开发规范：<https://doc.dcloud.net.cn/uni-app-x/plugin/uts-plugin.html>
- 项目 UTS 编码规范：[docs/uts-coding-guidelines.md](docs/uts-coding-guidelines.md)

以上文档是本项目的强约束来源。实现、重构、修复、补 demo、补文档时，都必须优先服从这些规则，不能按普通 TypeScript / JavaScript 习惯自行放宽。

## 硬性规则

- 目标是让 SDK 在 `web`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin` 五个端都能正确产出；任何代码改动都不能只按单端思路实现。
- `utssdk` 目录结构必须保持多端入口齐全：`app-js`、`web`、`app-android`、`app-ios`、`app-harmony`、`mp-weixin`。
- `web` 目录必须保留 `utssdk/web/package.json`，`app-android`、`app-ios`、`app-harmony` 目录必须保留各自的 `config.json`。
- 不要依赖 `undefined` 语义。所有非必填字段统一显式使用 `null`，不要使用 `?` 可选属性或可选参数表达运行时缺省。
- 对外配置对象和事件对象要使用稳定、显式的字段结构，避免让生成器自行推断可选字段形态。
- 不要把 `UTSJSONObject` 直接当强类型配置对象使用；需要先做显式归一化，再进入核心逻辑。
- 尽量避免使用容易在 UTS 生成阶段出现歧义的 TypeScript 风格写法，尤其是复杂的类型体操、依赖 `undefined` 的分支、以及仅靠类型断言维持正确性的接口设计。
- 能用 `type` 明确表达的数据结构，不要为了 TS 习惯随手写 `interface` 并直接承接对象字面量。
- 跨端公共逻辑优先收敛在 `utssdk/common`，平台入口只做必要的薄封装，不要无序分叉实现。
- 用户身份相关字段 `sessionId`、`userId`、`userKey` 必须持久化到存储里，并且每次构建事件时都要从存储重新读取，不能只靠内存态维护。
- 关键事件与公开能力基线必须保留：`VISIT`、`PAGE`、`APP_CLOSED`、`track`、`setUserId`、`setUserKey`、`clearUserId`、`identify`、`registerPlugins`、`getABTest`。

## 验证规则

- 不能因为源码编译通过，就默认五端可用。
- 每次改动后，至少要保证 `npm run build`、`npm run verify:bundle` 可通过。
- `npm run release` 应保持可用，确保最终发布产物结构完整。
- 如果要声称“五端都能编译并可上报”，必须经过真实的 HBuilderX 五端编译验证，不能只根据源码或 `dist` 结构做结论。

## 当前项目约定

- 当前 SDK 采用“显式 `null`”模型，不使用 `undefined` 作为对外契约。
- 当前插件入口通过 `normalizeInitOptions()` 做配置归一化，再进入 `GioTracker`。
- 当前 demo 也必须遵守同样的 UTS 规则，不能因为只是示例就退回普通 TS 写法。

# gio-uniappx-autotracker

请优先查看仓库根目录文档：

- [根 README](../../README.md)：当前 demo、SDK 集成方式、生命周期桥接约束
- [QA.md](../../QA.md)：高频坑、平台限制、桥接与编译边界
- [设计文档](../../docs/uniappx-sdk-design.md)：模块职责、事件模型、生命周期策略
- [UTS 编码规范](../../docs/uts-coding-guidelines.md)：类型、`UTSJSONObject`、`uni.request()`、空值模型

当前模块内最重要的约束只有两条：

- `plugin.uts` 只做 JS 编译层生命周期桥接和快照转发，不直接承接核心采集逻辑
- `utssdk/` 只接收稳定的快照对象，不能直接依赖页面实例 `this` 或原始 `options`

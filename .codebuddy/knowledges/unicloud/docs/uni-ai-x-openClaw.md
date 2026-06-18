# 简介
一款 OpenClaw AI Channel 插件，提供基于 uniCloud WebSocket 的通道支持，实现 Web/移动应用与 你本地电脑上的OpenClaw 实时通信。

## 目录
- [准备工作](#准备工作)
- [安装插件](#安装插件)
- [核心功能](#核心功能)
- [消息协议](#消息协议)
- [常见问题](#常见问题)
- [卸载插件](#卸载插件)


## 准备工作
### 1. 导入示例项目并关联服务空间
点击[uni-ai-x](https://ext.dcloud.net.cn/plugin?id=23902) 打开插件页面，点击`使用 HBuilderX 导入示例项目`。
此时 HBuilderX 会自动弹出 `新建 uni-app 项目` 对话框，其中 uniCloud 必须选择 `支付宝云`；
点击创建后，在接下来弹出的 `绑定 uniCloud 服务空间到项目[uni-ai x-sample]` 向导中，选择要绑定的服务空间。

> 若未创建服务空间：
> 点击`新增`跳转至[uniCloud Web控制台](https://unicloud.dcloud.net.cn/)，完成实名认证后点击`新建服务空间`。
> - 服务商：必须选择`支付宝云`；
> - 付费方式：可选`免费版`（满足轻度使用）或`按量计费`（推荐）。
> 创建完成后返回 HBuilderX 选择该服务空间（创建有延迟，可刷新），点击 `下一步` -> `开始部署`。

### 2. 配置 access_token
在 HBuilderX 中打开项目根目录的 `uniCloud/cloudfunctions/uni-ai-openclaw/config` 文件：
- 自定义**较长字符串**作为客户端（包括：uni-ai-x、openClaw channel）连接 uniCloud websocket 的通行密钥
- 配置完成后，右键该文件选择「上传部署」确保生效。

> ⚠️ 关键注意事项：
> 1. `access_token.user` 的值需与 `uni_modules/uni-ai-x/sdk/websocket-manager.uts` 中 `uniCloud.connectWebSocket` 传递的 `access_token` 一致，否则连接会被拒绝；
> 2. `access_token.openClaw`的值会用于下文配置 openclaw channel uni-ai-x 请记住它。

### 3. 初始化数据库
在 `uniCloud/database` 文件夹上右键，选择`上传所有 DB Schema（含扩展）`完成初始化。

### 4. 获取 WebSocket 地址（以下简称wsUrl）@wsUrl
1. 登录 [uniCloud Web 控制台](https://unicloud.dcloud.net.cn/)；
2. 找到已关联的服务空间 → 进入「详情」→ 选择「云函数/云对象」；
3. 找到 `uni-ai-openclaw` 云函数，点击「详情」；
4. 滚动至页面底部，找到「云函数 URL 化」模块，点击「复制路径」；
5. 拼接最终 wsUrl：复制的路径 + `/getWebSocketURL`（示例：`https://env-1234567890.dev-hz.cloudbasefunction.cn/openclaw/getWebSocketURL`）。

## 安装插件
准备好 `access_token` 和 `wsUrl` 后，执行以下命令安装：

- 下载插件
```bash
git clone https://gitcode.com/dcloud/uni-ai-openclaw-channel-plugin.git
```
- 运行插件安装命令
```bash
cd uni-ai-openclaw-channel-plugin && ./install.sh
```

### 安装脚本自动完成的操作
1. **检查并安装 OpenClaw**：若未安装，提示执行 `npm install -g openclaw`；
2. **编译插件源码**：自动安装依赖并编译；
3. **安装插件**：将插件安装至 `~/.openclaw/extensions/uni-ai` 目录；
4. **引导配置**：运行 `openclaw onboard`，需填写：
   - Channel：选择 **Uni-AI (WebSocket)**；
   - WebSocket URL：填写上文获取的 [wsUrl](#wsUrl)；
   - access_token：填写上文配置的`access_token.openClaw`。

### 配置补充说明
- **模型配置 (LLM Provider)**：必填项，需根据引导配置 AI 模型（如 DeepSeek、OpenAI、Claude 等）；
- **Channel 配置**：核心项，确保 wsUrl 和 access_token 与准备工作中的值一致。

## 核心功能
### WebSocket 连接管理
- **动态 URL 获取**：插件通过配置的 uniCloud API 地址自动获取真实的 WebSocket 连接地址；
- **自动鉴权**：连接时自动携带 `access_token` 完成鉴权；
- **智能重连**：断线自动重连（间隔 5 秒），连接失败重试（间隔 10 秒）。

### 消息处理机制
- **会话隔离**：基于 `chat_id` 实现会话隔离，不同 `chat_id` 的对话上下文完全独立；
- **消息透传**：`fromConnectionId` 会原样通过 `toConnectionId` 返回，便于消息路由。

### AI 流式响应
- **实时推送**：AI 生成文字片段后立即推送至客户端，支持打字机效果；
- **静默检测**：检测 AI 输出静默时长（默认 3 秒），自动发送完成信号（临时方案，后续优化）。

## 消息协议
### 客户端发送消息格式
```json
{
  "type": "user_message",
  "fromConnectionId": "client-123",
  "data": {
    "text": "消息内容",
    "chat_id": "会话标识"
  }
}
```

### 服务端响应消息格式
#### 流式推送（进行中）
```json
{
  "text": "AI 生成的文字片段",
  "isDone": false,
  "chat_id": "会话标识",
  "toConnectionId": "client-123"
}
```

#### 完成信号
```json
{
  "text": "",
  "isDone": true,
  "chat_id": "会话标识",
  "toConnectionId": "client-123"
}
```

#### 错误消息
```json
{
  "error": "错误描述",
  "chat_id": "会话标识",
  "toConnectionId": "client-123"
}
```

## 卸载插件
执行以下脚本安全移除插件：

```bash
./uninstall.sh plugin
```

## 常见问题
| 问题 | 解决方案 |
|------|----------|
| 如何确认插件是否正常运行？ | 执行 `openclaw logs`，日志中出现 `[uni-ai:default] WebSocket connected` 表示连接成功 |
| Web UI 显示 "Running: No" 但功能正常？ | 这是已知的显示问题，不影响实际使用。只要日志显示 WebSocket 已连接，插件就在正常工作 |
| WebSocket 连接地址在哪里配置？ | 在 `~/.openclaw/openclaw.json` 中配置 `channels.uni-ai.wsUrl` 字段 |
| 支持发送图片、文件吗？ | 目前仅支持文本类型消息 |
| 修改配置后未生效？ | 执行 `openclaw gateway restart` 重启网关 |
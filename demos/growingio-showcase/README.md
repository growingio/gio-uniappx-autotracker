# growingio-showcase

这是当前最小版 `gio-uniappx-autotracker` 的 demo。页面结构参考了 `develop` 分支的 showcase 首页，但这里只保留当前 SDK 真正已经支持的能力：

- `VISIT`
- `PAGE`
- `APP_CLOSED`
- `track`
- `setUserId`
- `setUserKey`
- `clearUserId`

如果本地没有自动生成 `uni_modules/gio-uniappx-autotracker` 链接，需要先让 demo 指向当前仓库里的模块目录，再在 HBuilderX 中运行。

推荐先在仓库根目录执行：

```bash
npm run dev:demo-web
```

如果你要直接调 web demo，这条命令会自动完成：

- 构建 SDK
- 校验 `dist` 产物
- 调用 HBuilderX `launch web`
- 进入监听模式；SDK 源码变化后会自动重建 bundle

如果希望在 web 本地地址 ready 后自动打开浏览器，可以执行：

```bash
npm run dev:demo-web -- --open-browser
```

其它平台也有同风格命令：

```bash
npm run dev:demo-mp
npm run dev:demo-android
npm run dev:demo-ios
npm run dev:demo-harmony
```

如果你只想准备环境，不真正拉起 HBuilderX，可以执行：

```bash
npm run dev:demo-web -- --prepare-only
```

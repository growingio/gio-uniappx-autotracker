# uni-app x 类型

## 初始化依赖

```shell
pnpm i
```

## 配置环境

当前目录建立 .env 文件

```
UNI_CORE_DIR = "%vuejs-core 仓库路径%/packages/uni-ext-api/src"
UNI_UTS_PLUGIN_API_DIR = "%新 uni-app 仓库路径%/api"
UNI_UTS_PLUGIN_COMPONENT_DIR = "%新 uni-app 仓库路径%/component"
UNI_UTS_PLUGIN_MODULES_DIR = "%dcloud-uts 仓库路径%/uni_modules"
UNI_COMPLIER_META_DIR = "%旧 uni-app 仓库路径%/packages/uni-uts-v1/lib/ext-api"

```

## 构建

构建框架内置 Uni Api

```shell
pnpm build:types:core
```

构建 Ext Api

```shell
pnpm build:types:ext
```

生成默认参数数据到编译器

```shell
pnpm build:types:meta
```
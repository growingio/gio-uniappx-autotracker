## 环境变量

在控制台编辑云函数时，您可以为云函数的运行环境增加、删除或修改环境变量。

在配置环境变量后，环境变量将在函数运行时配置到所在的操作系统环境中，并在函数执行期间全局生效。函数代码可以使用读取系统环境变量的方式来获取到设置的具体值并在代码中使用。


## 操作步骤


### 控制台中配置环境变量@set-from-web-console
1. 登录[uniCloud控制台](https://unicloud.dcloud.net.cn/)，选择服务空间。
2. 点击左侧菜单栏“云函数/云对象”，进入云函数管理页面。
3. 选择要配置环境变量的云函数，进入详情后滚动到页面最下方，找到“环境变量”一栏。
      ![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/cf/SCR-20260206-nuxk.png)
4. 点击“编辑”，可新增、删除或修改环境变量，环境变量以 key=value 的形式显示。
![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/cf/SCR-20260206-nvnf.png)
5. 保存后实时生效。


### HBuilderX中配置环境变量@set-from-hbuilder

> HBuilderX 5.08+版本支持

1. 云函数/云对象右击选择“配置云函数环境变量”
2. 打开的界面中添加需要设置的环境变量，支持分别设置远程及本地值
3. 点击保存，同样支持分别保存远程及本地值

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/cf/SCR-20260309-rphc.png)

保存后会在云函数目录下创建`.env`文件。


### 使用环境变量@use-env-variables

已配置的环境变量，会在函数运行时配置到函数所在的运行环境中，可通过代码读取系统环境变量的方式来获取到具体值并在代码中使用。

假设针对云函数，配置的环境变量的 key 为 TEST_ENV，可通过以下代码在函数中获取环境变量值
```js
'use strict';
exports.main = async (event, context) => {
    const testEnv = process.env.TEST_ENV
    console.log(testEnv)
}
```

## 使用限制

目前有如下使用限制：

- 环境变量 key 最长50个字符且必须以字母开头，只能包含字母、数字和下划线
- 预留的环境变量 key 前缀无法配置，前缀包括：SCF_、QCLOUD_、TENCENTCLOUD_、UNI_、 UNICLOUD_、 DCLOUD_、WORKSPACE_、TCB_、RUNTIME_、TRIGGER_
- 环境变量值长度限制最长 1024 个字符
- 单个云函数最多可添加 20 个环境变量

# 数据库可视化管理工具

MongoDB官方提供了数据库可视化管理工具，该工具可以对数据库进行可视化管理，如库创建、表创建、索引创建、表数据查询等操作。

## 安装教程@install

1. 根据自己的操作系统下载对应的安装包

- windows：[mongodb-compass-1.46.2-win32-x64.exe](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/mongodb-compass/mongodb-compass-1.46.2-win32-x64.exe)

- mac-arm64：[mongodb-compass-1.46.2-darwin-arm64.dmg](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/mongodb-compass/mongodb-compass-1.46.2-darwin-arm64.dmg)

- mac-x64：[mongodb-compass-1.46.2-darwin-x64.dmg](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/mongodb-compass/mongodb-compass-1.46.2-darwin-x64.dmg)

- linux：[mongodb-compass-1.46.2-linux-x64.tar.gz](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/mongodb-compass/mongodb-compass-1.46.2-linux-x64.tar.gz)

2. 下载完成后，打开文件安装，安装成功后，打开软件如果有以下弹窗，需要按下图所示操作

**注意：**

- 如果购买的是 MongoDB 8.0 版本（1核2G实例不支持8.0版本），可以点 Install 代表升级管理工具版本，并忽略第3步操作
- 如果数据库低于 8.0 版本，请点击 Ask me later 代表不升级管理工具版本，并再进行第3步操作

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/c9753b38-8107-49ab-a7f4-051c61391c93.png)

3. 最后再进入设置页面，隐私，去除下图4个勾，点保存（代表不自动升级），具体按下图操作

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/0478e22b-5661-4d4b-9e90-ee04675e9b22.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/114ae01e-e9cb-4406-8bf3-80cb47dc141e.png)

## 使用教程@use

打开 MongoDB Compass 进入工具首页，输入连接信息，如下图所示

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/7ae2bf07-aac5-43af-81ab-4d26a18a9f9b.png)

连接数据库后，可以看到3个内置的库（admin、config、local），这3个库不要去动Ta

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/ac405614-52b3-4a32-a9f2-905aebe457e9.png)

### 新建库@create-database

点击这个+号可以创建一个新的库

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/b739468c-47b4-4ffc-a507-4d2229634681.png)

在弹窗中按如下图所示输入相应的信息，并点击创建

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/fed5df0d-15e6-4840-b010-1d712ae31b23.png)

### 新建表@create-collection

点击库名右边的+号可以创建表

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/7837f39e-f8e1-4ef0-a4cc-6f6557f632ef.png)

在弹窗中按如下图所示输入相应的信息，并点击创建

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/55679faf-fb07-491b-b72b-b035d57383e6.png)

### 查看表数据@query

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/3800e05c-1901-468c-9eba-caf647edbfb1.png)

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/cec9d355-ac82-4cf9-9156-9d752fe594b0.png)

### 创建索引@create-index

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/4b0e4b9d-8061-49a8-bbf6-2c5c2807ed43.png)

在弹窗中按如下图所示输入相应的信息，并点击创建

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/f46803ba-f5ae-48e5-ac31-3fb5cbb95861.png)

**创建唯一稀疏索引**

唯一稀疏索引：即允许字段不存在，但如果存在，则值必须唯一的索引。可按如下图所示创建

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/f0767851-3ced-43bc-9eeb-345cc7755403.png)

## 特别注意@tips

![](https://web-ext-storage.dcloud.net.cn/doc/unicloud/ext-mongodb/image/f1b1c96c-b519-4a1d-a47d-bb8301afe0b5.png)




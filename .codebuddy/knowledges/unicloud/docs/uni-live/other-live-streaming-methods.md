# 其他直播方式

## 推流
### OBS@obs-push

以下是使用OBS Studio + RTMP推流的示例：

1. 首先在[uni直播控制台](https://unicloud.dcloud.net.cn/pages/uni-live/settings)中生成推流地址，例如：`rtmp://push.example.com/live/streamName`。
2. 下载并安装[OBS Studio](https://obsproject.com/)。
3. 打开OBS Studio，点击软件右下角的**设置**按钮。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507012026087.png)

4. 在设置窗口中，选择左侧菜单**直播**。
    - 在**服务**下拉菜单中选择**自定义**。
    - 在**服务器**输入框中填写您的推流地址，例如：`rtmp://push.example.com/live/streamName`。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507012030543.png)

5. 填写完成后，点击**应用**按钮，然后点击**确定**按钮关闭设置窗口。
6. 在OBS Studio主界面，点击右下角的**开始推流**按钮开始直播推流。
7. 在uni直播控制台中，您可以查看直播流状态和相关信息。

## 拉流
### VLC 播放器@vlc-pull

VLC播放器支持多种协议的直播拉流播放，包括RTMP、HLS等。您可以在VLC播放器中打开网络流，输入您的拉流地址进行播放。

1. 下载并安装[VLC播放器](https://www.videolan.org/vlc/)。
2. 打开VLC播放器，点击菜单栏的**媒体** > **打开网络串流**。
3. 在弹出的窗口中，选择**网络**选项卡。
4. 在**网络URL**输入框中，输入您的拉流地址，例如：`rtmp://pull.example.com/live/streamName`。

![](https://web-ext-storage.dcloud.net.cn/unicloud/docs/202507012047617.png)

5. 点击**播放**按钮开始播放直播流。

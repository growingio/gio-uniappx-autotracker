## 业务开通

### 开通流程@enable-uni-ai-service

使用开发者账号登录[uniCloud控制台](https://unicloud.dcloud.net.cn/) ，选择`uni-ai`栏目。

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-ai/ai20230613-200227.png)

阅读uni-ai服务协议并点击协议下方的“同意协议并开通”按钮，便可开通uni-ai服务。

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-ai/ai20230614-203932.png)


### 购买套餐
uni-ai付费服务按月度套餐购买，您可以根据业务规模，选择合适的套餐下单。

![](https://web-ext-storage.dcloud.net.cn/doc/uni-ai/ai-package-buy-0616.png)

#### 套餐升级说明

为提供更优质的AI服务体验，我们将于2025年6月25日正式推出uni-ai新版套餐体系。现将升级事宜说明如下:

1. 新套餐上线：2025年6月25日起，所有新购套餐将按照新版规范执行。
2. 自动升级：对于在新版套餐上线前购买且仍在有效期内的旧版套餐，我们将自动为您升级至对应权益的新版套餐，无需任何操作。
3. 计费单位变更：为优化计费体系，我们引入新的计费单位"utoken"替代原有的"token"概念。此次变更仅涉及概念名称调整，实际价值保持不变，即1 utoken = 1 token（旧版）。所有新版套餐中的utoken价值将与旧版套餐中的token保持完全一致，用户权益不受影响。[什么是utoken？](https://doc.dcloud.net.cn/uniCloud/uni-ai-intro.html#concept-utoken)

新旧版本套餐内容如下所示：

|版本		|utoken数(新版)	|token数(旧版)	|售价		|
|--			|--				|--				|--			|
|体验版		|300K			|300K			|4.5元/月	|
|45元套餐	|3030K			|~~3000K~~		|45元/月		|
|90元套餐	|6080K			|~~6000K~~		|90元/月		|
|450元套餐	|30500K			|~~30000K~~		|450元/月	|
|900元套餐	|62000K			|~~60000K~~		|900元/月	|
|1800元套餐	|125000K		|~~120000K~~	|1800元/月	|
|4500元套餐	|315000K		|~~300000K~~	|4500元/月	|
|9000元套餐	|650000K		|~~600000K~~	|9000元/月	|
|旗舰版餐	|1450000K		|~~1335000K~~	|20000元/月	|


### 安全配置

系统提供了 uniCloud 服务空间白名单安全配置，可以提高接口调用安全性，防止被他人盗用。可点击“添加服务空间”按钮，选择相应的服务空间完成添加服务空间白名单，服务空间添加成功后，只有列表中的服务空间才可以调用当前账号下的uni-ai接口。此列表为空时，不校验调用方的服务空间。

![](https://qiniu-web-assets.dcloud.net.cn/unidoc/zh/uni-ai/ai20230614-204136.png)

### 调用记录

系统可查看uni-api接口每日调用汇总数据，包括每日调用次数、每日调用成功次数、每日消耗token数等汇总数据。

![](https://web-ext-storage.dcloud.net.cn/doc/uni-ai/ai-record-061602.png)


### 调用统计

系统可查看uni-api接口每日调用汇总数据，包括每日调用次数、每日调用成功次数、每日消耗token数等汇总数据。

![](https://web-ext-storage.dcloud.net.cn/doc/uni-ai/ai-stat-061602.png)


## 套餐说明 @Price

### 套餐生效中-续费

在uni-ai套餐信息页面点击续费按钮可以对套餐进行续费操作。

![](https://web-ext-storage.dcloud.net.cn/doc/uni-ai/ai-xf-061602.png)


### 套餐生效中-升配

在uni-ai套餐信息页面点击变配按钮可以对套餐进行升配操作。升配时需要补足差价。  
例:  
2023年6月16日，购买2个月体验版套餐，到期时间为2023年8月16日 00:00:00，包月单价为4.5元/月。  
在不同的时间点操作升配，需要支付的差价是不同的。  
假如选择在第一个月2023年6月17日，将该套餐升级为45元/月的45元版套餐。则需要补差价2个月\*(45-4.5)=81元  
假如选择在第二个月套餐到期的前一天2023年8月15日，将该套餐升级为45元/月的45元版套餐。则需要补差价1个月\*(45-4.5)=40.5元

### 套餐到期前一天-降配

在uni-ai套餐信息页面点击变配按钮可以对套餐进行降配操作。


**注意**

- 仅支持在套餐到期的前一天执行降配操作。
- 如果降配时token用量超过降配目标套餐的token上限，则会导致降配失败


### 套餐过期-新购
套餐到期后，套餐状态将被设置为禁用，无法再使用uni-ai相关功能。如需继续使用，您需要新购套餐。
套餐处于禁用状态后，以您执行新购操作的时间为起点计算包月时长，例如您的套餐在2023年06月10日到期，在2023年06月15日执行新购操作,购买时长为1个月，那么套餐的到期时间即为2023年7月15日。



## 计费网关支持的模型及计费标准 @Bill

注意：以下所有折合价格均以4.5元体验版套餐为基准计算得出，套餐规格越高，实际折合价格越低，优惠力度越大。[套餐升级说明](#套餐升级说明)

### 七牛云

|模型									|用量			|消耗			|折合价格	|
|--										|--				|--				|--			|
|deepseek-r1 #{rowspan=2}				|1K tokens输入	|0.267K utokens	|0.004元	|
|1K tokens输出							|1.067K utokens	|0.016元		|
|deepseek-v3 #{rowspan=2}				|1K tokens输入	|0.134K utokens	|0.002元	|
|1K tokens输出							|0.534K utokens	|0.008元		|
|deepseek-r1-32b #{rowspan=2}			|1K tokens输入	|0.1K utokens	|0.0015元	|
|1K tokens输出							|0.4K utokens	|0.006元		|
|deepseek-r1-distill-32b #{rowspan=2}	|1K tokens输入	|0.1K utokens	|0.0015元	|
|1K tokens输出							|0.4K utokens	|0.006元		|
|qwen-max-2025-01-25 #{rowspan=2}		|1K tokens输入	|0.16K utokens	|0.0024元	|
|1K tokens输出							|0.64K utokens	|0.0096元		|
|qwen2.5-72b-instruct #{rowspan=2}		|1K tokens输入	|0.267K utokens	|0.004元	|
|1K tokens输出							|0.8K utokens	|0.012元		|
|qwen2-72b-instruct #{rowspan=2}		|1K tokens输入	|0.267K utokens	|0.004元	|
|1K tokens输出							|0.8K utokens	|0.012元		|
|qwen2-vl-72b-instruct #{rowspan=2}		|1K tokens输入	|1.067K utokens	|0.016元	|
|1K tokens输出							|3.2K utokens	|0.048元		|
|qwq-plus #{rowspan=2}					|1K tokens输入	|0.134K utokens	|0.002元	|
|1K tokens输出							|0.4K utokens	|0.006元		|
|qwq-32b #{rowspan=2}					|1K tokens输入	|0.134K utokens	|0.002元	|
|1K tokens输出							|0.4K utokens	|0.006元		|
|qwen2.5-vl-7b-instruct #{rowspan=2}	|1K tokens输入	|0.134K utokens	|0.002元	|
|1K tokens输出							|0.334K utokens	|0.005元		|
|qwen-vl-max-2025-01-25 #{rowspan=2}	|1K tokens输入	|0.2K utokens	|0.003元	|
|1K tokens输出							|0.6K utokens	|0.009元		|
|doubao-1.5-pro-32k #{rowspan=2}		|1K tokens输入	|0.054K utokens	|0.0008元	|
|1K tokens输出							|0.134K utokens	|0.002元		|


### MiniMax

|模型								|用量			|消耗			|折合价格	|
|--									|--				|--				|--			|
|abab6.5s-chat #{rowspan=2}			|1K tokens输入	|0.067K utokens	|0.001元	|
|1K tokens输出						|0.067K utokens	|0.001元		|
|abab5-chat（`已下线`） #{rowspan=2}|1K tokens输入	|1K utokens		|0.015元	|
|1K tokens输出						|1K utokens		|0.015元		|
|abab4-chat（`已下线`） #{rowspan=2}|1K tokens输入	|1K utokens		|0.015元	|
|1K tokens输出						|1K utokens		|0.015元		|


### Azure

|模型						|用量			|消耗		|折合价格	|
|--							|--				|--			|--			|
|gpt-3.5-turbo #{rowspan=2}	|1K tokens输入	|0.8K utokens|0.012元	|
|1K tokens输出				|1.067K utokens	|0.016元	|
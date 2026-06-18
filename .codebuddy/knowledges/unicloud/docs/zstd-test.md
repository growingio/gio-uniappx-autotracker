## 安装zstd压缩

### windows 系统

#### 下载安装zstd for Windows
[下载地址](https://github.com/facebook/zstd/releases)

<!-- #### 安装php扩展 -->

<!-- todo -->

### linux（debian） 系统

#### 安装zstd
```bash
sudo apt update
sudo apt install zstd
```

 > 注意：debian10镜像源腾讯已不在维护，想要安装zstd，需要先将镜像源替换为腾讯云归档镜像（专为旧版 Debian 保留）
 
 ```bash
 #修改 /etc/apt/sources.list 文件替换为以下内容
 deb http://mirrors.tencent.com/debian-archive/debian/ buster main non-free contrib
 deb-src http://mirrors.tencent.com/debian-archive/debian/ buster main non-free contrib
 deb http://mirrors.tencent.com/debian-archive/debian-security/ buster/updates main
 deb-src http://mirrors.tencent.com/debian-archive/debian-security/ buster/updates main
 deb http://mirrors.tencent.com/debian-archive/debian/ buster-updates main non-free contrib
 deb-src http://mirrors.tencent.com/debian-archive/debian/ buster-updates main non-free contrib
 
 # 强制更新源
 sudo apt clean          # 清理旧缓存
 sudo apt update --fix-missing
 
 #重新安装zstd
 sudo apt install zstd
 ```


#### 安装php扩展

```bash
#1.安装依赖
sudo apt-get install libzstd-dev

#2.编译安装PHP扩展
pecl install zstd
#3.启用扩展：
#创建配置文件：
echo "extension=zstd" | sudo tee /etc/php/7.3/mods-available/zstd.ini
#创建符号链接
sudo ln -s /etc/php/7.3/mods-available/zstd.ini /etc/php/7.3/cli/conf.d/20-zstd.ini
sudo ln -s /etc/php/7.3/mods-available/zstd.ini /etc/php/7.3/fpm/conf.d/20-zstd.ini
#重启服务
sudo systemctl restart nginx 或 sudo systemctl restart php7.3-fpm
#检查是否安装成功
php -m | grep zstd  # 应该输出 zstd
```


## zstd与zip压缩的差异

|特性|zip	|zstd	|
|--|--	|--	|
|文件结构|归档格式（多个文件+目录结构）	|单一压缩数据流	|
|直接修改文件|✅ 支持（添加/删除/更新文件）	|❌ 不支持	|
|压缩算法|多算法支持（Deflate等）	|单一高效算法	|
|扩展名|.zip	|.zst, .zstd	|
|压缩级别|0-9	| 1-19	|


## zstd与zip压缩性能对比

### 文件压缩测试

**压缩级别1**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_1.png)

**压缩级别3**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_3.png)

**压缩级别9**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_9.png)

### 目录压缩测试

**压缩级别1**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_dir_1.png)

**压缩级别3**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_dir_3.png)

**压缩级别9**
![](https://web-ext-storage.dcloud.net.cn/doc/zstd/test_dir_9.png)

### 时间对比

> 带宽上行速度为800kb/s

|类型	|压缩后包大小(MB)	|HBuilderX压缩耗时(s)	|上传耗时(s)	|服务器写入配置耗时(s)			|打包机解压耗时	|总耗时(s)	|
|--		|--					|--						|--			|--								|--				|--			|
|zip	|40.01				|4.68					|51.21		|0.41（zip可直接写入无需解压）	|0.46			|56.76		|
|zstd	|34.66				|1.24					|44.36		|1.43(需要先解压写入配置再压缩)	|0.13			|47.16		|


### 结论
通过上述测试对比得出:
1. 正常级别（1-9级）下，zstd比zip压缩和解压都要快很多，CPU和内存占用率也低很多。
2. 以40M左右的压缩包做测试，zstd比zip整个打包流程缩短了9.6s左右


## zstd 对现有wgt包压缩率测试

>各个范围的wgt包取样，解压后使用zstd重新压缩，并根据压缩后的大小取平均值

|wgt包大小范围	|取样数量	|取样平均wgt包大小	|平均原包大小	|平均zstd包大小	|平均zip压缩率	|平均zstd压缩率	|压缩率差异	|
|--				|--			|--					|--				|--				|--				|--				|--			|
|20M以下			|100个		|19.26M				|30.12M			|16.91M			|63.94%			|56.15%			|7.79%		|
|20-40M			|100个		|38.89M				|60.11M			|34.65M			|64.7%			|57.65%			|7.05%		|
|40-60M			|52个		|49.29M				|83.13M			|43.82M			|59.29%			|52.72%			|6.57%		|
|60-80M			|37个		|67.86M				|90.78M			|62.9M			|74.76%			|69.29%			|5.47%		|
|80-100M		|20个		|88.83M				|122M			|83.28M			|72.81%			|68.26%			|4.55%		|
|100-200M		|23个		|126.61M			|192.85M		|117.32M		|65.65%			|60.83%			|4.82%		|
|200M以上		|3个		|283.93M			|293.04M		|278.08M		|96.89%			|94.9%			|1.99%		|


## php zstd扩展的使用方法

### 压缩目录
```php
function zstdCompressPath($path, $outPath) {
	// 获取所有文件路径
	$files = [];
	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator($path, RecursiveDirectoryIterator::SKIP_DOTS)
	);

	foreach ($iterator as $file) {
		if ($file->isFile()) {
			$files[] = $file->getPathname();
		}
	}

	// 创建压缩数据
	$archiveData = '';
	foreach ($files as $file) {
		$relativePath = substr($file, strlen($path) + 1);
		$content = file_get_contents($file);
		$archiveData .= pack('V', strlen($relativePath)) . $relativePath;
		$archiveData .= pack('V', strlen($content)) . $content;
	}
	// ZSTD 压缩
	$compressed = zstd_compress($archiveData, 9);
	return file_put_contents($outPath, $compressed);
}
zstdCompressPath('/srv/a', '/srv/a.zst');
```

### php + zstd 处理大文件分块压缩的方法

```php
function compress_large_file(string $source, string $dest, int $chunkSize = 10485760) {
    $handle = fopen($source, 'rb');
    $zstd = fopen($dest, 'wb');
    
    while (!feof($handle)) {
        $chunk = fread($handle, $chunkSize);
        $compressed = zstd_compress($chunk, 3);
        fwrite($zstd, pack('V', strlen($compressed))); // 写入块长度
        fwrite($zstd, $compressed);
    }
    
    fclose($handle);
    fclose($zstd);
}
```



## 注意事项

### 服务端可能无法解压客户端传上来的压缩包

1. ide想要升级`zstd`版本，需要提前通知服务端，确保服务端使用相同或更高版本的 `zstd` 解压，因为低版本可能无法解压高版本压缩的文件。
2. ide需要与服务端协商使用相同的压缩级别，压缩级别不同可能导致打包体积发生变化，导致计费误差。

### 通过zstd压缩文件时会删除源文件

`zstd`压缩文件时默认会删除原文件，如果想要保留原文件，需要指定参数`-k`

### zstd压缩不支持直接压缩目录

`zstd` 本身不支持直接压缩目录，但可以通过以下方法实现

```bash
# 方法1：使用 tar + zstd (推荐)
tar -cf - 目录名 | zstd -T0 -o 目录名.tar.zst


# 方法2：使用 zstd 的文件列表功能
# 创建文件列表
find 目录名 -type f > files.txt
# 压缩整个目录
zstd -r --filelist files.txt -o 目录名.zst
```


### 在服务器使用zstd压缩不适宜设置太高级别

经测试，`zstd`高级别压缩会导致压缩时间和CPU使用率呈指数级增长，例如使用级别3，压缩248M的文件（随机内容的txt文件）耗时仅需0.5s左右，CPU使用率仅为0.2%左右，而使用级别19，耗时长达100s左右，CPU使用率高达12.8%左右，而压缩后的文件大小几乎没有变化(可能是因为达到了txt文本的压缩上限)。
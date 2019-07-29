### 下载代码

    git clone https://github.com/yuzhiyi/BingWallpaper.git（如果没有安装git，也可直接下载项目zip包）
    cd BingWallpaper
    npm install

### 项目配置
所有配置项均在 config/index.js文件中

```
    // 配置文件
    module.exports = {
        DAILYSENDDATE: '0 0 8 * * *', // 定时获取最新壁纸时间，规则见 /schedule/index.js
        SENDDATE: '10 0 * * * *', // 定时更换壁纸时间，规则见 /schedule/index.js
        OVERDAYS: 10 // 删除超过 OVERDAYS 天的文件
    }
```

### 执行

在命令行界面输入 `npm start`

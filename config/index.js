// 配置文件
module.exports = {
    DAILYSENDDATE: '0 0 8 * * *', // 定时获取最新壁纸时间，规则见 /schedule/index.js
    SENDDATE: '10 0 * * * *', // 定时更换壁纸时间，规则见 /schedule/index.js
    OVERDAYS: 10 // 删除超过 OVERDAYS 天的文件
}

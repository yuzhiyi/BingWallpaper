// 配置文件
module.exports = {
    DAILYSENDDATE: '0 0 8 * * *', // 定时获取最新壁纸时间，规则见 /schedule/index.js
    SENDDATE: '10 * * * * *', // 定时更换壁纸时间，规则见 /schedule/index.js
    OVERDAYS: 10 // 删除超过时间 OVERDAYS 的文件
}

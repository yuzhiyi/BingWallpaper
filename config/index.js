// 配置文件
module.exports = {
    DAILYSENDDATE: '0 0 8 * * *',
    SENDDATE: '10 * * * * *', //定时请求更换壁纸，规则见 /schedule/index.js
    OVERDAYS: 10 // 删除超过时间OVERDAYS的文件
}

const request = require("request");
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const utils = require('./utils/index');
const config = require('./config/index');
const schedule = require('./schedule/index');

const bing_url = "https://www.bing.com";
const filePath = './bing_image';

let bingSetUpImages = [];

function requestBingImage({index = 0, perpage = 10}) {
    request.get(`http://cn.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=${perpage}&mkt=zh-CN`, async function (error, response, body) {
        if (error) {
            return;
        }
        const data = JSON.parse(body);
        const images = data.images;
        if (!images || images.length === 0) {
        } else {
            const isExistFile = fs.existsSync(filePath);
            if (!isExistFile) {
                fs.mkdirSync(filePath);
            }
            let url, image, fileName, imagePath, isExistImage;
            for (let i = 0, length = images.length; i < length; i++) {
                image = images[i];
                url = bing_url + image.url;
                fileName = image.startdate + '.jpg';
                imagePath = path.join(filePath, fileName);
                isExistImage = fs.existsSync(imagePath);
                if (!isExistImage) {
                    try {
                        await utils.saveFile(imagePath, url);
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    return;
                }
            }
        }
    });
}

function initRequestBingImage() { // 获取bing图片
    const isExistFile = fs.existsSync(filePath);
    if (!isExistFile) {
        fs.mkdirSync(filePath);
    }
    const files = fs.readdirSync(filePath);
    if (files && files.length === 0) {
        requestBingImage({index: 0, perpage: 10});
    }
}

function initRequestDailyBingImageSchedule() { // 获取每日最新bing图片并删除旧的图片
    schedule.setSchedule(config.DAILYSENDDATE, () => {
        const nowDay = moment();
        const nowDayFormat = nowDay.format('YYYYMMDD');
        const fileName = nowDayFormat + '.jpg';
        const imagePath = path.join(filePath, fileName);
        const isExistTodayImage = fs.existsSync(imagePath);
        if (!isExistTodayImage) {
            requestBingImage({index: 0, perpage: 10});
        }
        const bingImages = fs.readdirSync(filePath);
        let overDays;
        for (let row of bingImages) {
            overDays = Math.abs(moment(row.split('.')[0]).diff(nowDay, 'days'));
            if (overDays > config.OVERDAYS) {
                fs.unlink(path.join(filePath, row), () => {
                    console.log('删除旧图片成功！');
                });
            }
        }
    });
}

function initSetDesktopSchedule() {
    schedule.setSchedule(config.SENDDATE, () => {
        const bingImages = fs.readdirSync(filePath);
        let isSetUp, absolutePath, isAllSetUp = true, imagePath, isExistImage;
        let length = bingImages.length, bingImage;
        for (let i =  length - 1; i >= 0; i--) {
            bingImage = bingImages[i];
            isSetUp = bingSetUpImages.includes(bingImage);
            if (!isSetUp) {
                imagePath = path.join(filePath, bingImage);
                isExistImage = fs.existsSync(imagePath);
                if (isExistImage) {
                    bingSetUpImages.push(bingImage);
                    absolutePath = __dirname + '/' + path.join(filePath, bingImage);
                    setDesktopBackground(absolutePath);
                    isAllSetUp = false;
                    break;
                }
            }
        }
        if (isAllSetUp) {
            bingSetUpImages = [];
        }
    });
}

async function setDesktopBackground(absolutePath) {
    try {
        const cmd = `gsettings set org.gnome.desktop.background picture-uri 'file://${absolutePath}'`;
        await utils.execCmd(cmd);
        console.log('设置壁纸成功！');
    } catch (e) {
        console.log(e);
        console.log('设置壁纸失败！');
    }
}

initRequestBingImage();
initRequestDailyBingImageSchedule();
initSetDesktopSchedule();

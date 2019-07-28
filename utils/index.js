const fs = require("fs");
const request = require("request");
const process = require('child_process');

function saveFile(filePath, fileUrl) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        request(fileUrl).pipe(writeStream);
        writeStream.on('open', (fd) => {
        });
        writeStream.on('finish', () => {
            resolve();
        });
        writeStream.on('close', () => {
        });
        writeStream.on('error', (err) => {
            reject(err);
        });
    });
}

function execCmd(cmd) {
    return new Promise((resolve, reject) => {
        process.exec(cmd, function (error, stdout, stderr) {
            if (error !== null) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    saveFile,
    execCmd
};
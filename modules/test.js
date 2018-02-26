/**
 * Created by xiaohe on 2018/2/25.
 */
//这个文档没啥用，忽略就行；
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var option = {
    hostname: 'www.zhuishu.tw',
    port: 443,
    path: '/id48783/',
    method: 'GET'
};
var buffer = new BufferHelper();
request(option, function (res) {
    res.on('data', function (data) {
        buffer.concat(data);
    });
    res.on('end', function () {
        console.log('请求结束');
        var $ = cheerio.load(buffer.toBuffer());
        console.log($('#list').text());
        fs.writeFile('./book/xxx.txt', $('#list').text(), 'utf-8');
    })
}).on('error', function () {
    console.log('我可能出错了')
}).end();
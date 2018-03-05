/**
 * Created by xiaohe on 2018/2/19.
 */
//导入基本信息
var book = require('../book.config');
var request = require('https');
if (book.url.split('://')[0] === 'http') {
    request = require('http');
}
var cheerio = require('cheerio');
var fs = require('fs');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');

var buffer = new BufferHelper();
(function getList() {
    request.get(book.url, function (res, req) {
        console.log(res.statusCode);
        switch (res.statusCode) {
            case 200:
                res.on('data', function (data) {
                    console.log('正在读取目录');
                    buffer.concat(data);
                });
                res.on('end', function () {
                    console.log('正在写入目录');
                    var ListData = iconv.decode(buffer.toBuffer(), 'gb2312');
                    List(ListData);
                });
                break;
            default:
                console.log('出错了', res.statusCode, '开始进行重新连接');
                getList();
                break;
        }
        ;

    }).on('error', function () {
        setTimeout(function () {
            console.warn('完蛋了', '开始进行重新连接');
            getList();
        }, 2000)
    })
})()

function List(data) {
    this.data = data;
    this.list = [];
    var $ = cheerio.load(this.data);
    var list = $(book.listDom);
    for (let i = 0; i < list.length; i++) {
        this.list.push('{' + '"name":' + '"' + list.eq(i).text() + '",'
            + '"url":' + '"' + book.href + list.eq(i).attr('href') + '"' + '}')
    }
    var result = '{' + '"result":' + '[' + this.list + ']' + '}';
    fs.writeFile("./data/" + book.name + ".json", '\ufeff' + result, "utf-8");
    console.log('写入完成')
}
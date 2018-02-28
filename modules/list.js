/**
 * Created by xiaohe on 2018/2/19.
 */
var https = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
//导入基本信息
var book = require('../book.config');
https.get(book.url, function (res,req) {
    var buffer = new BufferHelper();
    res.on('data', function (data) {
        console.log('正在读取目录');
        buffer.concat(data);
    });
    res.on('end', function () {
        console.log('正在写入目录');
        var ListData = iconv.decode(buffer.toBuffer(), 'gb2312');
        List(ListData);
    });
}).on('error', function () {
    console.warn('完蛋了')
})

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
    fs.writeFile("./data/list.json", '\ufeff' + result, "utf-8");
    console.log('写入完成')
}
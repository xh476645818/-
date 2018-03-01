/**
 * Created by xiaohe on 2018/2/25.
 */
//这个文档没啥用，忽略就行。。。
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var option = {
    hostname: 'www.zhuishu.tw',
    port: 443,
    path: '/id48783/2',
    method: 'GET'
};
fs.mkdir(' D:\\work\',0777,function (err2) {  })

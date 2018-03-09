/**
 * Created by xiaohe on 2018/2/25.
 */
//这个文档没啥用，忽略就行。。。
var http = require('http');
var book = require('../book.config');
var fs = require('fs');
var app = http.createServer();
app.on('request',function (req,res) {
    console.log(req)
})
app.listen(8866,'192.168.94.164',function () {
    console.log('启动了')
})
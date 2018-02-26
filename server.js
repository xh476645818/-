/**
 * Created by xiaohe on 2018/2/7.
 */
var express = require('express');
var path = require('path');
var app = express();
var staticPath = express.static(path.join(__dirname, '/'));
app.use(staticPath);
app.get('/1', function (req, res) {
    console.log(req.connection.remoteAddress)
    res.sendFile(path.join(__dirname, './index.html'))
})
app.get('/2', function (req, res) {
    res.sendFile(path.join(__dirname, './index2.html'))
})
app.get('/3', function (req, res) {
    res.sendFile(path.join(__dirname, './indexBase.html'))
})
var port = 8025;
var server = app.listen(port, '192.168.94.78', function (error) {
    if (error) {
        console.error(error)
    } else {
        console.info('===>服务器启动成功，端口号 <===', server.address().address, server.address().port)
    }
})

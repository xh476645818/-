/**
 * Created by xiaohe on 2018/2/19.
 */
//导入基本信息
var book = require('../book.config');
//判断目标路径是http或是https
var request = require('https');
/*if (book.url.split('://')[0] === 'http') {
    request = require('http');
};*/
//fs node中的文件系统
var fs = require('fs');
//dom结构获取
var cheerio = require('cheerio');
//buffer的第三方，使buffer更好用
var BufferHelper = require('bufferhelper');
//解决中文乱码问题 gb2312等
var iconv = require('iconv-lite');

//实例化buffer类;
var buffer = new BufferHelper();
(function getList() {
    request.get('https://item.taobao.com/item.htm?spm=a217x.7278581.1998907512-2.1.500f7ff7oV4ehh&id=528741791811&scm=13003.297.528741791811.9592bc7e5f4a1a561b40a38b7371cca6', function (res, req) {
        console.log(res.statusCode);
        switch (res.statusCode) {
            case 200:
                res.on('data', function (data) {
                    console.log('正在读取目录');
                    buffer.concat(data);
                    console.log(data);
                });
                res.on('end', function () {
                    console.log('正在写入目录');
                    var ListData = iconv.decode(buffer.toBuffer(), 'gb2312');
                    console.log(ListData)
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

//读取列表的方法
function List(data) {
    this.data = data;
    this.list = [];
    var $ = cheerio.load(this.data);
    var list = $("html");
    fs.writeFile("./data/taobao"  + ".html", '\ufeff' + list, "utf-8");
    console.log('写入完成')
}
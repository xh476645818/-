/**
 * Created by xiaohe on 2018/2/19.
 */
//导入基本信息
var book = require('../book.config.js');
//判断目标路径是http或是https
var request = require('https');
if (book.url.split('://')[0] === 'http') {
    request = require('http');
}
//fs node中的文件系统
var fs = require('fs');
//dom结构获取
var cheerio = require('cheerio');
//buffer的第三方，使buffer更好用
var BufferHelper = require('bufferhelper');
//解决中文乱码问题 gb2312等
var iconv = require('iconv-lite');

var resultBook = '';
fs.readFile('./data/' + book.name + '.json', 'utf-8', function (err, data) {
    this.data = data.trim();
    this.data = JSON.parse(this.data);
    //
    var bookList = this.data.result;
    console.log(bookList);
    //判断是否存在book文件夹
    fs.stat('book', function (err, stats) {
        //如果报错了，就建一个book
        if (err) {
            fs.mkdirSync('book');
        }
    });
    GetUrl(book.index,bookList)
});
var buffer = new BufferHelper();
//chreeio声明用;
var $;
var timerIndex = 0;
function GetUrl(index,bookList) {
    console.log(index,'代表被调用')
    if (index >= bookList.length) {
        console.log('写入完毕，请在book文件夹下查阅');
        return true;
    }
    ;
    var requestObjdect = request.get(bookList[index].url, function (res) {
        console.log('请求状态', res.statusCode);
        switch (res.statusCode) {
            case 200:
                res.on('data', function (data) {
                    //进行了一次buffer拼接
                    // console.log('正在读取', index)
                    buffer.concat(data);
                });
                res.on('end', function () {
                    //buffer对中文的转译
                    var BookData = iconv.decode(buffer.toBuffer(), book.charset);
                    $ = cheerio.load(BookData, {
                        withDomLvl1: true,
                        normalizeWhitespace: false,
                        xmlMode: false,
                        decodeEntities: true
                    });
                    this.bookname = '\uFEFF' + $(book.artTitle).eq(index - book.index).text().trim() + '\n';
                    this.content = '\uFEFF' + $(book.artContent).eq(index - book.index).text().replace(/[\s\r\n\b]/g, "") + '\n';
                    console.log('正在写入', index, this.bookname);
                    resultBook += this.bookname + this.content;
                    fs.writeFileSync('./book/' + book.name + '.txt', resultBook, 'utf-8')
                    index++;
                    GetUrl(index,bookList);
                });
                break;
            default:
                if (timerIndex >= 5) {
                    timerIndex = 0;
                    requestObjdect.on('close', function () {
                        console.log('关闭请求');
                    });
                    return;
                }
                timerIndex++
                clearTimeout(timer)
                var timer = setTimeout(function () {
                    console.log('状态吗出错', res.statusCode, '5s后开始进行第', timerIndex, '次重新连接');
                    GetUrl(index,bookList);
                }, 5000)
                break;
        }
        ;
    });
    requestObjdect.on('error', function () {
        if (timerIndex >= 5) {
            timerIndex = 0;
            requestObjdect.on('close', function () {
                console.log('关闭请求');
            });
            return;
        }
        setTimeout(function () {
            console.log('出错了', index, '5s后开始进行第', timerIndex, '次重新连接');
            GetUrl(index,bookList);
        }, 5000)

    });

}

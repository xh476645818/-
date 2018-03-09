/**
 * Created by xiaohe on 2018/2/19.
 */
var book = require('../book.config.js');
var request = require('https');
if (book.url.split('://')[0] === 'http') {
    request = require('http');
}
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var resultBook = '';
var bookList;
fs.readFile('./data/' + book.name + '.json', 'utf-8', function (err, data) {
    this.data = data.trim();
    this.data = JSON.parse(this.data);
    bookList = this.data.result;
    fs.stat('book', function (err, stats) {
        //如果报错了，就建一个book
        if (err) {
            fs.mkdirSync('book');
        }
    });
    GetUrl(book.index)
});
var buffer = new BufferHelper();
//chreeio声明用;
var $;
var timerIndex = 0;

function GetUrl(index) {
    if (index >= bookList.length) {
        console.log('写入完毕，请在book文件夹下查阅');
        return true;
    }
    ;
    var requestObjdect = request.get(bookList[index].url, function (res) {
        // console.log(index + '准备执行');
        // console.log('请求状态', res.statusCode);
        // res.destroy();
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
                    GetUrl(index);
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
                    GetUrl(index);
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
            GetUrl(index);
        }, 5000)

    });

}

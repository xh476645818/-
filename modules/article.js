/**
 * Created by xiaohe on 2018/2/19.
 */
var book = require('../book.config.js');
var request = require('https');
if(book.url.split('://')[0]==='http'){
   request = require('http');
}
var fs = require('fs');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var resultBook = '';
var bookList;
fs.readFile('./data/list.json', 'utf-8', function (err, data) {
    this.data = data.trim();
    this.data = JSON.parse(this.data);
    bookList = this.data.result;
    GetUrl(0)
});
var buffer = new BufferHelper();
//chreeio声明用;
var $;
function GetUrl(index) {
    if (index >= bookList.length) {
        console.log('写入完毕，请在book文件夹下查阅');
        return true;
    }
    request.get(bookList[index].url, function (res, req) {
        res.on('data', function (data) {
            //进行了一次buffer拼接
            buffer.concat(data);
        })
        res.on('end', function () {
            //buffer对中文的转译
            var BookData = iconv.decode(buffer.toBuffer(), 'gb2312');
            $ = cheerio.load(BookData, {
                withDomLvl1: true,
                normalizeWhitespace: false,
                xmlMode: false,
                decodeEntities: true
            });
            this.bookname = '\uFEFF'+  $(book.artTitle).eq(index).text().replace(/[\s\r\n\b]/g, "") + '\n';
            this.content = '\uFEFF' + $(book.artContent).eq(index).text().replace(/[\s\r\n\b]/g, "") + '\n' ;
            console.log('正在写入', this.bookname,index);
            resultBook += this.bookname + this.content;
            fs.writeFileSync('./book/' + book.name + '.txt', resultBook, 'utf-8')
            index++;
            GetUrl(index);
        })
    })

}

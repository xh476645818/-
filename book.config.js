/**
 * Created by xiaohe on 2018/2/24.
 */
const book = {
    'url': 'http://www.uctxt.com/book/5/5632/',//这是小说的目录页
    'href': 'http://www.uctxt.com/book/5/5632/',//这是小说的目录页
    'charset':'gb2312',//字符集支持 UTF-8 或 gb2312
    'name': '修真聊天群',//设定保存的书名
    'listDom': '.chapter-list dd a',//小说列表的内容html结构
    'artTitle': '#BookTitle',//每一篇的标题html结构
    'artContent': '#content',//每一篇的内容html结构
    'index': 736//从某章节索引开始
};
module.exports = book;
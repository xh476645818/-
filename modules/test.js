/**
 * Created by xiaohe on 2018/2/25.
 */
//这个文档没啥用，忽略就行。。。
var express = require('express');
var app =express();
app.get('/',function (req,res) {
    console.log(req)
    console.log(res)
})
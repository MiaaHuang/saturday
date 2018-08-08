const fs = require('fs')
const http = require('http')
const path = require('path')

// 记录根目录
let rootPath = path.join(__dirname,'www')

// 创建服务器
let server = http.createServer((request, response)=>{
    response.setHeader('content-type','text/html;charset=utf-8')
    response.end('今天是个好日子')
})
// 监听
server.listen(80, '127.0.0.1', ()=>{
    console.log('listen success')
})
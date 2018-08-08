const fs = require('fs')
const http = require('http')
const path = require('path')

const mime = require('mime')

// 记录根目录
let rootPath = path.join(__dirname,'www')

// 创建服务器
let server = http.createServer((request, response)=>{
    // 生成完整地址
    let targetPath = path.join(rootPath, request.url)
    // 判断此路径是否存在，若存在就判断是文件还是文件夹，若不存在就报404错误
    // 如果是文件就读取文件并返回，同时设置不同的响应头
    // 如果是文件夹，就读取文件列表并返回，展示一个文件列表页面
    if(fs.existsSync(targetPath)){
        fs.stat(targetPath, (err, stats)=>{
            if(stats.isFile()){
                response.setHeader('content-type',mime.getType(targetPath))
                fs.readFile(targetPath, (err, data)=>{
                    response.end(data)
                })
            }
            if(stats.isDirectory()){
                fs.readdir(targetPath, (err, files)=>{
                    let tem=``
                    for(let i=0; i<files.length; i++){
                        tem += `
                        <li>
                            <a href="${request.url}${request.url=='/'?'':'/'}${files[i]}">
                                ${files[i]}
                            </a>
                        </li>`
                    }
                    response.end(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Document</title>
                    </head>
                    <body>
                        <h1>index of${request.url}</h1>
                        <ul>
                            ${tem}
                        </ul>
                    </body>
                    </html>`)
                        })
                    }
                })
                
            }else{
                // 路径不存在，报404错误，需要设置：状态码，响应头（中文需要），响应体
                response.statusCode = 404;
                response.end(
                    `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Document</title>
                        <style>
                            span{
                                font-weight: bold;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>ERROR 404!</h1>
                        <p>Cannot find <span>${request.url}</span> in this server ! Please Check and retry.</p>
                        <p>找不到此文件<span>${request.url}</span> ! 请检查后重试.</p>
                    </html>`
        )
    }

})
// 监听
server.listen(80, '127.0.0.1', ()=>{
    console.log('listen success')
})
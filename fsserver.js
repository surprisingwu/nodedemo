const http = require('http')
const fs = require('fs')
const parse = require('url').parse
const join = require('path').join
const root = __dirname

// const server = http.createServer((req, res) => {
//     const url = parse(req.url)
//     const path = join(root, url.pathname)
//     let stream = fs.createReadStream(path)
//     stream.on('data', (chunk) => {
//         res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf8' })
//         res.write(chunk)
//     })
//     stream.on('end', () => {
//         res.end()
//     })
// })
// 使用pipe
const server = http.createServer((req, res) => {
    const url = parse(req.url)
    if (url.pathname === '/favicon.ico') {
        res.end('NO ICON')
        return
    }
    const path = join(root, url.pathname)
    fs.stat(path, (err, stat) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404
                res.end('NOT FOUND')
            } else {
                res.statusCode = 500
                res.end('Internal Server Err')
            }
        }
        res.setHeader('Content-Length', stat.size)
        let stream = fs.createReadStream(path)
        res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf8' })
            // 从文件读到的数据，都输出到res上
        stream.pipe(res)
        stream.on('erroe', (err) => {
            res.statusCode = 4500
            res.end('Interval server error')
        })
    })

})
server.listen(8887, '127.0.0.1', () => {
    console.log('server is listen at localhost:8888')
})
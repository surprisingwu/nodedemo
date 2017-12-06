const http = require('http')
const url = require('url')
let items = []

const server = http.createServer((req, res) => {
    switch (req.method) {
        case 'POST':
            let item = ''
            req.setEncoding('utf-8')
            req.on('data', (chunk) => {
                item += chunk
            })
            req.on('end', () => {
                items.push(item)
                res.end('ok\n')
            })
            break
        case 'GET':
            let body = items.map((item, index) => {
                return index + ')' + item
            }).join('\n')
            res.setHeader('Content-Type', Buffer.byteLength(body))
            res.setHeader('Content-Type', 'text/plain;charset="utf-8"')
            res.end(body)
            break
        case 'DELETE':
            let path = url.parse(req.url).pathname
            const i = parseInt(path, 10)
            if (isNaN(i)) {
                res.statusCode = 400
                res.end('Invalid item id')
            } else if (!items[i]) {
                res.statusCode = 404
                res.end('item is not found')
            } else {
                res.statusCode = 200
                items.splice(i, 1)
                res.end('ok\n')
            }
    }
})

// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/plain')
//     res.statusCode = 200
//     res.write('hello world')
//     res.end()
// })
server.listen(8888, () => {
    console.log('Server is listen at localhost:8888')
})
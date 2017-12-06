const http = require('http')
const qs = require('querystring')
let items = []

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("X-Powered-By", '3.2.1')
    if ('/' === req.url) {
        switch (req.method) {
            case 'GET':
                show(res)
                break
            case 'POST':
                add(req, res)
                break
            default:
                badRequest(res)
        }
    } else {
        notFound(res)
    }
})

server.listen(8886, '127.0.0.1', () => {
    console.log('Server is listen localhost:8886')
})

function show(res) {
    // {data:items}
    let data = JSON.stringify({ "data": items })
    res.setHeader('Content-Length', Buffer.byteLength(data))
    res.writeHead(200, { 'Content-Type': 'text/json;charset=utf8' })
    res.end(data)
}

function badRequest(res) {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('Bad Request')
}

function add(req, res) {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
        body += chunk
    })
    req.on('end', () => {
        const obj = qs.parse(body)
        items.push(obj.item)
        show(res)
    })
}
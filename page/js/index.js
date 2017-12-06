window.onload = function() {
    const URL = 'http://localhost:8886'
    reqestMeg('GET', URL)
    document.getElementById('btn').onclick = function() {
        const input = document.getElementById('iput')
        const val = input.value
        if (!val) return
        reqestMeg('POST', URL, val)
        input.value = ''
    }

    function reqestMeg(type, url, data) {
        const XHR = new XMLHttpRequest()
        XHR.onreadystatechange = function() {
            if (XHR.status === 200 && XHR.readyState === 4) {
                handleMesg(XHR.responseText)
            }
        }
        XHR.open(type, url)
        if (type === "POST") {
            XHR.setRequestHeader('Content-Type', 'text/plain')
            XHR.send('item=' + data)
        } else {
            XHR.send(null)
        }
    }

    function handleMesg(data) {
        data = JSON.parse(data).data
        let lis = ''
        if (data) {
            data.forEach(item => {
                lis += '<li>' + item + '</li>'
            });
        }
        document.getElementById('listWrapper').innerHTML = lis
    }
}
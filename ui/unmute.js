function PersonCreate(entry, callback) {
    var xhr = new XMLHttpRequest()
    var url = '/fn/IdentifyAuthor/PersonCreate'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText)
        }
    }
    var data = JSON.stringify(entry)
    xhr.send(data)
}

function ArticleCreate(entry, callback) {
    var xhr = new XMLHttpRequest()
    var url = '/fn/Publish/ArticleCreate'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText)
        }
    }
    var data = JSON.stringify(entry)
    xhr.send(data)
}

function ArticleRead(params, callback) {
    var xhr = new XMLHttpRequest()
    var url = '/fn/Publish/ArticleRead'
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(xhr.responseText)
        }
    }
    var data = JSON.stringify(params)
    xhr.send(data)
}

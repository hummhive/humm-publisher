function CreatePost(entry, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/CreatePost'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(entry)
  xhr.send(data)
}

function DeletePost(entry, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/DeletePost'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(entry)
  xhr.send(data)
}

function GetPost(hash, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/GetPost'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(hash)
  xhr.send(data)
}

function GetPostsByStatus(entry, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/GetPostsByStatus'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(entry)
  xhr.send(data)
}

function GetPublicPosts(entry, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/GetPublicPosts'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(entry)
  xhr.send(data)
}

function EditPost(entry, callback) {
  var xhr = new XMLHttpRequest()
  var url = '../fn/Posts/EditPost'
  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText))
    }
  }
  var data = JSON.stringify(entry)
  xhr.send(data)
}

// =============================================================================
// Posts Controller
// =============================================================================

// Load the posts
// =============================================================================

// This callback loads at the very beggining in order to load the default values
GetPostsByStatus(status, function(obj) {

  if(obj.length === 0)
  return;

  //Sort Timestamps by Newest
  obj = obj.sort(function(a,b){
    caseA = new Date(a.timestamp)
    caseB = new Date(b.timestamp)
    return caseA < caseB
  })

  // Populate the sidebar
  var postSidebar = obj.map((post, index) => {
    if (index == 0) {
      return `<a id="${post.hash}" href="#"
      class="list-group-item list-group-item-action align-items-start active">
      <h5 class="mb-1">${post.title}</h5><small>${moment(post.timestamp).format('MMMM D, YYYY [at] h:mm A z')}</small>
      </a>`;
    } else {
      return `<a id="${post.hash}" href="#"
      class="list-group-item list-group-item-action align-items-start">
      <h5 class="mb-1">${post.title}</h5><small>${moment(post.timestamp).format('MMMM D, YYYY [at] h:mm A z')}</small>
      </a>`;
    }
  }).join('');

  /* Since the first option is going to be the one shown by default,
  we grab this one.*/
  var postTitle = obj[0].title;
  var postBody = obj[0].content;

  // Append the content to the Sidebar and Content
  document.getElementById('post-list').insertAdjacentHTML('beforeend', postSidebar)
  document.getElementById('thePost-title').innerHTML = postTitle;
  document.getElementById('thePost-body').innerHTML = postBody;

  showPostActions();

  /* This variable is going to hold the dynamic elements inserted in the sidebar
  in order to attach the addEventListener to each one*/
  var postsItems = document.getElementsByClassName("list-group-item");

  /* Attaching the addEventListener here allow us to append it to every element
  in the sidebar.*/
  Array.from(postsItems).forEach(function(element) {
    element.addEventListener('click', RefreshPosts);
  });
})

/*
The primary purpose of this function is to load a new post upon clicking one of
the elements in the sidebar
*/
function RefreshPosts(event) {
  dissmissNotification();

  GetPostsByStatus(status, function(obj) {

    var postContent = obj.filter(val => {
      return val.hash === this.getAttribute('id');
    });

    var removeActiveElement = document.querySelector(".list-group-item.active");

    // Check if it wasn't removed by removeDeletedEntryFromList()
    if (removeActiveElement)
    removeActiveElement.classList.remove("active");

    var getActiveElement = document.getElementById(this.getAttribute('id'))
    getActiveElement.classList.add("active");

    document.getElementById('thePost-title').innerHTML = postContent[0].title;
    document.getElementById('thePost-body').innerHTML = postContent[0].content;

    showPostActions();

  }.bind(this));
}

/*
Delete Post
*/

function RemovePost() {
  var activePost = document.querySelector(".list-group-item.active").getAttribute('id')

  DeletePost({
    hash: activePost,
    status: status
  }, function (deletedHash) {
    notify('success', 'Post Deleted.');
    hidePostActions();
    clearContentView();
    removeDeletedEntryFromList(activePost);
  });
}

/*
Edit Post
*/

function EditPost() {
  var activePost = document.querySelector(".list-group-item.active").getAttribute('id')
  window.location = '/editor?update=' + encodeURI(activePost);
}

function dissmissNotification() {
  var el = document.getElementById('notice');
  el.innerHTML = '';
  el.className = 'alert';
  el.style.display = 'none';
}

function notify(status, message){
  var el = document.getElementById('notice');
  el.innerHTML = message;
  el.classList.add('alert-' + status);
  el.style.display = 'block';
}

function showPostActions() {
  document.getElementById('post-actions').style.display = 'block';
}

function hidePostActions() {
  document.getElementById('post-actions').style.display = 'none';
}

function clearContentView() {
  document.getElementById('thePost-title').innerHTML = '';
  document.getElementById('thePost-body').innerHTML = 'No post selected. Select one from the sidebar menu.';
}

function removeDeletedEntryFromList(id) {
  var el = document.getElementById(id);
  el.parentNode.removeChild(el);
}

// =============================================================================
// Drafts Controller
// =============================================================================


// init Quill editor
// =============================================================================

var quill = new Quill('#quill', {
  modules: { toolbar: false },
  theme: 'bubble',
  readOnly: true
});

// Load them posts
// =============================================================================

// This callback loads at the very beggining in order to load the default values
GetDrafts(function(obj) {

  // Populate the sidebar
  var postSidebar = obj.map((post, index) => {
    if (index == 0) {
      return `<a id="${post.Hash}" href="#"
                class="list-group-item list-group-item-action flex-column align-items-start active">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${post.Entry.title}</h5><small>${post.Entry.pubdate}</small>
                </div></a>`;
    } else {
      return `<a id="${post.Hash}" href="#"
                class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">${post.Entry.title}</h5><small>${post.Entry.pubdate}</small>
                </div></a>`;
    }
  }).join('');

  /* Since the first option is going to be the one shown by default,
  we grab this one.*/
  var postContent = obj[0].Entry.content;

  // Append the content to the Sidebar and Content
  document.getElementById('post-list').insertAdjacentHTML('beforeend', postSidebar)
  quill.setContents(JSON.parse(postContent));

  /* This variable is going to hold the dynamic elements inserted in the sidebar
   in order to attach the addEventListener to each one*/
  var postsItems = document.getElementsByClassName("list-group-item");

  /* Attaching the addEventListener here allow us to append it to every element
  in the sidebar.*/
  Array.from(postsItems).forEach(function(element) {
    element.addEventListener('click', RefreshDrafts);
  });
})

/*
The primary purpose of this function is to load a new draft upon clicking one of
the elements in the sidebar
*/
function RefreshDrafts(event) {
  GetDrafts(function(obj) {

    let postContent = obj.filter(val => {
      return val.Hash === event.target.offsetParent.getAttribute('id');
    });

    var removeActiveElement = document.querySelector(".list-group-item.active");
    removeActiveElement.classList.remove("active");

    var getActiveElement = document.getElementById(event.target.offsetParent.getAttribute('id'))
    getActiveElement.classList.add("active");

    quill.setContents(JSON.parse(postContent[0].Entry.content));
  });
}
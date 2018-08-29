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

// Load the posts
// =============================================================================

// This callback loads at the very beggining in order to load the default values
GetDrafts(function(obj) {

  if(obj.length === 0)
  return;

  //Sort Timestamps by Newest
  obj = obj.sort(function(a,b){
    caseA = new Date(a.Entry.pubdate)
    caseB = new Date(b.Entry.pubdate)
    return caseA < caseB
  })

  // Populate the sidebar
  var postSidebar = obj.map((post, index) => {
    if (index == 0) {
      return `<a id="${post.Hash}" href="#"
                class="list-group-item list-group-item-action align-items-start active">
                  <h5 class="mb-1">${post.Entry.title}</h5><small>${moment(post.Entry.pubdate).format('MMMM D, YYYY [at] h:mm A z')}</small>
              </a>`;
    } else {
      return `<a id="${post.Hash}" href="#"
                class="list-group-item list-group-item-action align-items-start">
                  <h5 class="mb-1">${post.Entry.title}</h5><small>${moment(post.Entry.pubdate).format('MMMM D, YYYY [at] h:mm A z')}</small>
              </a>`;
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

    var postContent = obj.filter(val => {
      return val.Hash === this.getAttribute('id');
    });

    var removeActiveElement = document.querySelector(".list-group-item.active");
    removeActiveElement.classList.remove("active");

    var getActiveElement = document.getElementById(this.getAttribute('id'))
    getActiveElement.classList.add("active");

    quill.setContents(JSON.parse(postContent[0].Entry.content));
  }.bind(this));
}

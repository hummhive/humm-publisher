// Startup
// =============================================================================

var editor = new MediumEditor('#editor', {
  disableExtraSpaces: true,
  anchor: { targetCheckbox: true }
});

// action buttons
var btnSaveDraft = document.getElementById("saveDraft");
var btnPublish = document.getElementById("publishPost");

init();

// Functions
// =============================================================================

function init() {
  if(getParameterByName('update')){
    // Context is editing a post
    setUpPostEditing();
    messages();
  } else {
    // Context is creating a post
    setupPostCreation();
  }
}

/* This is a dummy function in order to display messages upon creating
new posts, mostly a fallback solution for vanilla Javascript */

function messages(){
  switch (getParameterByName('status')) {
    case "publish":
    return notify('success', 'Post Published!');
    case "draft":
    return notify('success', 'Post has been saved as draft.');
  }
}

// Get query string parameter by name
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Tell the user what's going on
function notify(status, message){
  var el = document.getElementById('notice')
  el.innerHTML = message;
  el.classList.add('alert-' + status);
  el.style.display = "block";
}

// Set ups the page to create a post
function setupPostCreation() {
  btnSaveDraft.addEventListener("click", function(event) {
    event.preventDefault();

    CreatePost({
      title: document.getElementById('title').value,
      content: editor.getContent(),
      status: "draft"
    }, function (hashOfNewPost) {
      window.location = '?update=' + encodeURI(hashOfNewPost) + '&status=draft';
    });
  });

  btnPublish.addEventListener("click", function(event) {
    event.preventDefault();

    CreatePost({
      title: document.getElementById('title').value,
      content: editor.getContent(),
      status: "publish"
    }, function (hashOfNewPost) {
      window.location = '?update=' + encodeURI(hashOfNewPost) + '&status=publish';
    });
  });
}

// Set ups the page to edit a post
function setUpPostEditing() {
  // Get the post to edit
  GetPost(getParameterByName('update'), function(post) {
    if(post === null)
    return;

    // Set up the editor
    document.getElementById('title').value = post.title;
    editor.setContent(post.content);
  });

  // Set up the actions for save as draft and publish
  btnSaveDraft.addEventListener("click", function(event) {
    event.preventDefault();

    EditPost({
      hash: getParameterByName('update'),
      title: document.getElementById('title').value,
      content: editor.getContent(),
      status: "draft"
    }, function (hashOfNewPost) {
      notify('success', 'Post has been saved as draft.');
    });
  });

  btnPublish.addEventListener("click", function(event) {
    event.preventDefault();

    EditPost({
      hash: getParameterByName('update'),
      title: document.getElementById('title').value,
      content: editor.getContent(),
      status: "publish"
    }, function (hashOfNewPost) {
      notify('success', 'Post Published!');
    });
  });
}

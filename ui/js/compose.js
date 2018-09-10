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
  if(getParameterByName('entry')){
    // Context is editing a post
    setUpPostEditing();
  } else {
    // Context is creating a post
    setupPostCreation();
  }
}

// Get query string parameter by name
function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Tell the user what's going on
function notify(type, message){
  var el = document.getElementById('notice')
  el.innerHTML = message;
  el.classList.add('alert-' + type);
  el.style.display = "block";
}

// Set ups the page to create a post
function setupPostCreation() {
  btnSaveDraft.addEventListener("click", function(event) {
    event.preventDefault();

    CreatePost({
      title: document.getElementById('title').value,
      content: editor.getContent(),
      type: "draft"
    }, function (hashOfNewPost) {
      notify('success', 'Post has been saved as draft.');
    });
  });

  btnPublish.addEventListener("click", function(event) {
    event.preventDefault();

    CreatePost({
      title: document.getElementById('title').value,
      content: editor.getContent(),
      type: "publish"
    }, function (hashOfNewPost) {
      notify('success', 'Post Published!');
    });
  });
}

// Set ups the page to edit a post
function setUpPostEditing() {
  // Get the post to edit
  GetPost(getParameterByName('entry'), function(post) {
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
      hash: getParameterByName('entry'),
      title: document.getElementById('title').value,
      content: editor.getContent(),
      type: "draft"
    }, function (hashOfNewPost) {
      notify('success', 'Post has been saved as draft.');
    });
  });

  btnPublish.addEventListener("click", function(event) {
    event.preventDefault();

    EditPost({
      hash: getParameterByName('entry'),
      title: document.getElementById('title').value,
      content: editor.getContent(),
      type: "publish"
    }, function (hashOfNewPost) {
      notify('success', 'Post Published!');
    });
  });
}

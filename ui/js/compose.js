// init
// =============================================================================

var editor = new MediumEditor('#editor', {
  disableExtraSpaces: true,
  anchor: { targetCheckbox: true }
});

draft()
publish()

// Helper

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Draft Functions
// =============================================================================

/* This function does the following
1) It checks if the query string entry exist, the expected value is a hash-string
2) If the entry exist, the value is sent to the Holochain
3) If the hash doesn't exist
*/

function draft(){

  if(getParameterByName('entry')){

    GetPost(getParameterByName('entry'), function(obj) {

      if(obj === null)
      return;

      document.getElementById('title').value = obj.title;
      editor.setContent(obj.content);

    });

    document.getElementById("saveDraft").addEventListener("click", function(event) {
      EditPost({
        hash: getParameterByName('entry'),
        title: document.getElementById('title').value,
        content: editor.getContent(),
        type: "draft"
      });

      document.getElementById('notice').innerHTML = "Post Drafted";
      document.getElementById('notice').style.display = "block";
    });

  } else {

    document.getElementById("saveDraft").addEventListener("click", function(event) {
      event.preventDefault();

      CreatePost({
        title: document.getElementById('title').value,
        content: editor.getContent(),
        type: "draft"
      });

      document.getElementById('notice').innerHTML = "Post Drafted";
      document.getElementById('notice').style.display = "block";
    });
  }
}

// Publish Functions
// =============================================================================

function publish() {
  document.getElementById("publishPost").addEventListener("click", function(event) {
    event.preventDefault();

    CreatePost({
      title: document.getElementById('title').value,
      content: editor.getContent(),
      type: "publish"
    });

    document.getElementById('notice').innerHTML = "Post Published!";
    document.getElementById('notice').style.display = "block";
  });
}

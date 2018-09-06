// init Medium editor
// =============================================================================

var editor = new MediumEditor('#editor', {
  disableExtraSpaces: true,
  anchor: { targetCheckbox: true }
});

// Helper

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Handle saving a blog post
// =============================================================================

if(getParameterByName('entry')){

  GetPost(getParameterByName('entry'), function(obj) {

    if(obj === null)
    return;

    document.getElementById('title').value = obj.title;
    document.getElementById('editor').innerHTML = obj.content;

  });

  document.getElementById("saveDraft").addEventListener("click", function(event) {
    EditPost({hash : getParameterByName('entry'), title: document.getElementById('title').value, "content": document.getElementById('editor').innerHTML, type: "draft"})
    document.getElementById('notice').style.display = "block";
  })

}else{

  document.getElementById("saveDraft").addEventListener("click", function(event) {
    event.preventDefault();
    CreatePost({
      "title": document.getElementById('title').value,
      "content": document.getElementById('editor').innerHTML,
      "type" : "draft"
    });
    document.getElementById('notice').style.display = "block";
  });
}

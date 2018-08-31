// init Quill editor
// =============================================================================

var editor = new MediumEditor('#editor', {
  disableExtraSpaces: true,
  anchor: { targetCheckbox: true }
});

// Handle saving a blog post
// =============================================================================

document.getElementById("saveDraft").addEventListener("click", function(event) {
  event.preventDefault();

  DraftCreate({
    "title": document.getElementById('title').value,
    "content": document.getElementById('editor').innerHTML
  });

  document.getElementById('notice').style.display = "block";
});

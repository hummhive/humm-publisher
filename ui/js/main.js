// init Quill editor
// =============================================================================

var quill = new Quill('#editor', {
  modules: {
    toolbar: [
      ['bold', 'italic'],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ]
  },
  placeholder: 'Compose...',
  theme: 'bubble'
});

// Handle saving a blog post
// =============================================================================

document.getElementById("saveDraft").addEventListener("click", function(event) {
  event.preventDefault();

  DraftCreate({
    "title": document.getElementById('title').value,
    "content": JSON.stringify(quill.getContents())
  });

  document.getElementById('notice').style.display = "block";
});

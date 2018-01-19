class App {
	static init() {

    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'

    App.displayUserNotes()

    let plus = document.getElementById('new-note')
    plus.addEventListener('click', App.handlePlusClick)

    let editor = document.getElementById('edit-note')
    editor.addEventListener('click', App.handleEditorClick)

    let noteList = document.getElementById('note-list')
    noteList.addEventListener('click', App.handleNoteListClick)

    let deletor = document.getElementById('delete-note')
    deletor.addEventListener('click', App.handleDeletorClick)

	}

  //app helpers

  static displayUserNotes() {
    let noteList = document.getElementById('note-list')
    fetch('http://localhost:3000/api/v1/users/1')
      .then( res => res.json() )
      .then( function(res) {
        new User(res)
        for (const note of res['notes']) {
          new Note(note).renderPreview(noteList)
        }
        Note.all()[`${Note.all().length -1}`].render()
      })
  }

  //app click handlers

  static handleNoteListClick(event) {
    let ident = parseInt(event.path.find( el => el.className === 'note-stub').id.slice(4))
    Note.all().find( note => note.id === ident).render()
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'inherit'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'inherit'
  }

  static handlePlusClick(event) {
    let currentNote = document.getElementById('current-note')
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'
    currentNote.innerHTML = ''
    let div = document.createElement('div')
    div.className = 'note-card'
    let newNoteForm = document.createElement('form')
    newNoteForm.innerHTML = `
      <label for="new-note-title">Title:</label>
      <input type="text" id="new-note-title" name="new-note-title" placeholder="Title">
      <label for="new-note-body">Note:</label>
      <input type="text" id="new-note-body" name="new-note-body" placeholder="Type here...">
      <input type="submit" value="Create New Note" id="note-submit">`
    div.appendChild(newNoteForm)
    currentNote.appendChild(div)
    newNoteForm.addEventListener('submit', App.handleNoteSubmit)
  }

  static handleEditorClick() {
    let currentNote = document.getElementById('current-note')
    let tilda = document.getElementById('edit-note')
    tilda.style.display = 'none'
    let minus = document.getElementById('delete-note')
    minus.style.display = 'none'

    let placeholderTitle = document.querySelector('.note-card').firstChild
    let placeholderBody = placeholderTitle.nextSibling
    let currentNoteId = document.querySelector('.note-card').id

    currentNote.innerHTML = ''
    let div = document.createElement('div')
    div.className = 'note-card'
    let editNoteForm = document.createElement('form')
    editNoteForm.innerHTML = `
      <label for="edit-note-title">Title:</label>
      <input type="text" id="edit-note-title" name="edit-note-title" value=${placeholderTitle.innerText}>
      <label for="edit-note-body">Note:</label>
      <input type="text" id="edit-note-body" name="edit-note-body" value=${placeholderBody.innerText}>
      <input type="hidden" id="edit-noteId" value=${currentNoteId}>
      <input type="submit" value="Edit Note" id="note-submit">`
    div.appendChild(editNoteForm)
    currentNote.appendChild(div)
    editNoteForm.addEventListener('submit', App.handleEditSubmit)
  }

  static handleDeletorClick() {
    let currentNote = document.getElementById('current-note')
    let currentNoteId = document.querySelector('.note-card').id.slice(7)
    let URL = "http://localhost:3000/api/v1/notes/" + currentNoteId

    fetch(URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    .then(res => res.json())
    .then(json => {
      const note = Note.all().find(n => n.id === json.noteId)
      Note.all().splice(Note.all().indexOf(note), 1)
      document.getElementById('note' + json.noteId).remove()
      currentNote.innerHTML = "<h2> Successfully Deleted!</h2>"
      let tilda = document.getElementById('edit-note')
      tilda.style.display = 'none'
      let minus = document.getElementById('delete-note')
      minus.style.display = 'none'
    })
  }

  //form submit handlers

  static handleNoteSubmit(event) {
    event.preventDefault()
    let noteList = document.getElementById('note-list')
    const inputTitle = document.getElementById('new-note-title')
    let noteTitle = inputTitle.value
    const inputBody = document.getElementById('new-note-body')
    let noteBody = inputBody.value

    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: noteTitle,
        body: noteBody,
        user_id: 1
      })
    })
    .then(res => res.json())
    .then(json => {
      const note = new Note(json)
      note.render()
      note.renderPreview(noteList)
    })
  }

  static handleEditSubmit(event) {
    event.preventDefault()
    let noteList = document.getElementById('note-list')
    const inputNoteId = document.getElementById('edit-noteId')
    let noteId = inputNoteId.value.slice(7)
    const inputTitle = document.getElementById('edit-note-title')
    let noteTitle = inputTitle.value
    const inputBody = document.getElementById('edit-note-body')
    let noteBody = inputBody.value

    let URL = "http://localhost:3000/api/v1/notes/" + noteId

    fetch(URL, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        title: noteTitle,
        body: noteBody
      })
    })
    .then(res => res.json())
    .then(json => {
      const note = Note.all().find(n => n.id === json.id)
      note['title'] = json.title
      note['body'] = json.body
      note.render()
      note.renderPreview(noteList)
    })
  }

}

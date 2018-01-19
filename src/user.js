
const User = (() => {
  let all = [];

  return class User {

    constructor({id,name}){
      this.id = id
      this.name = name
      all.push(this)
    }

    notes() {
      return Note.all().filter(note => { return note.user === this})
    }

    renderNotePreviews(){
      let notes = this.notes()
      let noteListDiv = document.getElementById('note-list')
      let head = document.createElement('h2')
      head.innerText = this.name + "'s Notes"
      noteListDiv.appendChild(head)
      for (const note of notes) {
        note.renderPreview(noteListDiv)
      }
    }

    static all() {
      return [...all]
    }

  }

})()

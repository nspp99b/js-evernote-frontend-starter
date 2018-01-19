const Note = (() => {
  let all = [];
  return class Note {
    constructor({id, title, body, user}){
      this.id = id
      this.title = title
      this.body = body
      if (user) {this.user = user}
      all.push(this)
    }


    render(){
      let container = document.getElementById('current-note')
      container.innerHTML = ''
      let div = document.createElement('div')
      div.className = 'note-card'
      div.id = 'current' + this.id
      let title = document.createElement('h3')
      title.innerText = this.title
      let body = document.createElement('p')
      body.innerText = this.body
      div.appendChild(title)
      div.appendChild(body)
      container.appendChild(div)
    }

    renderPreview(div){
      let noteDiv = document.createElement('div')
      noteDiv.id = 'note' + this.id
      noteDiv.className = 'note-stub'
      let title = document.createElement('h4')
      title.innerText = this.title
      let body = document.createElement('p')
      body.innerText = this.body.slice(0,75) + '...'
      noteDiv.appendChild(title)
      noteDiv.appendChild(body)
      div.prepend(noteDiv)
    }

    static all() {
      return [...all]
    }

  }

})()

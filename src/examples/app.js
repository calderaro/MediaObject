import MediaObject from '../mediaObject'

let index = 0
const assets = [
  {id: 126, type: 'pdf', title: 'pdf title', src: 'https://storage.googleapis.com/imjuve-storage/inbatk%2FWTC1PreludeC2.pdf'},
  {id: 123, type: 'video', title: 'video title', src: 'https://storage.googleapis.com/imjuve-storage/inbatk%2Fvideoplayback.mp4'},
  {id: 124, type: 'audio', title: 'audio title', src: 'http://localhost:3006/static/audio.mp3'},
  {id: 127, type: 'audio', title: 'audio 2 title', src: 'http://localhost:3006/static/audio2.mp3', img: 'http://localhost:3006/static/audio2ph.png'},
  {id: 125, type: 'image', title: 'audio title', src: 'http://localhost:3006/static/image.jpg'},
]

const mo = MediaObject({placeholderImg: 'http://localhost:3006/static/placeholder.jpg'})
const play = document.createElement('button')
const next = document.createElement('button')

play.addEventListener('click', () => {
  mo.play()
})
next.addEventListener('click', () => {
  index++
  mo.load(assets[index])
})

play.innerHTML = 'play'
next.innerHTML = 'next'

document.body.appendChild(mo.container)
document.body.appendChild(play)
document.body.appendChild(next)

mo.load(assets[0])

window.mo = mo

import MediaObject from '../mediaObject'

let index = 0
const assets = [
  {id: 32312, type: 'pdf', title: 'lol', src: 'https://storage.googleapis.com/inba-storage/inbatk/WTC1PreludeC2.pdf'},
  {id: 125, type: 'image', title: 'audio title', src: 'https://storage.googleapis.com/imjuve-storage/inbatk%2F402px-Mona_Lisa_by_Leonardo_da_Vinci_from_C2RMF_retouched.jpg'},
  {id: 1223, type: 'image', title: 'audio title', src: 'http://localhost:3006/static/large.jpg'},
  {id: 126, type: 'pdf', title: 'pdf title', src: 'http://localhost:3006/static/pdf.pdf'},
  {id: 123, type: 'video', title: 'video title', src: 'http://localhost:3006/static/video.mp4'},
  {id: 123, type: 'video', title: 'video title', src: 'https://storage.googleapis.com/imjuve-storage/inbatk%2Fvideoplayback.mp4'},
  {id: 126, type: 'pdf', title: 'pdf title', src: 'https://storage.googleapis.com/imjuve-storage/inbatk%2FWTC1PreludeC2.pdf'},
  {id: 124, type: 'audio', title: 'audio title', src: 'http://localhost:3006/static/audio.mp3'},
  {id: 127, type: 'audio', title: 'audio 2 title', src: 'http://localhost:3006/static/audio2.mp3', img: 'http://localhost:3006/static/audio2ph.png'},
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

mo.on('muted', e => console.log('muted', e))
mo.on('volume', e => console.log('volume', e))
mo.on('seek', e => console.log('seek', e))

import {window, document} from 'global'
import mitt from 'mitt'
import pdfobj from 'pdfjs-dist'

export default class MediaObject {
  constructor () {
    this.emitter = mitt()
    this.on = this.emitter.on
    this.emit = this.emitter.emit

    this.media = null
    this.raf = null
    this.canvas = document.createElement('canvas')
    this.canvas.width = 854
    this.canvas.height = 480
    this.cctx = this.canvas.getContext('2d')
    this.video = document.createElement('video')
    this.video.style.display = 'none'
    this.image = document.createElement('img')
    this.poster = document.createElement('img')
    this.pdf = document.createElement('div')

    document.body.appendChild(this.video)

    this.video.addEventListener('canplay', () => this.canplay())
    this.video.addEventListener('timeupdate', () => this.timeupdate())
    this.video.addEventListener('ended', () => this.ended())
    this.video.addEventListener('playing', () => this.playing())
    this.image.addEventListener('load', () => this.playing())
    this.poster.addEventListener('load', () => this.draw())
  }
  load (asset = this.asset) {
    this.cctx.clearRect(0, 0, 854, 480)
    if (!asset) return
    this.pause()
    if (asset.type === 'audio') {
      if (this.asset && this.asset.id === asset.id) {
        this.media.play()
      } else {
        this.media = this.video
        this.poster.src = asset.img
        this.video.src = '/static/img/' + asset.src
      }
    }
    if (asset.type === 'video') {
      if (this.asset && this.asset.id === asset.id) {
        this.media.play()
      } else {
        this.media = this.video
        this.video.src = '/static/img/' + asset.src
      }
    }
    if (asset.type === 'image') {
      this.media = this.image
      this.image.src = '/static/img/' + asset.src
    }
    if (asset.type === 'pdf') {
      this.pdf = pdfobj.getDocument('/static/img/' + asset.src)
        .then(pdf => pdf.getPage(1).then(page => {
          var viewport = page.getViewport(1);
          page.render({canvasContext: this.cctx, viewport: viewport})
        }))
      this.media = this.pdf
    }
    this.asset = asset
    this.emit('play', this.media)
  }
  canplay () {
    this.emit('canplay', this.media)
  }
  play () {
    this.duration = this.media.duration
    this.media.play()
    this.emit('play', this.media)
  }
  pause () {
    window.cancelAnimationFrame(this.raf)
    this.video.pause()
    this.emit('pause', this.media)
  }
  playing () {
    this.duration = this.media.duration
    this.raf = window.requestAnimationFrame(() => this.draw())
    this.emit('playing', this.media)
  }
  timeupdate () {
    this.currentTime = this.media.currentTime
    this.emit('timeupdate', this.media)
  }
  ended () {
    this.emit('ended', this.media)
  }
  draw () {
    const media =
      this.asset.type === 'video' ? this.media
      : this.asset.type === 'image'  ? this.media
      : this.asset.type === 'audio' && this.asset.img ? this.poster
      : null
    if (media) this.cctx.drawImage(media, 0, 0, 854, 480)
    if (this.asset.type === 'video') window.requestAnimationFrame(() => this.draw())
  }
}

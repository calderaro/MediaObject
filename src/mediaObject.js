import {window, document} from 'global'
import mitt from 'mitt'
import pdfo from './pdf'

const MediaObject = {
  init: function ({placeholderImg}) {
    this.placeholderImg = placeholderImg
    this.emitter = mitt()
    this.on = this.emitter.on
    this.container = document.createElement('div')
    this.canvas = document.createElement('canvas')
    this.cctx = this.canvas.getContext('2d')
    this.video = document.createElement('video')
    this.image = document.createElement('img')
    this.pdf = pdfo()
    this.scrollY = 0
    this.media = null
    this.raf = null
    this.asset = null
    this.duration = null
    this.currentTime = null

    this.container.appendChild(this.canvas)
    this.canvas.width = 854
    this.canvas.height = 480
    this.canvas.style.background = '#000'
    this.video.style.display = 'none'
    this.video.addEventListener('canplay', () => this.canplay())
    this.video.addEventListener('timeupdate', () => this.timeupdate())
    this.video.addEventListener('ended', () => this.ended())
    this.video.addEventListener('playing', () => this.playing())
    this.image.addEventListener('load', () => this.draw())
    this.canvas.addEventListener('wheel', e => this.wheel(e))
    this.pdf.on('done', () => this.draw())
    document.body.appendChild(this.video)
  },
  load: function (asset) {
    this.cctx.clearRect(0, 0, 854, 480)
    if (!asset) return
    if (this.asset && this.asset.id === asset.id) return this.play()
    this.video.pause()
    this.asset = asset
    if (asset.type === 'video' || asset.type === 'audio') {
      this.media = this.video
      this.video.src = asset.src
      this.image.src = asset.img || this.placeholderImg
    }
    if (asset.type === 'image') {
      this.media = this.image
      this.image.src = asset.src
    }
    if (asset.type === 'pdf') {
      this.media = this.pdf
      this.pdf.load(asset.src)
    }
  },
  canplay: function () {
    this.emitter.emit('canplay')
  },
  play: function () {
    if (!this.asset || (this.asset.type !== 'video' && this.asset.type !== 'audio')) return
    this.duration = this.video.duration
    this.emitter.emit('play')
    this.video.play()
    if (this.asset.type === 'video') {
      this.raf = window.requestAnimationFrame(() => this.draw())
    }
  },
  pause: function () {
    if (!this.asset || (this.asset.type !== 'video' && this.asset.type !== 'audio')) return
    window.cancelAnimationFrame(this.raf)
    this.video.pause()
    this.emitter.emit('pause')
  },
  playing: function () {
    this.duration = this.video.duration
    this.emitter.emit('playing')
  },
  timeupdate: function () {
    this.currentTime = this.video.currentTime
    this.emitter.emit('timeupdate')
  },
  ended: function () {
    this.emitter.emit('ended')
  },
  draw: function () {
    this.cctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const type = this.asset.type
    if (type === 'video') {
      this.cctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
      this.raf = window.requestAnimationFrame(() => this.draw())
    } else if (type === 'pdf') {
      const margin = (this.canvas.width / 2) - (this.pdf.width / 2)
      this.cctx.drawImage(this.pdf.canvas, 0, this.scrollY, this.pdf.width, this.pdf.height, margin, 0, this.pdf.width, this.pdf.height)
    } else {
      const imgw = this.image.width
      const imgh = this.image.height

      if (imgw > imgh) {
        const nwidth = this.canvas.width
        const nheight = imgh / imgw * this.canvas.width
        const margin = (this.canvas.height / 2) - (nheight / 2)
        this.cctx.drawImage(this.image, 0, margin, nwidth, nheight)
      } else {
        const nwidth = imgw / imgh * this.canvas.height
        const nheight = this.canvas.height
        const margin = (this.canvas.width / 2) - (nwidth / 2)
        this.cctx.drawImage(this.image, margin, 0, nwidth, nheight)
      }
    }
  },
  wheel: function (e) {
    if (this.asset.type !== 'pdf') return
    e.stopPropagation()
    e.preventDefault()
    const scroll = this.scrollY + (-1 * e.movementY) * 3
    if (scroll < 0 || scroll > this.pdf.totalHeight - this.canvas.height) return
    this.scrollY = scroll
    this.draw()
  }
}

export default function createMediaObject (options) {
  const mo = Object.create(MediaObject)
  mo.init(options)
  return mo
}

import PDFJS from 'pdfjs-dist'
import mitt from 'mitt'

const PDFObject = {
  init: function () {
    this.emitter = mitt()
    this.on = this.emitter.on
    this.emit = this.emitter.emit
    this.canvas = document.createElement('canvas')
    this.cctx = this.canvas.getContext('2d')
    this.pdf = null
    this.pages = []
    this.width = null
    this.height = null
  },
  load: function (url) {
    this.getDocument(url).then(pdf => {
      this.pdf = pdf
      return this.getPages(pdf)
    })
    .then(pages => {
      this.pages = pages
      return this.render(pages)
    })
    .catch(err => console.log(err))
  },
  getDocument: function (url) {
    return PDFJS.getDocument(url)
  },
  getPages: function (pdf) {
    return Promise.all(Array.from(Array(pdf.numPages), (a, i) => pdf.getPage(i + 1)))
      .then(pages => Promise.all(pages.map(page => new Promise((resolve, reject) => {
        const viewport = page.getViewport(1.2);
        const canvas = document.createElement('canvas')
        canvas.height = viewport.height
        canvas.width = viewport.width
        return page.render({canvasContext: canvas.getContext('2d'), viewport: viewport})
          .then(() => resolve(canvas))
      }))))
  },
  render: function (pages) {
    const width = pages[0].width
    const height = pages[0].height
    this.width = pages[0].width
    this.height = pages[0].height
    this.canvas.width = width
    this.canvas.height = height * pages.length
    pages.forEach((p, i) => this.cctx.drawImage(p, 0, i * height, width, height))
    this.emit('done', this.canvas)
  }
}

export default function createPDFObject () {
  const pdfo = Object.create(PDFObject)
  pdfo.init()
  return pdfo
}

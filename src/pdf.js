import PDFJS from 'pdfjs-dist'
import mitt from 'mitt'

const PDFObject = {
  create: function () {
    const pdfo = Object.create(this)
    pdfo.emitter = mitt()
    pdfo.on = pdfo.emitter.on
    pdfo.emit = pdfo.emitter.emit
    pdfo.canvas = document.createElement('canvas')
    pdfo.cctx = pdfo.canvas.getContext('2d')
    pdfo.pdf = null
    pdfo.pages = []
    pdfo.width = null
    pdfo.height = null
    return pdfo
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
        const viewport = page.getViewport(1.44);
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
    this.width = width
    this.height = height
    this.totalHeight = height * pages.length
    this.canvas.width = width
    this.canvas.height = height * pages.length
    pages.forEach((p, i) => this.cctx.drawImage(p, 0, i * height, width, height))
    this.emit('done', this.canvas)
  }
}

export default function createPDFObject () {
  const pdfo = PDFObject.create()
  return pdfo
}

import path from 'path'
import http from 'http'
import express from 'express'
import chalk from 'chalk'
import html from './html'

const log = console.log
const PORT = process.env.port || 3006

const app = express()
const server = http.createServer(app)
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('../webpack.config.dev')
const compiler = webpack(webpackConfig)

app
  .use('/lib', express.static(path.join(__dirname, '../lib')))
  .use(webpackDevMiddleware(compiler, {publicPath: webpackConfig.output.publicPath}))
  .use(webpackHotMiddleware(compiler))
  .get('*', (req, res) => res.status(200).send(html()))

server.listen(PORT, () =>
    log(chalk.green(`Listening at port ${PORT}`)))

process.on('uncaughtException', err =>
  err.code === 'EADDRINUSE' ? log(chalk.red(`Port ${PORT} in use`)) : log(chalk.red(err.code)))

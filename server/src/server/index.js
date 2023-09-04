const Koa = require('koa')
const cors = require('@koa/cors')
const helmet = require('koa-helmet')
const bodyParser = require('koa-body')
const debugTrace = require('@/lib/koa/debug-trace')
const errorHandler = require('@/lib/koa/error-handler')
const apiRoutes = require('./routes')

const app = new Koa()

app
  .use(cors({ credentials: true }))
  .use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }))
  .use(bodyParser({ jsonLimit: 50 * 1024 * 1024 }))
  .use(errorHandler())
  .use(debugTrace(app))
  .use(apiRoutes.routes())
  .use(apiRoutes.allowedMethods())

module.exports = app

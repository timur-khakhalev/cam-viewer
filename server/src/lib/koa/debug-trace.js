const shortId = require('shortid')

module.exports = function (app) {
  if (process.env.NODE_ENV !== 'development') return async (ctx, next) => { await next() }
  require('koa-trace')(app)
  app.debug()

  return async (ctx, next) => {
    ctx.id = shortId.generate()

    ctx.trace('start')
    ctx.trace(`request info:\n\tmethod: ${ctx.request.method}\n\troute: ${ctx.request.path}\n\tpath: ${ctx.request.url}`)
    await next()
    ctx.trace('finish')
  }
}

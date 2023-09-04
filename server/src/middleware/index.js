const authService = require('@/service/auth')
const storageController = require('@/controllers/storage')
const utils = require('@/lib/utils')

async function _authenticateUser (ctx, next) {
  if (utils.isIPAllowed(ctx)) return next()

  if (ctx.state?.user?.token) return next()

  const accessToken = ctx.request?.headers?.authorization?.replace('Bearer ', '')

  if (accessToken) {
    try {
      const decoded = authService.jwtToken.verify(accessToken)
      if (decoded) {
        ctx.state.user = {
          token: accessToken,
          ip: utils.getUserIP(ctx)
        }
        return next()
      }
    } catch (_) {
      throw ctx.throw(403, 'Access Denied')
    }
  }
  throw ctx.throw(403, 'Access Denied')
}

module.exports = {
  authenticate () {
    return async (ctx, next) => await _authenticateUser(ctx, next)
  },
  shares () {
    return async (ctx, next) => {
      const { key, shared } = ctx.request.query

      if (!key || !shared) return _authenticateUser(ctx, next)
      if (shared) return next()

      const videoUrlCache = storageController.cache
      if (videoUrlCache.has(key)) return next()

      return _authenticateUser(ctx, next)
    }
  }
}

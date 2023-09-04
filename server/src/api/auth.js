const AuthController = require('@/controllers/auth')
const utils = require('@/lib/utils')

module.exports = {
  login: async ctx => {
    const payload = ctx.request.body
    const ip = utils.getUserIP(ctx)
    ctx.body = await AuthController.login({ ip, ...payload })
  },
  verify: async ctx => {
    const { ip, token } = ctx.request.query
    ctx.body = await AuthController.verify(token, ip)
  }
}

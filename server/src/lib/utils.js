const ALLOWED_IPS = process.env.ALLOWED_IPS

const getUserIP = ctx => process.env.NODE_ENV === 'development' ? 'localhost' : ctx.headers['x-forwarded-for']

module.exports = {
  getUserIP,
  isIPAllowed: ctx => ALLOWED_IPS.split(';').some(ip => ip === getUserIP(ctx))
}

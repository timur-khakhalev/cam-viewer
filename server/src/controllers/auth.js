const { AuthorizationError } = require('@/lib/errors')
const authService = require('@/service/auth')
const userVerifyService = require('@/service/userVerify')
const Cache = require('node-cache')
const ms = require('ms')

const ipsTTL = ms(process.env.JWT_EXPIRATION) / 1000

const ips = new Cache({ stdTTL: ipsTTL, checkperiod: 120 })
const IPS_STATUS = {
  BANNED: 'BANNED',
  APPROVED: 'APPROVED',
  PENDING: 'PENDING'
}

module.exports = {
  async login (payload) {
    const candidate = ips.get(payload.ip)
    if (candidate === IPS_STATUS.BANNED) throw new AuthorizationError('You\'re not allowed here!')

    if (candidate === IPS_STATUS.PENDING) return

    if (candidate === IPS_STATUS.APPROVED) {
      const token = authService.jwtToken.new(payload.ip)
      ips.del(payload.ip)
      ips.set(payload.ip, IPS_STATUS.APPROVED)
      return {
        accessToken: token
      }
    } else {
      /*
      If operator didn't approve client, we ban this client for next 2 hours
       */
      setTimeout(() => {
        if (ips.has(payload.ip)) {
          const isPending = ips.take(payload.ip)
          if (isPending === IPS_STATUS.PENDING) ips.set(payload.ip, IPS_STATUS.BANNED, 60 * 60 * 2)
        }
      }, 1000 * 60 * 25)
      ips.set(payload.ip, IPS_STATUS.PENDING)
      return userVerifyService.client.submit({ token: authService.crypto.encrypt(payload.ip), ...payload })
    }
  },
  async verify (token, ip) {
    if (!token) throw new AuthorizationError()
    try {
      authService.crypto.decrypt(token)
    } catch (_) {
      throw new AuthorizationError()
    }

    if (!ip) throw new AuthorizationError('IP not found')
    ips.set(ip, IPS_STATUS.APPROVED)
    return { ok: true }
  }
}

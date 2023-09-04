const axios = require('axios')
const flatten = require('flat')

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_OPERATOR_CHAT_ID = process.env.TELEGRAM_OPERATOR_CHAT_ID

const geoIp = {
  geoJs: async ip => {
    return axios(`https://get.geojs.io/v1/ip/country/${ip}.json`)
      .then(r => r.data?.name)
  },
  ipApi: async ip => {
    return axios(`http://ip-api.com/json/${ip}`)
      .then(r => r.data?.country)
  }
}

function objectToMessage (obj) {
  if (typeof obj === 'string') return obj
  let msg = ''
  Object.entries(flatten(obj)).forEach(([ k, v ]) => {
    msg += `<b>${k}</b>: ${JSON.stringify(v)}\n\n`
  })
  return msg
}

async function getCountryByIp (ip) {
  if (!ip || ip === 'localhost') return 'Wakanda'
  return geoIp.geoJs(ip)
    .catch(async () => geoIp.ipApi(ip))
}

async function sendTelegramMessage (text) {
  await axios({
    method: 'POST',
    url: `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    data: {
      chat_id: TELEGRAM_OPERATOR_CHAT_ID,
      text,
      parse_mode: 'html'
    }
  })
    .catch(e => console.error(e.response.data))
}

module.exports = {
  client: {
    submit: async ({ token, ...payload }) => {
      const country = await getCountryByIp(payload.ip)
      const data = objectToMessage({ country, ...payload })
      const approveLink = `${process.env.PUBLIC_API_ENDPOINT}/auth/verify?ip=${payload.ip}&token=${token}`
      const msg = `New request: \n\n${data}\n\n Approve user by next link:\n\n<a href="${approveLink}">🔗 ${approveLink}</a>`

      return sendTelegramMessage(msg)
    }
  }
}

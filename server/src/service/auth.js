const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const JWT_EXPIRATION = process.env.JWT_EXPIRATION
const JWT_SECRET = process.env.JWT_SECRET
const CRYPTO_SECRET = process.env.CRYPTO_SECRET
const key = crypto
  .createHash('sha512')
  .update(CRYPTO_SECRET)
  .digest('hex')
  .substring(0, 32)

const iv = crypto.randomBytes(16)

module.exports = {
  jwtToken: {
    new: ip => jwt.sign({ data: ip }, JWT_SECRET, { expiresIn: JWT_EXPIRATION }),
    verify: token => jwt.verify(token, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
  },
  crypto: {
    encrypt: text => {
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv)
      const encrypted = Buffer.concat([ cipher.update(text), cipher.final() ])
      return encrypted.toString('hex')
    },
    decrypt: text => {
      const encryptedText = Buffer.from(text, 'hex')
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv)
      let decrypted = decipher.update(encryptedText)
      decrypted = Buffer.concat([ decrypted, decipher.final() ])
      return decrypted.toString()
    }
  }
}

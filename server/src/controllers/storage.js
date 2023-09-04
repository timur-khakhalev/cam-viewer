const StorageService = require('@/service/storage')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 10 * 60, checkperiod: 120 })
const { ValidationError } = require('@/lib/errors')

module.exports = {
  async list () {
    const storage = new StorageService()
    const cached = cache.get('list')
    if (!cached) {
      const res = await storage.getList()
      cache.set('list', res)
      return res
    }
    return cached
  },
  async one ({ key, save, share }, range) {
    const storage = new StorageService()
    const { video, status, headers } = await storage.getOne(key, save, range)
    return { video, status, headers }
  },
  async shareVideo (key) {
    if (!key) throw new ValidationError('Query param key is required')
    cache.set(key, {}, 60 * 60)
    return { url: `${process.env.PUBLIC_API_ENDPOINT}/video?key=${key}&shared=true` }
  },
  cache
}

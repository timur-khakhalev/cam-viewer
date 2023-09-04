const StorageController = require('@/controllers/storage')

module.exports = {
  async getVideos (ctx) {
    ctx.body = await StorageController.list()
  },
  async getVideo (ctx) {
    const { key, save, share } = ctx.request.query
    const { range } = ctx.request.headers
    const { video, status, headers } = await StorageController.one({ key, save, share }, range)
    ctx.status = status
    ctx.set(headers)
    ctx.body = video
  },
  async temporaryShareVideo (ctx) {
    const { key } = ctx.request.query
    ctx.body = await StorageController.shareVideo(key)
  }
}

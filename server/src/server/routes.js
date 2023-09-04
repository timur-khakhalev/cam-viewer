const Router = require('koa-router')
const StorageApi = require('@/api/storage')
const AuthApi = require('@/api/auth')
const Middleware = require('@/middleware')

const router = new Router()

router
  .post('/auth/login', AuthApi.login)
  .get('/auth/verify', AuthApi.verify)
  .get('/video', Middleware.shares(), StorageApi.getVideo)
  .use(Middleware.authenticate())
  .get('/videos', StorageApi.getVideos)
  .get('/share', StorageApi.temporaryShareVideo)

module.exports = router

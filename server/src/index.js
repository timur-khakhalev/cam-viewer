require('dotenv').config()
require('module-alias/register')
require('colors')

const app = require('@/server')

app.listen({ port: process.env.PORT, host: process.env.HOST }, async () => {
  const bootTime = new Date()
  const timeString = `${bootTime.getHours()}:${bootTime.getMinutes()}:${bootTime.getSeconds()}`
  const pidString = `pid: ${process.pid}`

  console.clear()
  console.log(`\nServer ready at ${`http://${process.env.HOST}:${process.env.PORT}`.cyan}  ${timeString.gray}  ${pidString.gray}`)
  console.log('======================================'.blue + '========='.yellow + '============\n'.red)
})

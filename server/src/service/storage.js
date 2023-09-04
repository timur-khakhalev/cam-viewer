const { S3 } = require('@aws-sdk/client-s3')
const { AWSFetchingError } = require('@/lib/errors')

class StorageService {
  bucket = process.env.AWS_STORAGE_BUCKET

  config = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    endpoint: process.env.AWS_ENDPOINT
  }

  _getHeaders (ContentLength, ContentRange, key, save) {
    const saveFile = save ? { 'Content-Disposition': `attachment; filename="${key.replace(/videos\//, '')}"` } : undefined
    return {
      status: saveFile ? 200 : 206,
      headers: {
        'Content-Range': ContentRange,
        'Accept-Ranges': 'bytes',
        'Content-Length': ContentLength,
        'Content-Type': 'video/mp4',
        ...saveFile
      }
    }
  }

  async getList () {
    try {
      const s3Client = new S3(this.config)

      const processChunks = async () => {
        let ContinuationToken
        do {
          const data = await s3Client.listObjectsV2({ Bucket: this.bucket, MaxKeys: 100, ContinuationToken })
            .catch(e => {
              console.error(e)
              throw new AWSFetchingError(e)
            })

          buffer.push(data.Contents.map(({ Key, LastModified, Size }) => Key.includes('development') ? undefined : { Key, LastModified, Size }).filter(el => el))
          ContinuationToken = data.NextContinuationToken
        } while (ContinuationToken)

        const list = buffer.flat()
        list.splice(0, 1)
        return { size: list.length, list: list.sort((a, b) => b.LastModified - a.LastModified) }
      }

      const buffer = []

      return processChunks()
    } catch (e) {
      console.error(e)
    }
  }

  async getOne (Key, save, Range = 'bytes=0') {
    try {
      const s3Client = new S3(this.config)
      return new Promise(async (resolve, reject) => {
        return s3Client.getObject({ Bucket: this.bucket, Key, Range })
          .catch(e => reject(new AWSFetchingError(e)))
          .then(data => {
            if (data) {
              const { Body, ContentLength, ContentRange } = data
              const chunks = []
              Body.once('error', err => {
                console.log(err)
                return reject(err)
              })
              Body.on('data', chunk => chunks.push(chunk))

              const { status, headers } = this._getHeaders(ContentLength, ContentRange, Key, save)
              Body.once('end', () => resolve({ status, headers, video: Buffer.concat(chunks) }))
            }
          })
      })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = StorageService

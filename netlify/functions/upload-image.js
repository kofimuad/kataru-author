// netlify/functions/upload-image.js
// Uploads an image to Cloudinary, returns permanent URL
const { checkAdminPin } = require('./_auth')
const https = require('https')
const crypto = require('crypto')

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  const auth = checkAdminPin(event.headers)
  if (!auth.allowed) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: auth.reason }) }
  }

  try {
    const { imageData, folder = 'kataru-yahya' } = JSON.parse(event.body)
    if (!imageData) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing imageData' }) }
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

    const timestamp = Math.floor(Date.now() / 1000)
    const publicId = `${folder}/${Date.now()}`
    const paramsToSign = `overwrite=true&public_id=${publicId}&timestamp=${timestamp}`
    const signature = crypto
      .createHash('sha1')
      .update(paramsToSign + CLOUDINARY_API_SECRET)
      .digest('hex')

    const boundary = '----CloudinaryBoundary' + Date.now()
    const fields = {
      file: imageData,
      public_id: publicId,
      overwrite: 'true',
      timestamp: String(timestamp),
      api_key: CLOUDINARY_API_KEY,
      signature,
    }

    let body = ''
    for (const [key, val] of Object.entries(fields)) {
      body += `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${val}\r\n`
    }
    body += `--${boundary}--\r\n`

    const result = await new Promise((resolve, reject) => {
      const urlObj = new URL(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`)
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': Buffer.byteLength(body),
        },
      }
      const req = https.request(options, (res) => {
        let data = ''
        res.on('data', chunk => data += chunk)
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) reject(new Error(parsed.error.message))
            else resolve(parsed)
          } catch (e) { reject(new Error('Invalid Cloudinary response')) }
        })
      })
      req.on('error', reject)
      req.write(body)
      req.end()
    })

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ success: true, imageUrl: result.secure_url }),
    }
  } catch (err) {
    console.error('upload-image error:', err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
  }
}

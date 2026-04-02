// netlify/functions/delete-content.js
const { checkAdminPin } = require('./_auth')
const { getDB } = require('./_db')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'DELETE') return { statusCode: 405, body: 'Method Not Allowed' }

  const auth = checkAdminPin(event.headers)
  if (!auth.allowed) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: auth.reason }) }
  }

  try {
    const { type, id } = JSON.parse(event.body)
    if (!type || !id) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing type or id' }) }
    }

    const db = await getDB()
    await db.collection(type).deleteOne({ _id: new ObjectId(id) })

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) }
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
  }
}

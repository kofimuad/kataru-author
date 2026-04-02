// netlify/functions/save-content.js
// POST - admin creates or updates a content item
const { checkAdminPin } = require('./_auth')
const { getDB } = require('./_db')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
}

const VALID_TYPES = ['books', 'publications', 'interviews', 'workshops', 'bio']

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }

  const auth = checkAdminPin(event.headers)
  if (!auth.allowed) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: auth.reason }) }
  }

  try {
    const { type, item } = JSON.parse(event.body)
    if (!type || !VALID_TYPES.includes(type)) {
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid type' }) }
    }

    const db = await getDB()

    if (type === 'bio') {
      await db.collection('bio').updateOne(
        { _id: 'current' },
        { $set: { _id: 'current', ...item, updatedAt: new Date() } },
        { upsert: true }
      )
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true }) }
    }

    if (item._id) {
      // Update existing
      const { _id, ...rest } = item
      await db.collection(type).updateOne(
        { _id: new ObjectId(_id) },
        { $set: { ...rest, updatedAt: new Date() } }
      )
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ success: true, id: _id }) }
    } else {
      // Create new
      const result = await db.collection(type).insertOne({
        ...item,
        visible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ success: true, id: result.insertedId.toString() }),
      }
    }
  } catch (err) {
    console.error('save-content error:', err)
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) }
  }
}

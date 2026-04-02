const mongoose = require('mongoose');
const { getDB } = require('./_db');
const Bio = require('./models/Bio');
const Content = require('./models/Content');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-admin-pin'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const { type } = event.queryStringParameters || {};

  try {
    await getDB(); // Connection logic from our previous step

    if (type === 'bio') {
      const doc = await Bio.findOne({ _id: 'current' });
      return {
        statusCode: 200,
        headers: CORS,
        body: JSON.stringify({ exists: !!doc, data: doc }),
      };
    }

    // For Books, Publications, etc.
    const db = mongoose.connection.db
    const items = await db.collection(type)
      .find({ visible: { $ne: false } })
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ items }),
    };

  } catch (err) {
    console.error("GET error:", err);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
// netlify/functions/_db.js
const fs = require('fs')
const path = require('path')
const dns = require('dns')
const mongoose = require('mongoose');

dns.setServers(['8.8.8.8', '1.1.1.1'])

let isConnected = false;

function findLocalEnvPath() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '.env'),
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '..', '..', '.env'),
    path.resolve(__dirname, '..', '..', '..', '.env'),
    path.resolve(__dirname, '..', '..', '..', '..', '.env'),
  ]
  return candidates.find(fs.existsSync)
}

function loadLocalEnv() {
  const envPath = findLocalEnvPath()
  if (!envPath) return

  const text = fs.readFileSync(envPath, 'utf8')
  const parsed = {}
  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const idx = trimmed.indexOf('=')
    if (idx === -1) return
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    parsed[key] = value
  })

  Object.entries(parsed).forEach(([key, value]) => {
    if (!value) return
    if (process.env[key] !== value) {
      console.log(`=> Setting local env ${key} from ${envPath}`)
      process.env[key] = value
    }
  })
}

async function getDB() {
  loadLocalEnv()

  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  if (isConnected && mongoose.connection && mongoose.connection.readyState === 1 && mongoose.connection.db) {
    try {
      const hello = await mongoose.connection.db.admin().command({ hello: 1 })
      if (hello.isWritablePrimary || hello.ismaster || hello.readOnly === false) {
        console.log('=> Using existing writable database connection');
        return mongoose.connection.db;
      }
      console.log('=> Existing connection is not writable, reconnecting');
    } catch (err) {
      console.log('=> Existing connection check failed:', err.message);
    }
    await mongoose.disconnect()
    isConnected = false
  }

  const maskedUri = process.env.MONGODB_URI.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:*****@')
  console.log('=> Creating new database connection with', maskedUri)
  const connection = await mongoose.connect(process.env.MONGODB_URI)

  isConnected = connection.connections[0].readyState === 1;
  return mongoose.connection.db;
}

module.exports = { getDB };
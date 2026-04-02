// src/lib/api.js
const isDev = import.meta.env.DEV
const BASE = isDev ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions'

export function apiUrl(name) {
  return `${BASE}/${name}`
}

function getAdminPin() {
  return sessionStorage.getItem('admin_pin') || ''
}

export function adminHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-admin-pin': getAdminPin(),
  }
}

// ── Content API ──────────────────────────────────────────────
export async function getContent(type) {
  const res = await fetch(`${apiUrl('get-content')}?type=${type}`)
  if (!res.ok) throw new Error(`Failed to fetch ${type}`)
  return res.json()
}

export async function saveContent(type, item) {
  const res = await fetch(apiUrl('save-content'), {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ type, item }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Save failed')
  return data
}

export async function deleteContent(type, id) {
  const res = await fetch(apiUrl('delete-content'), {
    method: 'DELETE',
    headers: adminHeaders(),
    body: JSON.stringify({ type, id }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Delete failed')
  return data
}

export async function uploadImage(imageData, folder) {
  const res = await fetch(apiUrl('upload-image'), {
    method: 'POST',
    headers: adminHeaders(),
    body: JSON.stringify({ imageData, folder }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const opts = (method, body) => ({
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) })
})

export const login         = (data) => fetch(`${BASE_URL}/auth/login`,       opts('POST', data)).then(r => r.json())
export const register      = (data) => fetch(`${BASE_URL}/auth/register`,    opts('POST', data)).then(r => r.json())
export const logout        = ()     => fetch(`${BASE_URL}/auth/logout`,      opts('POST')).then(r => r.json())
export const getMe         = ()     => fetch(`${BASE_URL}/auth/me`,          opts('GET')).then(r => r.json())
export const updateMe      = (data) => fetch(`${BASE_URL}/auth/me`,          opts('PATCH', data)).then(r => r.json())
export const getProfiles   = ()     => fetch(`${BASE_URL}/profiles`,         opts('GET')).then(r => r.json())
export const createProfile = (data) => fetch(`${BASE_URL}/profiles`,         opts('POST', data)).then(r => r.json())
export const deleteProfile = (id)   => fetch(`${BASE_URL}/profiles/${id}`,   opts('DELETE')).then(r => r.json())
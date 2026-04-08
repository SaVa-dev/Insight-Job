const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

const opts = (method, body) => ({
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...(body && { body: JSON.stringify(body) })
})

const parseResponse = async (response) => {
    const contentType = response.headers.get('content-type') ?? ''
    const isJson = contentType.includes('application/json')

    if (isJson) {
        return response.json()
    }

    const text = await response.text()
    return {
        error: text || `Unexpected response format (${response.status})`,
        status: response.status
    }
}

const request = (path, method, body) =>
    fetch(`${BASE_URL}${path}`, opts(method, body)).then(parseResponse)

export const login         = (data) => request('/auth/login', 'POST', data)
export const register      = (data) => request('/auth/register', 'POST', data)
export const logout        = ()     => request('/auth/logout', 'POST')
export const getMe         = ()     => request('/auth/me', 'GET')
export const updateMe      = (data) => request('/auth/me', 'PATCH', data)
export const getProfiles   = ()     => request('/profiles', 'GET')
export const createProfile = (data) => request('/profiles', 'POST', data)
export const deleteProfile = (id)   => request(`/profiles/${id}`, 'DELETE')
export const getNotifications = ()  => request('/notifications', 'GET')
export const sendNotification = (data) => request('/notifications/send', 'POST', data)

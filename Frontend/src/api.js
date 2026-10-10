const API_BASE = import.meta.env.VITE_API_BASE

export const api = {
  // GET all users
  async getAllUsers() {
    const res = await fetch(`${API_BASE}/users/`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to fetch users')
    }
    return res.json()
  },

  // GET user by id
  async getUserById(id) {
    const res = await fetch(`${API_BASE}/users/${id}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || `User with ID ${id} not found`)
    }
    return res.json()
  },

  // POST create user
  async createUser(userData) {
    const res = await fetch(`${API_BASE}/users/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to create user')
    }
    return res.json()
  },

  // PUT update user
  async updateUser(id, userData) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to update user')
    }
    return res.json()
  },

  // DELETE user
  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.detail || 'Failed to delete user')
    }
    return res.json()
  },
}

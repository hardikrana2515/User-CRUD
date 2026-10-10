import { useState, useEffect } from 'react'
import { api } from '../api'
import { PencilSimple, X } from '@phosphor-icons/react'

export default function EditUserModal({ isOpen, onClose, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Member',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Member',
      })
      setErrors({})
      setApiError('')
    }
  }, [user])

  if (!isOpen || !user) return null

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be at most 100 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    setApiError('')
    try {
      const result = await api.updateUser(user.id, formData)
      setIsSubmitting(false)
      onSuccess?.(result)
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      setApiError(err.message)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const roles = ['Admin', 'Member', 'Viewer']
  const roleColors = {
    Admin: 'border-admin/50 bg-admin/10 text-admin peer-checked:bg-admin/25 peer-checked:border-admin peer-checked:shadow-[0_0_12px_rgba(139,92,246,0.3)]',
    Member: 'border-member/50 bg-member/10 text-member peer-checked:bg-member/25 peer-checked:border-member peer-checked:shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    Viewer: 'border-viewer/50 bg-viewer/10 text-viewer peer-checked:bg-viewer/25 peer-checked:border-viewer peer-checked:shadow-[0_0_12px_rgba(20,184,166,0.3)]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-border rounded-xl shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
              <PencilSimple className="h-5 w-5 text-warning" weight="regular" />
            </div>
            <h2 className="text-lg font-semibold text-text">Edit User</h2>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors cursor-pointer">
            <X className="h-5 w-5" weight="regular" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* ID (disabled) */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">User ID</label>
            <input
              type="text"
              value={user.id}
              disabled
              className="w-full px-4 py-2.5 rounded-lg bg-surface-alt/50 border border-border text-text-muted cursor-not-allowed outline-none opacity-60"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Jack Jonson"
              className={`w-full px-4 py-2.5 rounded-lg bg-surface-alt border text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/40
                ${errors.name ? 'border-danger' : 'border-border hover:border-primary/40'}
              `}
            />
            {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Email <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. jack@gmail.com"
              className={`w-full px-4 py-2.5 rounded-lg bg-surface-alt border text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/40
                ${errors.email ? 'border-danger' : 'border-border hover:border-primary/40'}
              `}
            />
            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2.5">
              Role <span className="text-danger">*</span>
            </label>
            <div className="flex gap-3">
              {roles.map((role) => (
                <label key={role} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="edit-role"
                    value={role}
                    checked={formData.role === role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className={`text-center py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${roleColors[role]}`}>
                    {role}
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className="mt-1.5 text-xs text-danger">{errors.role}</p>}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
              <p className="text-xs text-danger">{apiError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-alt border border-border active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-warning hover:bg-warning/80 active:scale-[0.98] transition-all shadow-lg shadow-warning/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[130px] justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

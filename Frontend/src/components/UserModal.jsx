import { useState, useEffect } from 'react'

export default function UserModal({ isOpen, onClose, onSubmit, initialData = null, mode = 'create' }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Member'
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          role: initialData.role || 'Member'
        })
      } else {
        setFormData({ name: '', email: '', role: 'Member' })
      }
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const validate = () => {
    const newErrors = {}
    
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsSubmitting(true)
    
    // Simulate API call for now since backend integration isn't requested yet
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Fake network delay
      onSubmit({ ...formData, ...(initialData ? { id: initialData.id } : {}) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-surface/50">
          <h2 className="text-xl font-semibold text-text">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-text hover:bg-surface-hover p-2 rounded-full transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {mode === 'edit' && initialData?.id && (
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">User ID</label>
              <input 
                type="text" 
                value={initialData.id} 
                disabled 
                className="w-full bg-surface-alt border border-border rounded-lg px-4 py-2.5 text-text-muted opacity-70 cursor-not-allowed font-mono"
              />
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text mb-1.5">Full Name *</label>
            <input 
              id="name"
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full bg-surface-alt border ${errors.name ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-text placeholder-text-muted outline-none focus:ring-4 transition-all`}
              placeholder="e.g. Jack Jonson"
            />
            {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">Email Address *</label>
            <input 
              id="email"
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full bg-surface-alt border ${errors.email ? 'border-danger focus:ring-danger/20' : 'border-border focus:border-primary focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-text placeholder-text-muted outline-none focus:ring-4 transition-all`}
              placeholder="e.g. jack@example.com"
            />
            {errors.email && <p className="mt-1.5 text-sm text-danger">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2.5">Role *</label>
            <div className="grid grid-cols-3 gap-3">
              {['Admin', 'Member', 'Viewer'].map((r) => (
                <label 
                  key={r}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                    ${formData.role === r 
                      ? 'bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                      : 'bg-surface-alt border-border text-text-muted hover:bg-surface-hover hover:border-text-muted/30'
                    }
                  `}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    value={r}
                    checked={formData.role === r}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-text-muted hover:text-text bg-surface-alt hover:bg-surface-hover border border-border rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="relative px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-lg transition-all shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-w-[120px] flex justify-center items-center overflow-hidden"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{mode === 'create' ? 'Create User' : 'Save Changes'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

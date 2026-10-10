import { useState } from 'react'
import { api } from '../api'
import { Trash, X, Warning } from '@phosphor-icons/react'

export default function DeleteConfirmModal({ isOpen, onClose, user, onConfirm }) {
  const [inputId, setInputId] = useState('')
  const [error, setError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [apiError, setApiError] = useState('')

  if (!isOpen || !user) return null

  const handleDelete = async () => {
    if (inputId.trim() === '') {
      setError('Please enter the user ID to confirm')
      return
    }
    if (parseInt(inputId) !== user.id) {
      setError(`ID does not match. Expected: ${user.id}`)
      return
    }
    setError('')
    setApiError('')
    setIsDeleting(true)
    try {
      await api.deleteUser(user.id)
      setIsDeleting(false)
      onConfirm?.(user.id)
      setInputId('')
      onClose()
    } catch (err) {
      setIsDeleting(false)
      setApiError(err.message)
    }
  }

  const handleClose = () => {
    if (isDeleting) return
    setInputId('')
    setError('')
    setApiError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-surface border border-border rounded-xl shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger/20 flex items-center justify-center">
              <Trash className="h-5 w-5 text-danger" weight="regular" />
            </div>
            <h2 className="text-lg font-semibold text-text">Delete User</h2>
          </div>
          <button onClick={handleClose} className="text-text-muted hover:text-text transition-colors cursor-pointer">
            <X className="h-5 w-5" weight="regular" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* User info */}
          <div className="mb-4 p-3 rounded-lg bg-danger/5 border border-danger/20">
            <p className="text-sm text-text-muted mb-1">You are about to delete:</p>
            <p className="text-sm font-semibold text-text">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <Warning className="h-5 w-5 text-warning shrink-0 mt-0.5" weight="regular" />
            <p className="text-xs text-warning/80">This action cannot be undone. All data associated with this user will be permanently removed.</p>
          </div>

          {/* Confirmation input */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Type <span className="font-bold text-danger">{user.id}</span> to confirm
            </label>
            <input
              type="text"
              value={inputId}
              onChange={(e) => {
                setInputId(e.target.value)
                if (error) setError('')
              }}
              placeholder={`Enter user ID: ${user.id}`}
              className={`w-full px-4 py-2.5 rounded-lg bg-surface-alt border text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-danger/40
                ${error ? 'border-danger' : 'border-border hover:border-danger/40'}
              `}
            />
            {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mt-3 p-3 rounded-lg bg-danger/10 border border-danger/20">
              <p className="text-xs text-danger">{apiError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-text hover:bg-surface-alt border border-border active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-danger hover:bg-danger-hover active:scale-[0.98] transition-all shadow-lg shadow-danger/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

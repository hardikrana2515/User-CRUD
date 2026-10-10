import { useState, useEffect } from 'react'
import { CheckCircle, WarningCircle, X } from '@phosphor-icons/react'

export default function Toast({ message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true))

    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success'
    ? 'bg-success/20 border-success/50'
    : 'bg-danger/20 border-danger/50'

  const iconColor = type === 'success' ? 'text-success' : 'text-danger'

  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl
        ${bgColor}
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}
      `}
    >
      {/* Icon */}
      <span className={iconColor}>
        {type === 'success' ? (
          <CheckCircle className="h-6 w-6" weight="regular" />
        ) : (
          <WarningCircle className="h-6 w-6" weight="regular" />
        )}
      </span>

      {/* Message */}
      <p className="text-sm font-medium text-text">{message}</p>

      {/* Close button */}
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-text-muted hover:text-text transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" weight="regular" />
      </button>
    </div>
  )
}

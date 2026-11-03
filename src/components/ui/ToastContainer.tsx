import React from 'react'
import { Toast } from './Toast'
import { useToastStore } from '../../hooks/useToast'

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-auto"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}

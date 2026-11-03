import React, { useEffect } from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number // 0 for persistent until dismissed
}

export interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    // Error toasts persist longer or require manual dismiss per Issue I7
    const timeout = toast.duration ?? (toast.type === 'error' ? 0 : 4000)
    if (timeout > 0) {
      const timer = setTimeout(() => {
        onDismiss(toast.id)
      }, timeout)
      return () => clearTimeout(timer)
    }
  }, [toast, onDismiss])

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-danger shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
    info: <Info className="w-5 h-5 text-primary shrink-0" />
  }

  const borderBgMap = {
    success: 'bg-white border-teal/30',
    error: 'bg-white border-danger/40 ring-1 ring-danger/10',
    warning: 'bg-white border-warning/40',
    info: 'bg-white border-primary/30'
  }

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border max-w-sm w-full transition-all animate-in slide-in-from-bottom-3 duration-200 ${borderBgMap[toast.type]}`}
    >
      {iconMap[toast.type]}
      <div className="flex-1 text-xs">
        <p className="font-bold text-slate-900">{toast.title}</p>
        {toast.message && <p className="text-slate-600 mt-0.5">{toast.message}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

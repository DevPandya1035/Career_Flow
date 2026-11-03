import { create } from 'zustand'
import type { ToastMessage } from '../components/ui/Toast'

interface ToastStore {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => string
  dismissToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    return id
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
}))

export function useToast() {
  const addToast = useToastStore((state) => state.addToast)
  const dismissToast = useToastStore((state) => state.dismissToast)

  return {
    toast: addToast,
    success: (title: string, message?: string) =>
      addToast({ type: 'success', title, message }),
    error: (title: string, message?: string) =>
      addToast({ type: 'error', title, message }),
    warning: (title: string, message?: string) =>
      addToast({ type: 'warning', title, message }),
    info: (title: string, message?: string) =>
      addToast({ type: 'info', title, message }),
    dismiss: dismissToast
  }
}

'use client'

import { toast } from 'react-toastify'

export const showToast = {
  success: (message: string, options?: { autoClose?: number }) => {
    return toast.success(message, {
      autoClose: options?.autoClose ?? 3000,
      theme: 'light',
    })
  },
  
  error: (message: string, options?: { autoClose?: number }) => {
    return toast.error(message, {
      autoClose: options?.autoClose ?? 3000,
      theme: 'light',
    })
  },
  
  info: (message: string, options?: { autoClose?: number }) => {
    return toast.info(message, {
      autoClose: options?.autoClose ?? 3000,
      theme: 'light',
    })
  },
  
  warning: (message: string, options?: { autoClose?: number }) => {
    return toast.warning(message, {
      autoClose: options?.autoClose ?? 3000,
      theme: 'light',
    })
  },
}

'use client'

import { ToastContainer as ReactToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      style={{ zIndex: 9999 }}
      toastStyle={{ zIndex: 9999 }}
    />
  )
}

import React, { useEffect, useState } from 'react'
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

const ToastBox = ({ data, variant = 'error', onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  const iconMap = {
    success: <CheckCircle className='text-green-500' size={22} />,
    error: <XCircle className='text-red-500' size={22} />,
    warning: <AlertTriangle className='text-yellow-500' size={22} />,
    info: <Info className='text-blue-500' size={22} />,
  }

  const bgColor = {
    success: 'bg-green-100 border-green-500',
    error: 'bg-red-100 border-red-500',
    warning: 'bg-yellow-100 border-yellow-500',
    info: 'bg-blue-100 border-blue-500',
  }

  return (
    <div
      className={`flex items-center border-l-4 ${bgColor[variant]} p-3 rounded-lg shadow-md w-full  animate-slide-in`}
    >
      {iconMap[variant]}
      <span className='ml-3 text-sm font-medium text-gray-700'>{data}</span>
    </div>
  )
}

export default ToastBox

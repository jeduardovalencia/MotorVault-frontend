import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white transition-all duration-300 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
      {isSuccess ? <CheckCircle size={18} /> : <XCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity">
        <X size={16} />
      </button>
    </div>
  )
}

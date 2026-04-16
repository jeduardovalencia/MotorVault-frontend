import { Loader2 } from 'lucide-react'

export function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  }

  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  )
}

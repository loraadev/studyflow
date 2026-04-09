// Botão reutilizável com variantes e suporte a acessibilidade
const variants = {
  primary: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
  secondary: 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
  danger: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  success: 'bg-green-600 text-white border-green-600 hover:bg-green-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
}

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        border rounded-lg transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  )
}
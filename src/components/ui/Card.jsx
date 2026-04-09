// Card reutilizável para agrupar conteúdo
export default function Card({ children, className = '', role, ariaLabel }) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  )
}
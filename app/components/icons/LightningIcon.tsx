interface LightningIconProps {
  className?: string
}

export const LightningIcon = ({ className = "w-4 h-4 text-blue-600" }: LightningIconProps) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)


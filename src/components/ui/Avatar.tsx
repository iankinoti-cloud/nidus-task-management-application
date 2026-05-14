import { getInitials } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface AvatarProps {
  name?: string | null
  email?: string | null
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

export function Avatar({ name, email, avatarUrl, size = 'md', className }: AvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? email ?? 'User avatar'}
        className={cn('rounded-full object-cover', sizes[size], className)}
      />
    )
  }
  return (
    <div
      className={cn(
        'rounded-full bg-violet-700 flex items-center justify-center font-semibold text-white flex-shrink-0',
        sizes[size],
        className
      )}
      title={name ?? email ?? 'User'}
    >
      {getInitials(name, email)}
    </div>
  )
}

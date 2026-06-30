import { Badge } from './ui/badge'
import { getStatusColor, getStatusLabel } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = getStatusColor(status) as 'default' | 'success' | 'warning' | 'danger' | 'info'
  const label = getStatusLabel(status)
  
  return <Badge variant={color}>{label}</Badge>
}

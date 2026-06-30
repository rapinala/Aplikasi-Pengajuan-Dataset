export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    draft: 'default',
    pending: 'warning',
    validated: 'success',
    rejected: 'danger',
    published: 'info',
  }
  return colors[status] || 'default'
}

export function getStatusLabel(status: string) {
  const labels: Record<string, string> = {
    draft: 'Draft',
    pending: 'Menunggu Validasi',
    validated: 'Tervalidasi',
    rejected: 'Ditolak',
    published: 'Dipublikasikan',
  }
  return labels[status] || status
}

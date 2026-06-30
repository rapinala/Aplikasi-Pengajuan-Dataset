'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Users,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react'

interface SidebarProps {
  userRole: 'instansi' | 'walidata' | 'admin'
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  
  const instansiMenus = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/upload', label: 'Upload Dataset', icon: Upload },
    { href: '/dashboard/my-datasets', label: 'Dataset Saya', icon: Database },
    { href: '/dashboard/drafts', label: 'Draft', icon: FileText },
    { href: '/dashboard/discussions', label: 'Forum Walidata', icon: MessageSquare },
  ]
  
  const walidataMenus = [
    { href: '/walidata', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/walidata/pending', label: 'Menunggu Validasi', icon: FileText },
    { href: '/walidata/validated', label: 'Tervalidasi', icon: CheckCircle },
    { href: '/walidata/rejected', label: 'Ditolak', icon: XCircle },
    { href: '/walidata/all-datasets', label: 'Semua Dataset', icon: Database },
    { href: '/walidata/analytics', label: 'Analitik Data', icon: BarChart3 },
    { href: '/walidata/instansi', label: 'Manajemen Instansi', icon: Users },
  ]
  
  const menus = userRole === 'walidata' || userRole === 'admin' ? walidataMenus : instansiMenus
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {menus.map((menu) => {
          const Icon = menu.icon
          const isActive = pathname === menu.href
          
          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{menu.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

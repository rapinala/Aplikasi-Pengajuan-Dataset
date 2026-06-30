import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In production, get from session/auth
  const mockUser = {
    id: 1,
    name: 'Budi Santoso',
    role: 'instansi' as const,
    instansiId: 1,
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={mockUser.role} userName={mockUser.name} userId={mockUser.id} />
      <div className="flex">
        <Sidebar userRole={mockUser.role} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

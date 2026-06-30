import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }

  if (session.role !== 'instansi') {
    redirect('/walidata')
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={session.role} userName={session.name} userId={session.userId} />
      <div className="flex">
        <Sidebar userRole={session.role} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

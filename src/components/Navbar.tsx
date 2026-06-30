'use client'

import Link from 'next/link'
import { Bell, User, LogOut, Database } from 'lucide-react'
import { useState, useEffect } from 'react'

interface NavbarProps {
  userRole: 'instansi' | 'walidata' | 'admin'
  userName: string
  userId: number
}

export function Navbar({ userRole, userName, userId }: NavbarProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications || []))
      .catch(err => console.error('Error fetching notifications:', err))
  }, [userId])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Portal Dataset Pemerintah
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold">Notifikasi</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Tidak ada notifikasi
                    </div>
                  ) : (
                    <div>
                      {notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                            !notif.isRead ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-600">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

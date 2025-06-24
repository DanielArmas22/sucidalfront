'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { RefreshCw } from 'lucide-react'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login')
      } else if (user.role === 'admin') {
        router.push('/admin')
      } else if (user.role === 'student') {
        router.push('/student')
      } else {
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900">Redirigiendo...</p>
        <p className="text-sm text-gray-600">Configurando tu experiencia</p>
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== '/login') {
        router.push('/login')
      } else if (user && pathname === '/login') {
        // Redirigir según el rol del usuario
        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/student')
        }
      } else if (user && pathname === '/') {
        // Redirigir desde la página raíz según el rol
        if (user.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/student')
        }
      }
    }
  }, [user, isLoading, pathname, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    )
  }

  // Si no hay usuario y no está en login, no mostrar nada (la redirección está en progreso)
  if (!user && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}

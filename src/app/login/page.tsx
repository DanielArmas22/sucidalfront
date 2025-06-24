'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { Heart, Shield, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      // La redirección se maneja en el layout principal
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const demoAccounts = [
    {
      type: 'Estudiante',
      email: 'ana.garcia@universidad.edu',
      password: 'demo123',
      icon: Heart,
      color: 'green'
    },
    {
      type: 'Administrador',
      email: 'admin@universidad.edu',
      password: 'admin123',
      icon: Shield,
      color: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Panel izquierdo - Información */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="relative">
              <Heart className="h-12 w-12 text-green-600" />
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bienestar Estudiantil
              </h1>
              <p className="text-sm text-gray-600">
                Sistema de Apoyo Universitario
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Un espacio seguro para ti
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nuestra plataforma te ofrece un ambiente seguro y confidencial donde puedes 
              expresarte libremente, conectar con otros estudiantes y acceder a recursos 
              de apoyo cuando lo necesites.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700">Confidencial</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">Seguro</span>
              </div>
              <div className="flex items-center space-x-2 bg-cyan-100 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-cyan-500 rounded-full"></div>
                <span className="text-sm text-cyan-700">Disponible 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho - Formulario de login */}
        <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa con tu correo institucional para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.correo@universidad.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Cuentas demo */}
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 text-center mb-4">
                Cuentas de demostración:
              </p>
              <div className="grid gap-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon
                  return (
                    <button
                      key={account.email}
                      onClick={() => {
                        setEmail(account.email)
                        setPassword(account.password)
                      }}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 border-dashed transition-colors ${
                        account.color === 'green' 
                          ? 'border-green-300 hover:bg-green-50 hover:border-green-400' 
                          : 'border-blue-300 hover:bg-blue-50 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`h-5 w-5 ${
                          account.color === 'green' ? 'text-green-600' : 'text-blue-600'
                        }`} />
                        <div className="text-left">
                          <div className="text-sm font-medium text-gray-900">
                            {account.type}
                          </div>
                          <div className="text-xs text-gray-500">
                            {account.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        Click para usar
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="text-center">
              <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertProps {
  variant?: "default" | "destructive" | "success" | "warning" | "info"
  className?: string
  children: React.ReactNode
  onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ 
  variant = "default", 
  className, 
  children, 
  onClose 
}) => {
  const variants = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
    success: "bg-green-50 border-green-200 text-green-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    info: "bg-blue-50 border-blue-200 text-blue-900"
  }

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "destructive":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className={cn(
      "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
      variants[variant],
      className
    )}>
      {getIcon()}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="pl-7">
        {children}
      </div>
    </div>
  )
}

const AlertTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => (
  <h5 className={cn("mb-1 font-medium leading-none tracking-tight", className)}>
    {children}
  </h5>
)

const AlertDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)}>
    {children}
  </div>
)

export { Alert, AlertTitle, AlertDescription }
